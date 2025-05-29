
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

    // Check current user profile to see if they are admin or teste
    const { data: currentProfile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdminUser = currentProfile?.role === 'admin' || user.id === 'f870ffbc-d23a-458d-bac5-131291b5676d';
    const isTesteUser = currentProfile?.role === 'teste';

    if (isAdminUser) {
      logStep("User is admin, maintaining admin privileges");
      
      // Ensure admin has proper subscriber record
      await supabaseClient.from("subscribers").upsert({
        email: user.email,
        user_id: user.id,
        stripe_customer_id: null,
        subscribed: true,
        subscription_tier: 'Admin',
        subscription_end: null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });

      return new Response(JSON.stringify({
        subscribed: true,
        subscription_tier: 'Admin',
        subscription_end: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (isTesteUser) {
      logStep("User is teste, maintaining teste privileges");
      
      // Ensure teste user has proper subscriber record
      await supabaseClient.from("subscribers").upsert({
        email: user.email,
        user_id: user.id,
        stripe_customer_id: null,
        subscribed: true,
        subscription_tier: 'Pro',
        subscription_end: null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });

      return new Response(JSON.stringify({
        subscribed: true,
        subscription_tier: 'Pro',
        subscription_end: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Continue with regular Stripe check for normal users
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, updating to free plan");
      
      // Update subscribers table
      await supabaseClient.from("subscribers").upsert({
        email: user.email,
        user_id: user.id,
        stripe_customer_id: null,
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });

      // Update profile to free role
      await supabaseClient.from("profiles").update({
        role: 'free',
        updated_at: new Date().toISOString(),
      }).eq('id', user.id);

      logStep("Updated user to free plan");
      
      return new Response(JSON.stringify({ 
        subscribed: false, 
        subscription_tier: null, 
        subscription_end: null 
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
        const planTypeLower = subscriptionTier.toLowerCase();
        
        logStep("Updating user profile role", { planType: planTypeLower });
        
        // Update profiles table with new role
        await supabaseClient.from("profiles").update({
          role: planTypeLower,
          updated_at: new Date().toISOString(),
        }).eq('id', user.id);

        logStep("Updated user plan", { planType: planTypeLower });
      }
    } else {
      logStep("No active subscription found, updating to free");
      
      // Update profile to free role
      await supabaseClient.from("profiles").update({
        role: 'free',
        updated_at: new Date().toISOString(),
      }).eq('id', user.id);
    }

    // Update subscribers table
    await supabaseClient.from("subscribers").upsert({
      email: user.email,
      user_id: user.id,
      stripe_customer_id: customerId,
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd,
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
