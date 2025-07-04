import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StandardHeader } from '@/components/StandardHeader';
import { Button } from '@/components/ui/button';
import { Copy, Save, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { useWebhookResponse } from '@/hooks/useWebhookResponse';
import { supabase } from '@/integrations/supabase/client';
import { CarouselCard } from '@/components/carousel/CarouselCard';

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
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionIdLoaded, setSessionIdLoaded] = useState(false);
  const { response, isLoading, error, loadingPhase } = useWebhookResponse(sessionId);
  const [carouselContent, setCarouselContent] = useState<CarouselContent>({});
  const [currentLoadingIndex, setCurrentLoadingIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const loadingTexts = {
    initial: [
      'Analisando suas respostas...',
      'Aplicando estratégias de copy...',
      'Criando conexão emocional...',
      'Ajustando tom de voz...',
      'Estruturando carrossel...',
      'Preparando conteúdo...'
    ],
    polling: [
      'Finalizando carrossel...',
      'Verificando qualidade...',
      'Quase pronto...'
    ]
  };

  useEffect(() => {
    console.log('🔍 CarouselResult - Starting sessionId recovery...');
    console.log('📄 Current URL:', window.location.href);
    console.log('📄 Location search:', location.search);
    
    // Tentar recuperar sessionId da URL primeiro (múltiplas variações)
    const urlParams = new URLSearchParams(location.search);
    const urlSessionId = urlParams.get('sessionId') || urlParams.get('session') || urlParams.get('session_id');
    
    // Tentar recuperar do localStorage
    const storedSessionId = localStorage.getItem('carouselSessionId');
    
    console.log('📄 URL sessionId (sessionId):', urlParams.get('sessionId'));
    console.log('📄 URL sessionId (session):', urlParams.get('session'));
    console.log('📄 URL sessionId (session_id):', urlParams.get('session_id'));
    console.log('💾 Stored sessionId:', storedSessionId);
    
    // Priorizar URL, depois localStorage
    const finalSessionId = urlSessionId || storedSessionId;
    
    if (finalSessionId) {
      console.log('✅ SessionId found:', finalSessionId);
      setSessionId(finalSessionId);
      // Garantir que está salvo no localStorage também
      localStorage.setItem('carouselSessionId', finalSessionId);
    } else {
      console.log('❌ No sessionId found, will show error...');
    }
    
    setSessionIdLoaded(true);
  }, [location]);

  useEffect(() => {
    const texts = loadingTexts[loadingPhase];
    const interval = setInterval(() => {
      setCurrentLoadingIndex((prev) => (prev + 1) % texts.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [loadingPhase]);

  useEffect(() => {
    if (response) {
      console.log('✅ Resposta do webhook recebida:', response);
      const parsedContent = parseCarouselContent(response);
      console.log('📋 Conteúdo parseado:', parsedContent);
      setCarouselContent(parsedContent);
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      console.error('❌ Erro no webhook:', error);
      toast({
        title: "Erro",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  const parseCarouselContent = (text: string): CarouselContent => {
    console.log('🔄 Parseando conteúdo:', text);
    
    const sections: CarouselContent = {};
    
    try {
      const jsonData = JSON.parse(text);
      if (jsonData.resposta) {
        text = jsonData.resposta;
      }
    } catch (e) {
      // If not JSON, use text as is
    }
    
    text = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/### /g, '')
      .replace(/## /g, '')
      .replace(/\n\n/g, '\n')
      .trim();
    
    const lines = text.split('\n');
    let currentSection = '';
    let currentContent = '';

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (!trimmedLine || trimmedLine === 'Carrossel de Alto Impacto para Atrair Seguidores') {
        continue;
      }
      
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
      } else if (trimmedLine.toLowerCase().includes('cta') && (trimmedLine.toLowerCase().includes(':') || trimmedLine.toLowerCase().includes('chamada'))) {
        if (currentSection && currentContent) {
          sections[currentSection as keyof CarouselContent] = currentContent.trim();
        }
        currentSection = 'cta';
        currentContent = trimmedLine.replace(/cta.*?:/i, '').trim();
      } else if (currentSection && trimmedLine) {
        if (!trimmedLine.includes('Este carrossel visa') && 
            !trimmedLine.includes('Se desejar') && 
            !trimmedLine.includes('O que deseja fazer')) {
          currentContent += (currentContent ? '\n' : '') + trimmedLine;
        }
      }
    }

    if (currentSection && currentContent) {
      sections[currentSection as keyof CarouselContent] = currentContent.trim();
    }

    Object.keys(sections).forEach(key => {
      const content = sections[key as keyof CarouselContent];
      if (content && content.startsWith('"') && content.endsWith('"')) {
        sections[key as keyof CarouselContent] = content.slice(1, -1);
      }
    });

    console.log('📋 Conteúdo parseado final:', sections);
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

      // Salvar na tabela carousel_projects do Supabase
      const { error } = await supabase
        .from('carousel_projects')
        .insert({
          user_id: user.id,
          title: `Carrossel - ${new Date().toLocaleDateString()}`,
          content: fullContent,
        });

      if (error) throw error;
      
      toast({
        title: "Projeto Salvo!",
        description: "Seu carrossel foi salvo e estará disponível no seu perfil em 'Meus Projetos'.",
      });
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
    // Limpar sessionId
    localStorage.removeItem('carouselSessionId');
    navigate('/carousel-generator');
  };

  // Se ainda estamos carregando o sessionId, mostrar loading
  if (!sessionIdLoaded) {
    return (
      <div className="min-h-screen bg-[#131313] dark:bg-[#131313] p-4">
        <div className="max-w-7xl mx-auto">
          <StandardHeader 
            title="Carrossel 10X" 
            backTo="/carousel-generator"
          />
          
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <h2 className="text-2xl font-bold text-primary">
                Carregando...
              </h2>
              <p className="text-lg text-muted-foreground">
                Verificando sessão...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-[#131313] dark:bg-[#131313] p-4">
        <div className="max-w-7xl mx-auto">
          <StandardHeader 
            title="Carrossel 10X" 
            backTo="/carousel-generator"
          />
          
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-destructive">
                Sessão não encontrada
              </h2>
              <p className="text-muted-foreground">
                Não foi possível identificar a sessão do carrossel.
              </p>
              <div className="text-xs text-muted-foreground space-y-2">
                <p>URL atual: {window.location.href}</p>
                <p>localStorage: {localStorage.getItem('carouselSessionId') || 'vazio'}</p>
              </div>
              <Button onClick={() => navigate('/carousel-generator')} className="mt-4">
                Gerar Novo Carrossel
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    const currentTexts = loadingTexts[loadingPhase];
    const phaseTitle = loadingPhase === 'initial' ? 'Criando seu carrossel...' : 'Finalizando...';
    
    return (
      <div className="min-h-screen bg-[#131313] dark:bg-[#131313] p-4">
        <div className="max-w-7xl mx-auto">
          <StandardHeader 
            title="Carrossel 10X" 
            backTo="/carousel-generator"
          />
          
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <h2 className="text-2xl font-bold text-primary">
                {phaseTitle}
              </h2>
              <p className="text-lg text-muted-foreground">
                {currentTexts[currentLoadingIndex]}
              </p>
              <p className="text-sm text-muted-foreground">
                {loadingPhase === 'initial' ? 
                  'Processando suas respostas...' : 
                  'Verificando se está pronto...'
                }
              </p>
              <p className="text-xs text-muted-foreground">
                Session ID: {sessionId}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full max-w-6xl">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || Object.keys(carouselContent).length === 0) {
    return (
      <div className="min-h-screen bg-[#131313] dark:bg-[#131313] p-4">
        <div className="max-w-7xl mx-auto">
          <StandardHeader 
            title="Carrossel 10X" 
            backTo="/carousel-generator"
          />
          
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-destructive">
                Ops! Algo deu errado
              </h2>
              <p className="text-muted-foreground">
                {error || 'Não conseguimos gerar seu carrossel. Tente novamente.'}
              </p>
              <div className="text-xs text-muted-foreground space-y-2">
                <p>Session ID: {sessionId}</p>
                <p>Erro detalhado: {error}</p>
              </div>
              <Button onClick={generateNewCarousel} className="mt-4">
                Tentar Novamente
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const carouselCards = [
    { key: 'capa', title: 'Capa', color: 'primary' },
    { key: 'contexto', title: 'Contexto', color: 'blue' },
    { key: 'reflexao', title: 'Reflexão', color: 'orange' },
    { key: 'passoAPasso', title: 'Passo a Passo', color: 'green' },
    { key: 'cta', title: 'CTA', color: 'red' }
  ].filter(card => carouselContent[card.key as keyof CarouselContent]);

  return (
    <div className="min-h-screen bg-[#131313] dark:bg-[#131313] p-4">
      <div className="max-w-7xl mx-auto">
        <StandardHeader 
          title="Carrossel 10X" 
          backTo="/carousel-generator"
        />
        
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white dark:text-white">
              Seu Carrossel Está Pronto! 🎉
            </h2>
            <p className="text-gray-300 dark:text-gray-300">
              Aqui estão os {carouselCards?.length || 0} cards do seu carrossel otimizado para conversão
            </p>
          </div>

          {/* Grid de Cards Quadrados */}
          {carouselCards && carouselCards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {carouselCards.map((card, index) => (
                <CarouselCard
                  key={card.key}
                  title={card.title}
                  content={carouselContent[card.key as keyof CarouselContent] || ''}
                  color={card.color}
                  index={index + 1}
                />
              ))}
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 max-w-2xl mx-auto">
            <Button 
              onClick={copyAllContent}
              className="flex-1 flex items-center gap-2"
              variant="outline"
              disabled={Object.keys(carouselContent).length === 0}
            >
              <Copy className="h-4 w-4" />
              Copiar Tudo
            </Button>
            
            <Button 
              onClick={saveProject}
              className="flex-1 flex items-center gap-2"
              disabled={isSaving || Object.keys(carouselContent).length === 0}
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
