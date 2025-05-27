
import React, { useState } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { MultipleChoiceQuestion } from '@/components/quiz/MultipleChoiceQuestion';
import { OpenQuestion } from '@/components/quiz/OpenQuestion';
import { QuizResults } from '@/components/quiz/QuizResults';
import { useQuizFlow } from '@/hooks/useQuizFlow';

const CarouselBriefing: React.FC = () => {
  const { t } = useTranslation();
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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <h1 className="text-2xl font-bold text-primary">Carrossel 10X</h1>
            </div>
            <span className="text-sm text-muted-foreground">
              {currentQuestionIndex + 1} de {totalQuestions}
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Question content */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-left text-foreground">
              {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CarouselBriefing;
