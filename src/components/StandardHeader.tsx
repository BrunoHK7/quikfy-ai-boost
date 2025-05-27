
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StandardHeaderProps {
  title: string;
  showBackButton?: boolean;
  backTo?: string;
  rightContent?: React.ReactNode;
}

export const StandardHeader: React.FC<StandardHeaderProps> = ({
  title,
  showBackButton = true,
  backTo = '/',
  rightContent
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button
            variant="ghost"
            onClick={() => navigate(backTo)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        )}
        <h1 className="text-2xl font-bold text-primary">{title}</h1>
      </div>
      {rightContent && (
        <div>{rightContent}</div>
      )}
    </div>
  );
};
