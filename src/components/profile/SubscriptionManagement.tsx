
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, CreditCard, Calendar, Loader2, ExternalLink } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export const SubscriptionManagement = () => {
  const { subscription, loading, checkSubscription } = useSubscription();
  const [refreshLoading, setRefreshLoading] = useState(false);

  const handleRefreshSubscription = async () => {
    setRefreshLoading(true);
    try {
      await checkSubscription();
      toast.success("Status da assinatura atualizado!");
    } catch (error) {
      toast.error("Erro ao atualizar status da assinatura");
    } finally {
      setRefreshLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getPlanColor = (tier: string | null) => {
    switch (tier) {
      case 'Plus':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700';
      case 'Pro':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700';
      case 'VIP':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700';
      default:
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700';
    }
  };

  if (loading) {
    return (
      <Card className="glass border-border bg-card/50">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2 text-purple-600" />
          <span>Carregando informações da assinatura...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-border bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Crown className="w-5 h-5 mr-2 text-purple-600" />
          Gerenciar Assinatura
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Plan */}
        <div className="bg-muted/50 dark:bg-muted/20 rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Plano Atual</span>
            <Badge className={getPlanColor(subscription.subscription_tier)}>
              {subscription.subscribed ? `Plano ${subscription.subscription_tier}` : 'Plano Free'}
            </Badge>
          </div>
          
          {subscription.subscribed && subscription.subscription_end && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-1" />
              Renova em: {formatDate(subscription.subscription_end)}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {subscription.subscribed ? (
            <a 
              href="https://billing.stripe.com/p/login/eVqeVe6un0HO1x78KS0ZW00"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <CreditCard className="w-4 h-4 mr-2" />
                Gerenciar Assinatura
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          ) : (
            <Link to="/pricing">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Crown className="w-4 h-4 mr-2" />
                Assinar um Plano
              </Button>
            </Link>
          )}

          <Button 
            variant="outline" 
            onClick={handleRefreshSubscription}
            disabled={refreshLoading}
            className="w-full border-border text-foreground hover:bg-purple-600 hover:text-white"
          >
            {refreshLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Atualizando...
              </>
            ) : (
              "Atualizar Status da Assinatura"
            )}
          </Button>
        </div>

        {/* Info */}
        <div className="text-sm text-muted-foreground">
          <p>
            {subscription.subscribed 
              ? "Use o portal de gerenciamento para alterar seu plano, método de pagamento ou cancelar sua assinatura."
              : "Assine um plano premium para ter acesso a mais créditos e funcionalidades exclusivas."
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
