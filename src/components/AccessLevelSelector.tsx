
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Lock, Users, Crown, Star, Shield } from 'lucide-react';

interface AccessLevelSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const ACCESS_LEVELS = [
  {
    value: 'free',
    label: 'Gratuito',
    description: 'Todos os usuários',
    icon: Users,
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  {
    value: 'plus',
    label: 'Plus',
    description: 'Plus, Pro, VIP, Teste e Admin',
    icon: Star,
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    value: 'pro',
    label: 'Pro',
    description: 'Pro, VIP, Teste e Admin',
    icon: Crown,
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  {
    value: 'vip',
    label: 'VIP',
    description: 'VIP, Teste e Admin',
    icon: Shield,
    color: 'bg-amber-100 text-amber-800 border-amber-200'
  }
];

export const AccessLevelSelector = ({ value, onChange, label = 'Nível de Acesso' }: AccessLevelSelectorProps) => {
  const selectedLevel = ACCESS_LEVELS.find(level => level.value === value);

  return (
    <div>
      <Label htmlFor="access-level">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione o nível de acesso">
            {selectedLevel && (
              <div className="flex items-center space-x-2">
                <selectedLevel.icon className="w-4 h-4" />
                <span>{selectedLevel.label}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {ACCESS_LEVELS.map((level) => (
            <SelectItem key={level.value} value={level.value}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <level.icon className="w-4 h-4" />
                  <span>{level.label}</span>
                </div>
                <Badge variant="outline" className={`ml-2 text-xs ${level.color}`}>
                  {level.description}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedLevel && (
        <p className="text-sm text-muted-foreground mt-1">
          Acesso: {selectedLevel.description}
        </p>
      )}
    </div>
  );
};
