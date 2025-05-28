
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, Crown, Zap } from "lucide-react";
import { useCredits } from "@/hooks/useCredits";

export const CreditDisplay = ({ showDetails = false }: { showDetails?: boolean }) => {
  const { userCredits, loading, getPlanName, getPlanCredits } = useCredits();

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
      </div>
    );
  }

  if (!userCredits) return null;

  const isAdmin = userCredits.plan_type === 'admin';
  const isUnlimited = isAdmin;

  const getPlanIcon = () => {
    switch (userCredits.plan_type) {
      case 'admin': return <Crown className="w-4 h-4" />;
      case 'vip': return <Zap className="w-4 h-4 text-purple-600" />;
      case 'pro': return <Zap className="w-4 h-4 text-blue-600" />;
      default: return <Coins className="w-4 h-4" />;
    }
  };

  const getPlanColor = () => {
    switch (userCredits.plan_type) {
      case 'admin': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'vip': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'pro': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'essential': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (showDetails) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              {getPlanIcon()}
              <span className="ml-2">Meus Créditos</span>
            </h3>
            <Badge className={getPlanColor()}>
              {getPlanName(userCredits.plan_type)}
            </Badge>
          </div>
          
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-primary">
              {isUnlimited ? '∞' : userCredits.current_credits}
            </div>
            <div className="text-sm text-muted-foreground">
              {isUnlimited ? 'Créditos Ilimitados' : 'créditos disponíveis'}
            </div>
          </div>

          <div className="text-sm text-muted-foreground text-center">
            <div>Plano: {getPlanCredits(userCredits.plan_type)}</div>
            {!isUnlimited && userCredits.total_credits_ever > 0 && (
              <div className="mt-2">
                Total já utilizado: {userCredits.total_credits_ever - userCredits.current_credits} créditos
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {getPlanIcon()}
      <Badge className={getPlanColor()}>
        {isUnlimited ? '∞' : userCredits.current_credits} créditos
      </Badge>
    </div>
  );
};
