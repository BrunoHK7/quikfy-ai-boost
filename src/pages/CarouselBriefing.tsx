
import React, { useState } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { MultipleChoiceQuestion } from '@/components/quiz/MultipleChoiceQuestion';
import { OpenQuestion } from '@/components/quiz/OpenQuestion';
import { QuizResults } from '@/components/quiz/QuizResults';
import { StandardHeader } from '@/components/StandardHeader';
import { useQuizFlow } from '@/hooks/useQuizFlow';

const CarouselBriefing: React.FC = () => {
  const { t } = useTranslation();
  // REMOVIDO usePageReload que estava causando problemas
  
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    answers,
    isCompleted,
    isSubmitting,
    handleAnswer,
    goToPreviousQuestion,
    questions,
    briefingData
  } = useQuizFlow();

  if (isCompleted) {
    return <QuizResults answers={answers} briefingData={briefingData} />;
  }

  const question = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Standard Header */}
        <StandardHeader 
          title="Carrossel 10X" 
          backTo="/"
          rightContent={
            <span className="text-xs sm:text-sm text-muted-foreground">
              {currentQuestionIndex + 1} de {totalQuestions}
            </span>
          }
        />
        
        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-6 sm:mb-8">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Question content */}
        <Card className="border-none shadow-lg">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-2xl text-left text-foreground leading-tight">
              {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {question.type === 'multiple' ? (
              <MultipleChoiceQuestion
                options={question.options || []}
                onSelect={(value) => handleAnswer(question.id, value)}
                selectedValue={answers[question.id]}
              />
            ) : (
              <OpenQuestion
                placeholder={question.placeholder || "Digite sua resposta aqui..."}
                onSubmit={(value) => handleAnswer(question.id, value)}
                value={answers[question.id] || ''}
                disabled={isSubmitting}
              />
            )}
            
            {/* Botão de voltar */}
            {currentQuestionIndex > 0 && (
              <div className="flex justify-start mt-6 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={goToPreviousQuestion}
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CarouselBriefing;
