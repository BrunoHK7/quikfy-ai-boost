
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Zap, Gift, Briefcase } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useSubscription } from "@/hooks/useSubscription";

export const CreditDisplay = ({ showDetails = false }: { showDetails?: boolean }) => {
  const { profile, loading: profileLoading } = useProfile();
  const { subscription, loading: subscriptionLoading } = useSubscription();

  const loading = profileLoading || subscriptionLoading;

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
      </div>
    );
  }

  if (!profile) return null;

  const isAdmin = profile.role === 'admin';
  const isTeste = profile.role === 'teste';
  
  // Determinar o plano atual
  const getCurrentPlan = () => {
    if (isAdmin) return 'Admin';
    if (isTeste) return 'Pro (Teste)';
    if (subscription.subscribed) {
      return subscription.subscription_tier || 'Free';
    }
    return 'Free';
  };

  const currentPlan = getCurrentPlan();

  const getPlanIcon = () => {
    if (isAdmin) return <Crown className="w-4 h-4 text-yellow-600" />;
    if (isTeste) return <Zap className="w-4 h-4 text-blue-600" />;
    
    switch (subscription.subscription_tier) {
      case 'VIP': return <Crown className="w-4 h-4 text-purple-600" />;
      case 'Pro': return <Zap className="w-4 h-4 text-blue-600" />;
      case 'Plus': return <Briefcase className="w-4 h-4 text-green-600" />;
      default: return <Gift className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPlanColor = () => {
    if (isAdmin) return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700';
    if (isTeste) return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700';
    
    switch (subscription.subscription_tier) {
      case 'VIP': return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700';
      case 'Pro': return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700';
      case 'Plus': return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
    }
  };

  const getPlanDescription = () => {
    if (isAdmin) return 'Acesso administrativo completo';
    if (isTeste) return 'Conta de teste com acesso Pro';
    
    switch (subscription.subscription_tier) {
      case 'VIP': return 'Acesso completo a todas as ferramentas';
      case 'Pro': return 'Acesso avançado com todas as funcionalidades';
      case 'Plus': return 'Acesso intermediário às ferramentas';
      default: return 'Acesso básico às ferramentas';
    }
  };

  if (showDetails) {
    return (
      <Card className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center text-gray-900 dark:text-white">
              {getPlanIcon()}
              <span className="ml-2">Meu Plano</span>
            </h3>
            <Badge className={getPlanColor()}>
              {currentPlan}
            </Badge>
          </div>
          
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-primary mb-2">
              {currentPlan}
            </div>
            <div className="text-sm text-muted-foreground">
              {getPlanDescription()}
            </div>
          </div>

          {subscription.subscription_end && !isAdmin && !isTeste && (
            <div className="text-sm text-muted-foreground text-center">
              <div>Renovação: {new Date(subscription.subscription_end).toLocaleDateString('pt-BR')}</div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {getPlanIcon()}
      <Badge className={getPlanColor()}>
        {currentPlan}
      </Badge>
    </div>
  );
};
