
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, Crown, Zap, Instagram } from "lucide-react";
import { useCarouselUses } from "@/hooks/useCarouselUses";
import { useProfile } from "@/hooks/useProfile";

export const CarouselUsesDisplay = ({ showDetails = false }: { showDetails?: boolean }) => {
  const { userUses, loading, getPlanName, getPlanUses, getCurrentPlanType } = useCarouselUses();
  const { profile } = useProfile();

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
      </div>
    );
  }

  if (!userUses) return null;

  const currentPlan = getCurrentPlanType();
  const isAdmin = profile?.role === 'admin' || currentPlan === 'admin';
  const isUnlimited = isAdmin || currentPlan === 'vip';

  const getPlanIcon = () => {
    switch (currentPlan) {
      case 'admin': return <Crown className="w-4 h-4" />;
      case 'vip': return <Zap className="w-4 h-4 text-purple-600" />;
      case 'pro': return <Zap className="w-4 h-4 text-blue-600" />;
      default: return <Instagram className="w-4 h-4" />;
    }
  };

  const getPlanColor = () => {
    if (isAdmin) return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700';
    
    switch (currentPlan) {
      case 'vip': return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700';
      case 'pro': return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700';
      case 'plus': return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
    }
  };

  if (showDetails) {
    return (
      <Card className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center text-gray-900 dark:text-white">
              {getPlanIcon()}
              <span className="ml-2">Usos do Carrossel IA</span>
            </h3>
            <Badge className={getPlanColor()}>
              {isAdmin ? 'Admin' : getPlanName(currentPlan)}
            </Badge>
          </div>
          
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-primary">
              {isUnlimited ? '∞' : userUses.current_uses}
            </div>
            <div className="text-sm text-muted-foreground">
              {isUnlimited ? 'Usos Ilimitados' : 'usos disponíveis'}
            </div>
          </div>

          <div className="text-sm text-muted-foreground text-center">
            <div>Plano: {isAdmin ? 'Administrativo - Ilimitado' : getPlanUses(currentPlan)}</div>
            {!isUnlimited && userUses.total_uses_ever > 0 && (
              <div className="mt-2">
                Total já utilizado: {userUses.total_uses_ever - userUses.current_uses} usos
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
        {isUnlimited ? '∞' : userUses.current_uses} usos
      </Badge>
    </div>
  );
};
