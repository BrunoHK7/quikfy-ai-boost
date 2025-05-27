
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuizResultsProps {
  answers: Record<string, string>;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ answers }) => {
  const navigate = useNavigate();

  const handleRestart = () => {
    window.location.reload();
  };

  const handleExport = () => {
    const briefingText = Object.entries(answers)
      .map(([questionId, answer]) => `${questionId}: ${answer}`)
      .join('\n\n');
    
    const blob = new Blob([briefingText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'briefing-carrossel.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="border-none shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-primary mb-4">
              🎉 Briefing Concluído!
            </CardTitle>
            <p className="text-muted-foreground">
              Seu briefing para carrossel foi criado com sucesso. 
              Agora você pode usar essas informações para criar conteúdo de alta conversão.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">Resumo do seu briefing:</h3>
              <div className="space-y-3">
                {Object.entries(answers).map(([questionId, answer]) => (
                  <div key={questionId} className="border-l-2 border-primary pl-4">
                    <p className="text-sm text-muted-foreground font-medium">
                      {questionId.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-foreground">{answer}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleExport} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar Briefing
              </Button>
              
              <Button variant="outline" onClick={handleRestart} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Fazer Novo Briefing
              </Button>
              
              <Button 
                variant="secondary" 
                onClick={() => navigate('/carousel-creator')}
                className="flex items-center gap-2"
              >
                Criar Carrossel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
