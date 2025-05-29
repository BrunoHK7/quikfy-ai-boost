
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface Option {
  id: string;
  title: string;
  description: string;
}

interface MultipleChoiceQuestionProps {
  options: Option[];
  onSelect: (value: string) => void;
  selectedValue?: string;
}

export const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  options,
  onSelect,
  selectedValue
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {options.map((option) => {
        const isSelected = selectedValue === option.id;
        
        return (
          <Card
            key={option.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              isSelected 
                ? 'border-primary bg-primary/5 shadow-md' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => onSelect(option.id)}
          >
            <CardContent className="p-4 sm:p-6 relative">
              {isSelected && (
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                  <div className="bg-primary rounded-full p-1">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                </div>
              )}
              
              <h3 className={`font-semibold text-base sm:text-lg mb-2 pr-8 ${
                isSelected ? 'text-primary' : 'text-foreground'
              }`}>
                {option.title}
              </h3>
              
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {option.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
