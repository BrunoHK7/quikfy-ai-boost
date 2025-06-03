
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
    <div className="bg-white border-b sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4 gap-4">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            {showBackButton && (
              <Button
                variant="ghost"
                onClick={() => navigate(backTo)}
                className="flex items-center gap-1 sm:gap-2 shrink-0"
                size="sm"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Voltar</span>
              </Button>
            )}
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
              {title}
            </h1>
          </div>
          {rightContent && (
            <div className="shrink-0">{rightContent}</div>
          )}
        </div>
      </div>
    </div>
  );
};
