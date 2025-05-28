
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StandardHeader } from '@/components/StandardHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Save, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface CarouselContent {
  capa?: string;
  contexto?: string;
  reflexao?: string;
  passoAPasso?: string;
  cta?: string;
}

const CarouselResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [carouselContent, setCarouselContent] = useState<CarouselContent>({});
  const [loadingTexts] = useState([
    'Pensando...',
    'Aplicando copy...',
    'Uma pitada de emoção...',
    'Criando conexão...',
    'Ajustando tom...',
    'Finalizando carrossel...'
  ]);
  const [currentLoadingIndex, setCurrentLoadingIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Simulate loading with rotating texts
    const interval = setInterval(() => {
      setCurrentLoadingIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 2000);

    // Simulate API response after 12 seconds
    const timeout = setTimeout(() => {
      setIsLoading(false);
      clearInterval(interval);
      
      // Mock response - in real implementation, this would come from the webhook
      setCarouselContent({
        capa: "🚀 Como Triplicar Suas Vendas Online em 30 Dias\n\nSem gastar uma fortuna com ads ou ter milhares de seguidores",
        contexto: "Você está cansado de ver seus concorrentes vendendo mais que você? Enquanto você luta para fazer uma venda por semana, eles estão faturando milhares por mês. A diferença não é sorte - é estratégia.",
        reflexao: "A verdade é que 90% dos empreendedores falham porque focam nas táticas erradas. Eles acham que precisam de mais seguidores, mais posts, mais ads. Mas o que realmente importa é uma coisa: conversão.",
        passoAPasso: "1. Identifique sua proposta de valor única\n2. Crie um funil de vendas otimizado\n3. Implemente gatilhos de urgência\n4. Automatize o follow-up\n5. Monitore e otimize resultados",
        cta: "Quer descobrir o método completo? Comenta 'QUERO' que eu te mando o passo a passo detalhado no seu DM! 👇"
      });
    }, 12000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [loadingTexts.length]);

  const parseCarouselContent = (text: string): CarouselContent => {
    const sections: CarouselContent = {};
    const lines = text.split('\n');
    let currentSection = '';
    let currentContent = '';

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.toLowerCase().includes('capa:') || trimmedLine.toLowerCase().startsWith('capa')) {
        if (currentSection && currentContent) {
          sections[currentSection as keyof CarouselContent] = currentContent.trim();
        }
        currentSection = 'capa';
        currentContent = trimmedLine.replace(/capa:?/i, '').trim();
      } else if (trimmedLine.toLowerCase().includes('contexto:') || trimmedLine.toLowerCase().startsWith('contexto')) {
        if (currentSection && currentContent) {
          sections[currentSection as keyof CarouselContent] = currentContent.trim();
        }
        currentSection = 'contexto';
        currentContent = trimmedLine.replace(/contexto:?/i, '').trim();
      } else if (trimmedLine.toLowerCase().includes('reflexão:') || trimmedLine.toLowerCase().startsWith('reflexão')) {
        if (currentSection && currentContent) {
          sections[currentSection as keyof CarouselContent] = currentContent.trim();
        }
        currentSection = 'reflexao';
        currentContent = trimmedLine.replace(/reflexão:?/i, '').trim();
      } else if (trimmedLine.toLowerCase().includes('passo a passo:') || trimmedLine.toLowerCase().startsWith('passo a passo')) {
        if (currentSection && currentContent) {
          sections[currentSection as keyof CarouselContent] = currentContent.trim();
        }
        currentSection = 'passoAPasso';
        currentContent = trimmedLine.replace(/passo a passo:?/i, '').trim();
      } else if (trimmedLine.toLowerCase().includes('cta:') || trimmedLine.toLowerCase().startsWith('cta')) {
        if (currentSection && currentContent) {
          sections[currentSection as keyof CarouselContent] = currentContent.trim();
        }
        currentSection = 'cta';
        currentContent = trimmedLine.replace(/cta:?/i, '').trim();
      } else if (currentSection && trimmedLine) {
        currentContent += '\n' + trimmedLine;
      }
    }

    if (currentSection && currentContent) {
      sections[currentSection as keyof CarouselContent] = currentContent.trim();
    }

    return sections;
  };

  const copyAllContent = () => {
    const fullContent = Object.entries(carouselContent)
      .filter(([_, content]) => content)
      .map(([section, content]) => {
        const sectionName = section === 'passoAPasso' ? 'Passo a Passo' : 
                           section.charAt(0).toUpperCase() + section.slice(1);
        return `${sectionName}:\n${content}`;
      })
      .join('\n\n');

    navigator.clipboard.writeText(fullContent);
    toast({
      title: "Copiado!",
      description: "Todo o conteúdo do carrossel foi copiado para a área de transferência.",
    });
  };

  const saveProject = async () => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para salvar o projeto.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const fullContent = Object.entries(carouselContent)
        .filter(([_, content]) => content)
        .map(([section, content]) => {
          const sectionName = section === 'passoAPasso' ? 'Passo a Passo' : 
                             section.charAt(0).toUpperCase() + section.slice(1);
          return `${sectionName}:\n${content}`;
        })
        .join('\n\n');

      const { error } = await supabase
        .from('carousel_projects')
        .insert({
          user_id: user.id,
          title: carouselContent.capa?.substring(0, 100) || 'Carrossel sem título',
          content: fullContent,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Erro ao salvar projeto:', error);
        toast({
          title: "Erro ao Salvar",
          description: "Não foi possível salvar o projeto. Tente novamente.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Projeto Salvo!",
          description: "Seu carrossel foi salvo e estará disponível no seu perfil.",
        });
      }
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
      toast({
        title: "Erro ao Salvar",
        description: "Não foi possível salvar o projeto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const generateNewCarousel = () => {
    navigate('/carousel-generator');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <StandardHeader 
            title="Carrossel 10X" 
            backTo="/carousel-generator"
          />
          
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <h2 className="text-2xl font-bold text-primary">
                {loadingTexts[currentLoadingIndex]}
              </h2>
              <p className="text-muted-foreground">
                Estamos criando seu carrossel personalizado...
              </p>
            </div>
            
            <div className="w-full max-w-2xl space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <StandardHeader 
          title="Carrossel 10X" 
          backTo="/carousel-generator"
        />
        
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-primary">
              Seu Carrossel Está Pronto! 🎉
            </h2>
            <p className="text-muted-foreground">
              Aqui está o seu conteúdo otimizado para conversão
            </p>
          </div>

          <div className="space-y-6">
            {carouselContent.capa && (
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-3">Capa</h3>
                  <p className="text-foreground whitespace-pre-line leading-relaxed">
                    {carouselContent.capa}
                  </p>
                </CardContent>
              </Card>
            )}

            {carouselContent.contexto && (
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-blue-600 mb-3">Contexto</h3>
                  <p className="text-foreground whitespace-pre-line leading-relaxed">
                    {carouselContent.contexto}
                  </p>
                </CardContent>
              </Card>
            )}

            {carouselContent.reflexao && (
              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-orange-600 mb-3">Reflexão</h3>
                  <p className="text-foreground whitespace-pre-line leading-relaxed">
                    {carouselContent.reflexao}
                  </p>
                </CardContent>
              </Card>
            )}

            {carouselContent.passoAPasso && (
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-green-600 mb-3">Passo a Passo</h3>
                  <p className="text-foreground whitespace-pre-line leading-relaxed">
                    {carouselContent.passoAPasso}
                  </p>
                </CardContent>
              </Card>
            )}

            {carouselContent.cta && (
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-purple-600 mb-3">CTA</h3>
                  <p className="text-foreground whitespace-pre-line leading-relaxed">
                    {carouselContent.cta}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <Button 
              onClick={copyAllContent}
              className="flex-1 flex items-center gap-2"
              variant="outline"
            >
              <Copy className="h-4 w-4" />
              Copiar Tudo
            </Button>
            
            <Button 
              onClick={saveProject}
              className="flex-1 flex items-center gap-2"
              disabled={isSaving}
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Salvando...' : 'Salvar Projeto'}
            </Button>
            
            <Button 
              onClick={generateNewCarousel}
              className="flex-1 flex items-center gap-2"
              variant="secondary"
            >
              <RotateCcw className="h-4 w-4" />
              Gerar Novo Carrossel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselResult;
