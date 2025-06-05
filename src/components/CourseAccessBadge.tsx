
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Users, Star, Crown, Shield } from 'lucide-react';

interface CourseAccessBadgeProps {
  accessLevel: string;
  size?: 'sm' | 'md';
}

const ACCESS_LEVEL_CONFIG = {
  free: {
    label: 'Gratuito',
    icon: Users,
    className: 'bg-green-100 text-green-800 border-green-200'
  },
  plus: {
    label: 'Plus',
    icon: Star,
    className: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  pro: {
    label: 'Pro',
    icon: Crown,
    className: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  vip: {
    label: 'VIP',
    icon: Shield,
    className: 'bg-amber-100 text-amber-800 border-amber-200'
  }
};

export const CourseAccessBadge = ({ accessLevel, size = 'sm' }: CourseAccessBadgeProps) => {
  const config = ACCESS_LEVEL_CONFIG[accessLevel as keyof typeof ACCESS_LEVEL_CONFIG];
  
  if (!config) return null;
  
  const Icon = config.icon;
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  
  return (
    <Badge variant="outline" className={`${config.className} ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
      <Icon className={`${iconSize} mr-1`} />
      {config.label}
    </Badge>
  );
};
