
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <CardContent className="p-6 relative">
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="bg-primary rounded-full p-1">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                </div>
              )}
              
              <h3 className={`font-semibold text-lg mb-2 ${
                isSelected ? 'text-primary' : 'text-foreground'
              }`}>
                {option.title}
              </h3>
              
              <p className="text-sm text-muted-foreground">
                {option.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
