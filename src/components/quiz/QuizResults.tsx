import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, CheckCircle } from 'lucide-react';
import { StandardHeader } from '@/components/StandardHeader';
import { useNavigate } from 'react-router-dom';

interface BriefingData {
  objective: string;
  communication_style: string;
  swearing_permission: string;
  emotional_vector: string;
  tone_of_voice: string;
  main_emotion: string;
  content: {
    main_topic: string;
    results_or_story: string;
    contrast: string;
    step_by_step: string[];
    lead_magnet: string | null;
    lead_access_method: string | null;
    product: string | null;
    buy_method: string | null;
  };
  user_id: string;
  project_id: string;
  created_at: string;
}

interface QuizResultsProps {
  answers: Record<string, string>;
  briefingData?: BriefingData | null;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ answers, briefingData }) => {
  const navigate = useNavigate();

  const handleRestart = () => {
    window.location.reload();
  };

  const handleExport = () => {
    if (!briefingData) return;
    
    const briefingText = JSON.stringify(briefingData, null, 2);
    
    const blob = new Blob([briefingText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'carrossel-10x-briefing.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <StandardHeader 
          title="Carrossel 10X" 
          backTo="/"
          showBackButton={false}
        />
        
        <Card className="border-none shadow-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <CardTitle className="text-3xl text-primary">
                Carrossel 10X Criado!
              </CardTitle>
            </div>
            <p className="text-muted-foreground">
              Seu briefing foi enviado com sucesso para processamento. 
              Em breve você receberá seu carrossel de alta conversão!
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {briefingData && (
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Resumo do seu Carrossel 10X:</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-primary">Objetivo:</span>
                      <p>{briefingData.objective}</p>
                    </div>
                    <div>
                      <span className="font-medium text-primary">Estilo de Comunicação:</span>
                      <p>{briefingData.communication_style}</p>
                    </div>
                    <div>
                      <span className="font-medium text-primary">Tom de Voz:</span>
                      <p>{briefingData.tone_of_voice}</p>
                    </div>
                    <div>
                      <span className="font-medium text-primary">Emoção Principal:</span>
                      <p>{briefingData.main_emotion}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-primary">Assunto:</span>
                      <p>{briefingData.content.main_topic}</p>
                    </div>
                    <div>
                      <span className="font-medium text-primary">Vetor Emocional:</span>
                      <p>{briefingData.emotional_vector}</p>
                    </div>
                    <div>
                      <span className="font-medium text-primary">Palavrões:</span>
                      <p>{briefingData.swearing_permission}</p>
                    </div>
                    {briefingData.content.step_by_step.length > 0 && (
                      <div>
                        <span className="font-medium text-primary">Passos:</span>
                        <ul className="list-disc list-inside ml-2">
                          {briefingData.content.step_by_step.slice(0, 3).map((step, index) => (
                            <li key={index} className="text-xs">{step}</li>
                          ))}
                          {briefingData.content.step_by_step.length > 3 && (
                            <li className="text-xs text-muted-foreground">
                              +{briefingData.content.step_by_step.length - 3} mais...
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleExport} className="flex items-center gap-2" disabled={!briefingData}>
                <Download className="h-4 w-4" />
                Exportar Briefing
              </Button>
              
              <Button variant="outline" onClick={handleRestart} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Criar Novo Carrossel 10X
              </Button>
              
              <Button 
                variant="secondary" 
                onClick={() => navigate('/carousel-creator')}
                className="flex items-center gap-2"
              >
                Ver Outros Projetos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
