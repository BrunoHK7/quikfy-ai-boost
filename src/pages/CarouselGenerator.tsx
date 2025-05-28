
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  ImageIcon, 
  Wand2, 
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCredits } from "@/hooks/useCredits";
import { CreditDisplay } from "@/components/credits/CreditDisplay";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface ConsumeCreditsResponse {
  success: boolean;
  error?: string;
  credits_remaining?: number;
  message?: string;
}

const CarouselGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [niche, setNiche] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { userCredits, consumeCredits, refundCredits } = useCredits();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, descreva seu produto/serviço antes de gerar o carrossel.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para gerar carrosséis.",
        variant: "destructive",
      });
      return;
    }

    // Verificar créditos antes de prosseguir
    if (userCredits && userCredits.plan_type !== 'admin' && userCredits.current_credits < 3) {
      toast({
        title: "Créditos insuficientes",
        description: "Você precisa de 3 créditos para gerar um carrossel. Faça um upgrade do seu plano para continuar.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Consumir créditos antes de iniciar a geração
      const creditResult = await consumeCredits(
        'carousel_generation', 
        3, 
        `Geração de carrossel - Nicho: ${niche || 'Não especificado'}`
      ) as ConsumeCreditsResponse;

      if (!creditResult.success) {
        toast({
          title: "Erro ao consumir créditos",
          description: creditResult.error || "Não foi possível processar os créditos.",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }

      // Gerar sessionId único e bem formatado
      const sessionId = `carousel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log('Generated sessionId:', sessionId);
      
      // Armazenar sessionId no localStorage
      localStorage.setItem('carouselSessionId', sessionId);

      // Preparar dados para envio - estrutura clara e consistente
      const webhookData = {
        sessionId: sessionId, // Campo principal
        session_id: sessionId, // Campo backup
        prompt: prompt.trim(),
        niche: niche.trim() || 'Geral',
        userId: user.id,
        timestamp: new Date().toISOString(),
        type: 'carousel_generation'
      };

      console.log('Sending data to webhook:', webhookData);

      // Navegar para resultado ANTES de enviar webhook para evitar timing issues
      navigate('/carousel-result');

      // Enviar para webhook de forma assíncrona
      try {
        const webhookUrl = 'https://ctzzjfasmnimbskpphuy.supabase.co/functions/v1/webhook-receiver';
        
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData)
        });

        const responseData = await response.text();
        console.log('Webhook response:', response.status, responseData);

        if (!response.ok) {
          console.error('Webhook failed with status:', response.status);
          // Como fallback, armazenar diretamente na tabela
          throw new Error('Webhook failed');
        }

      } catch (webhookError) {
        console.error('Webhook error, using fallback:', webhookError);
        
        // Fallback: armazenar diretamente na tabela
        const { supabase } = await import('@/integrations/supabase/client');
        
        const fallbackContent = `## Carrossel de Alto Impacto

**Capa:**
🚀 ${prompt.slice(0, 50)}... pode transformar sua vida!

**Contexto:**
Você sabia que 90% das pessoas fracassam porque não têm o método certo? ${prompt}

**Reflexão:**
Imagine como seria sua vida se você tivesse acesso às estratégias que os grandes experts usam. ${niche ? `No nicho de ${niche}` : 'Em qualquer área'}, o segredo está na execução correta.

**Passo a Passo:**
1️⃣ Identifique seu objetivo principal
2️⃣ Crie um plano de ação específico  
3️⃣ Execute com consistência diária
4️⃣ Meça e ajuste os resultados
5️⃣ Escale o que funciona

**CTA:**
💬 Comenta AÍ se você quer saber mais sobre essa estratégia que já transformou milhares de vidas! Vou responder todo mundo nos comentários 👇`;

        const { error: insertError } = await supabase
          .from('webhook_responses')
          .insert({
            session_id: sessionId,
            content: fallbackContent,
            created_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Fallback storage failed:', insertError);
          throw new Error('Erro ao armazenar resposta');
        }

        console.log('Fallback content stored successfully for session:', sessionId);
      }

    } catch (error) {
      console.error('Error generating carousel:', error);
      
      // Reembolsar créditos em caso de erro
      await refundCredits(3, 'Erro na geração do carrossel - créditos reembolsados');
      
      toast({
        title: "Erro na geração",
        description: "Ocorreu um erro ao gerar o carrossel. Seus créditos foram reembolsados.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  const canGenerate = userCredits && (userCredits.plan_type === 'admin' || userCredits.current_credits >= 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">QUIKFY</span>
          </Link>
          <div className="flex items-center space-x-4">
            <CreditDisplay />
            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
              <Sparkles className="w-4 h-4 mr-2" />
              IA Carrossel Pro
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Gerador de <span className="text-purple-600">Carrossel</span> com IA
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Crie carrosséis irresistíveis que convertem visitantes em clientes. 
            Nossa IA especializada gera conteúdo que vende usando as melhores técnicas de copywriting.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <Target className="w-4 h-4 mr-1 text-purple-600" />
              Alta conversão
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-1 text-purple-600" />
              Testado e aprovado
            </div>
            <div className="flex items-center">
              <Sparkles className="w-4 h-4 mr-1 text-purple-600" />
              IA especializada
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wand2 className="w-5 h-5 mr-2 text-purple-600" />
                Configure seu Carrossel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="niche">Nicho/Área de Atuação</Label>
                <Input
                  id="niche"
                  placeholder="Ex: Marketing Digital, Fitness, Culinária..."
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">Descreva seu produto/serviço *</Label>
                <Textarea
                  id="prompt"
                  placeholder="Ex: Curso completo de marketing digital com IA, ensina desde o básico até estratégias avançadas para faturar 6 dígitos. Inclui ferramentas exclusivas, comunidade VIP e mentoria..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="border-gray-200 min-h-[120px]"
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tom de Voz</Label>
                  <select className="w-full p-2 border border-gray-200 rounded-md">
                    <option>Profissional</option>
                    <option>Amigável</option>
                    <option>Agressivo</option>
                    <option>Inspirador</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Oferta</Label>
                  <select className="w-full p-2 border border-gray-200 rounded-md">
                    <option>Curso</option>
                    <option>Produto Digital</option>
                    <option>Serviço</option>
                    <option>Consultoria</option>
                  </select>
                </div>
              </div>

              {/* Aviso de créditos */}
              {!canGenerate && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">Créditos insuficientes</p>
                    <p className="text-yellow-700">
                      Você precisa de 3 créditos para gerar um carrossel. 
                      Faça um upgrade do seu plano para continuar.
                    </p>
                  </div>
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating || !canGenerate}
                className="w-full bg-purple-600 hover:bg-purple-700 py-3"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Gerando carrossel...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Gerar Carrossel com IA (3 créditos)
                  </>
                )}
              </Button>

              <div className="text-xs text-gray-500 text-center">
                💡 Dica: Seja específico sobre seu produto e público-alvo para melhores resultados
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-purple-600" />
                Preview do Carrossel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Seu carrossel aparecerá aqui após a geração</p>
                <p className="text-sm mt-2">5 cards quadrados organizados em grid</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informações sobre créditos */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>💳 Sistema de Créditos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">🆓 Plano Free</h4>
                <p className="text-gray-700">3 créditos (não renováveis)</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">⚡ Plano Essential</h4>
                <p className="text-green-700">50 créditos/mês (não cumulativos)</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">🚀 Plano Pro</h4>
                <p className="text-blue-700">200 créditos/mês (cumulativos)</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">💎 Plano VIP</h4>
                <p className="text-purple-700">500 créditos/mês (cumulativos)</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">👑 Plano Admin</h4>
                <p className="text-yellow-700">Acesso ilimitado</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Carrossel 10x:</strong> 3 créditos por carrossel gerado. 
                Se ocorrer erro no processo, os créditos são reembolsados automaticamente.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CarouselGenerator;
