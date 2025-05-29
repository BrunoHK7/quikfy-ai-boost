
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';

interface OpenQuestionProps {
  placeholder: string;
  onSubmit: (value: string) => void;
  value: string;
  disabled?: boolean;
}

export const OpenQuestion: React.FC<OpenQuestionProps> = ({
  placeholder,
  onSubmit,
  value: initialValue,
  disabled = false
}) => {
  const [value, setValue] = useState('');

  // Reset value when initialValue changes or becomes empty
  useEffect(() => {
    setValue(initialValue || '');
  }, [initialValue]);

  // Clear value when component unmounts or question changes
  useEffect(() => {
    return () => {
      setValue('');
    };
  }, []);

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      onSubmit(value.trim());
      // Clear the input after submission
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && !disabled) {
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-[120px] text-base resize-none"
        autoFocus
        disabled={disabled}
      />
      
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          className="flex items-center gap-2"
        >
          {disabled ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              Próxima
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Dica: Pressione Ctrl + Enter para avançar
      </p>
    </div>
  );
};
