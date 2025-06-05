
import { useProfile } from '@/hooks/useProfile';
import { useSubscription } from '@/hooks/useSubscription';

interface CourseAccessResult {
  hasAccess: boolean;
  requiredPlan: string | null;
  userPlan: string | null;
}

export const useCourseAccess = (courseAccessLevel: string): CourseAccessResult => {
  const { profile } = useProfile();
  const { subscription } = useSubscription();

  // Admin e teste têm acesso a tudo
  if (profile?.role === 'admin' || profile?.role === 'teste') {
    return {
      hasAccess: true,
      requiredPlan: null,
      userPlan: profile.role
    };
  }

  const userPlan = subscription.subscribed ? subscription.subscription_tier?.toLowerCase() : 'free';
  
  // Se o curso é gratuito, todos têm acesso
  if (courseAccessLevel === 'free') {
    return {
      hasAccess: true,
      requiredPlan: null,
      userPlan
    };
  }

  // Hierarquia de planos
  const planHierarchy = {
    free: 0,
    plus: 1,
    pro: 2,
    vip: 3
  };

  const userPlanLevel = planHierarchy[userPlan as keyof typeof planHierarchy] || 0;
  const requiredPlanLevel = planHierarchy[courseAccessLevel as keyof typeof planHierarchy] || 0;

  const hasAccess = userPlanLevel >= requiredPlanLevel;

  return {
    hasAccess,
    requiredPlan: hasAccess ? null : courseAccessLevel,
    userPlan
  };
};
