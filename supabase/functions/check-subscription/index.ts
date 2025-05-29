
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    // First, check and expire manual subscriptions
    await supabaseClient.rpc('check_and_expire_manual_subscriptions');
    logStep("Checked and expired manual subscriptions");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Check if user has a manual subscription first
    const { data: existingSubscriber } = await supabaseClient
      .from('subscribers')
      .select('*')
      .eq('email', user.email)
      .single();

    if (existingSubscriber?.manual_subscription && existingSubscriber?.subscribed) {
      logStep("User has active manual subscription", { 
        tier: existingSubscriber.subscription_tier, 
        endDate: existingSubscriber.subscription_end 
      });
      
      return new Response(JSON.stringify({
        subscribed: true,
        subscription_tier: existingSubscriber.subscription_tier,
        subscription_end: existingSubscriber.subscription_end
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Continue with Stripe check for regular subscriptions
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found");
      
      // Only update to free if user doesn't have an active manual subscription
      if (!existingSubscriber?.manual_subscription || !existingSubscriber?.subscribed) {
        logStep("No manual subscription, updating to free plan");
        
        // Update subscribers table
        await supabaseClient.from("subscribers").upsert({
          email: user.email,
          user_id: user.id,
          stripe_customer_id: null,
          subscribed: false,
          subscription_tier: null,
          subscription_end: null,
          manual_subscription: false,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email' });

        // Reset user to free plan
        await supabaseClient.from("user_credits").update({
          plan_type: 'free',
          current_credits: 3,
          total_credits_ever: 3,
          last_reset_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }).eq('user_id', user.id);

        await supabaseClient.from("profiles").update({
          role: 'free',
          updated_at: new Date().toISOString(),
        }).eq('id', user.id);

        logStep("Updated user to free plan");
      } else {
        logStep("User has manual subscription, keeping current plan");
      }
      
      return new Response(JSON.stringify({ 
        subscribed: existingSubscriber?.subscribed || false, 
        subscription_tier: existingSubscriber?.subscription_tier || null, 
        subscription_end: existingSubscriber?.subscription_end || null 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionTier = null;
    let subscriptionEnd = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      logStep("Active subscription found", { subscriptionId: subscription.id, endDate: subscriptionEnd });
      
      // Map price IDs to subscription tiers (UPDATED FOR PRODUCTION)
      const priceId = subscription.items.data[0].price.id;
      const priceToTierMap = {
        "price_1RU8ytIWr4FsaNafQcAWSSx9": "Plus",
        "price_1RU8ytIWr4FsaNafDrOUsZ7R": "Pro", 
        "price_1RU8ytIWr4FsaNafRHNNnlyu": "VIP"
      };
      
      subscriptionTier = priceToTierMap[priceId as keyof typeof priceToTierMap] || null;
      logStep("Determined subscription tier", { priceId, subscriptionTier });

      if (subscriptionTier) {
        // Update user_credits table with new plan and credits
        const planCredits = {
          "Plus": 50,
          "Pro": 200,
          "VIP": 500
        };
        
        const newCredits = planCredits[subscriptionTier as keyof typeof planCredits] || 50;
        const planTypeLower = subscriptionTier.toLowerCase();
        
        logStep("Updating user credits", { planType: planTypeLower, newCredits });
        
        await supabaseClient.from("user_credits").update({
          plan_type: planTypeLower,
          current_credits: newCredits,
          total_credits_ever: newCredits,
          last_reset_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }).eq('user_id', user.id);

        // Update profiles table with new role
        await supabaseClient.from("profiles").update({
          role: planTypeLower,
          updated_at: new Date().toISOString(),
        }).eq('id', user.id);

        // Add credit history entry
        await supabaseClient.from("credit_history").insert({
          user_id: user.id,
          action: 'plan_upgrade',
          credits_used: 0,
          credits_before: 3, // assuming they had free credits before
          credits_after: newCredits,
          description: `Plano atualizado para ${subscriptionTier} - ${newCredits} créditos`,
          status: 'success'
        });

        logStep("Updated user plan and credits", { planType: planTypeLower, newCredits });
      }
    } else {
      logStep("No active subscription found, keeping current plan");
    }

    // Update subscribers table (make sure manual_subscription is false for Stripe subscriptions)
    await supabaseClient.from("subscribers").upsert({
      email: user.email,
      user_id: user.id,
      stripe_customer_id: customerId,
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd,
      manual_subscription: false,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    logStep("Updated database with subscription info", { subscribed: hasActiveSub, subscriptionTier });
    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
