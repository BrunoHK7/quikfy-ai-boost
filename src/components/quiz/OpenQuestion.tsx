
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface OpenQuestionProps {
  placeholder: string;
  onSubmit: (value: string) => void;
  value: string;
}

export const OpenQuestion: React.FC<OpenQuestionProps> = ({
  placeholder,
  onSubmit,
  value: initialValue
}) => {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
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
      />
      
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="flex items-center gap-2"
        >
          Próxima
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Dica: Pressione Ctrl + Enter para avançar
      </p>
    </div>
  );
};
