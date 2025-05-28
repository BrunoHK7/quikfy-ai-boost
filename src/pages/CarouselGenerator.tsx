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

    if (userCredits && userCredits.plan_type !== 'admin' && userCredits.current_credits < 3) {
      toast({
        title: "Créditos insuficientes",
        description: "Você precisa de 3 créditos para gerar um carrossel.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Consumir créditos
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

      // Gerar sessionId ÚNICO
      const timestamp = Date.now();
      const random = Math.random().toString(36).substr(2, 9);
      const sessionId = `session_${timestamp}_${random}`;
      
      console.log('🚀 Generated sessionId:', sessionId);
      
      // Armazenar no localStorage
      localStorage.setItem('carouselSessionId', sessionId);
      
      // Navegar para resultado ANTES de fazer qualquer requisição
      navigate('/carousel-result');

      // Preparar dados em bundles separados para o Make
      const sessionBundle = {
        sessionId: sessionId,
        timestamp: new Date().toISOString(),
        userId: user.id,
        type: 'carousel_generation'
      };

      const userDataBundle = {
        prompt: prompt.trim(),
        niche: niche.trim() || 'Geral'
      };

      const makeData = {
        session: sessionBundle,
        userData: userDataBundle
      };

      console.log('📤 Sending to Make webhook with separated bundles:', makeData);

      // Enviar para o Make de forma assíncrona
      setTimeout(async () => {
        try {
          // URL do webhook do Make
          const makeWebhookUrl = 'https://hook.us2.make.com/your-make-webhook-url-here';
          
          const response = await fetch(makeWebhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(makeData)
          });

          console.log('📨 Make webhook response status:', response.status);
          
          if (!response.ok) {
            console.error('❌ Make webhook failed:', response.status);
            await createFallbackResponse(sessionId, prompt, niche);
          } else {
            console.log('✅ Make webhook sent successfully');
          }
          
        } catch (error) {
          console.error('❌ Make webhook error:', error);
          await createFallbackResponse(sessionId, prompt, niche);
        }
      }, 100);

    } catch (error) {
      console.error('❌ Error in generation process:', error);
      await refundCredits(3, 'Erro na geração do carrossel - créditos reembolsados');
      
      toast({
        title: "Erro na geração",
        description: "Ocorreu um erro ao gerar o carrossel. Seus créditos foram reembolsados.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  const createFallbackResponse = async (sessionId: string, prompt: string, niche: string) => {
    console.log('🔄 Creating fallback response for session:', sessionId);
    
    const fallbackContent = `### Carrossel de Alto Impacto

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

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { error } = await supabase
        .from('webhook_responses')
        .insert({
          session_id: sessionId,
          content: fallbackContent,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('❌ Fallback storage failed:', error);
      } else {
        console.log('✅ Fallback response stored successfully');
      }
    } catch (err) {
      console.error('❌ Fallback creation error:', err);
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
                  placeholder="Ex: Curso completo de marketing digital com IA, ensina desde o básico até estratégias avançadas para faturar 6 dígitos..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="border-gray-200 min-h-[120px]"
                  rows={6}
                />
              </div>

              {!canGenerate && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">Créditos insuficientes</p>
                    <p className="text-yellow-700">
                      Você precisa de 3 créditos para gerar um carrossel.
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
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CarouselGenerator;
