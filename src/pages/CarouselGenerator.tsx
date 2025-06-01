
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Sparkles, Bot, Badge } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCarouselUses } from "@/hooks/useCarouselUses";
import { useAutoSave } from "@/hooks/useAutoSave";

const CarouselGenerator = () => {
  const navigate = useNavigate();
  const { consumeUse, userUses, getCurrentPlanType } = useCarouselUses();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    topic: "",
    targetAudience: "",
    style: "",
    numberOfSlides: "5",
    additionalInfo: ""
  });

  // Auto-save otimizado
  const { loadSavedData } = useAutoSave({
    data: formData,
    key: 'carousel_generator_form',
    debounceMs: 3000,
    enabled: true
  });

  // Carregar dados salvos apenas UMA VEZ na inicialização
  useEffect(() => {
    let mounted = true;

    const loadPreviousForm = async () => {
      try {
        const savedData = await loadSavedData();
        if (savedData && Object.keys(savedData).length > 0 && mounted) {
          console.log('🔄 Carregando formulário anterior...');
          setFormData(savedData);
        }
      } catch (error) {
        console.error('Erro ao carregar formulário salvo:', error);
      }
    };

    loadPreviousForm();

    return () => {
      mounted = false;
    };
  }, []); // Sem dependências para carregar apenas uma vez

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      toast.error("Por favor, insira o tópico do carrossel");
      return;
    }

    setIsGenerating(true);

    try {
      console.log('🎯 CarouselGenerator - Consuming use for generation');
      const useResult = await consumeUse("Geração de carrossel com IA personalizada");
      
      if (!useResult.success) {
        console.error('❌ CarouselGenerator - Failed to consume use:', useResult.error);
        toast.error(useResult.error || "Erro ao consumir uso");
        setIsGenerating(false);
        return;
      }

      console.log('✅ CarouselGenerator - Use consumed successfully:', useResult);

      const { data, error } = await supabase.functions.invoke('webhook-receiver', {
        body: {
          topic: formData.topic,
          targetAudience: formData.targetAudience,
          style: formData.style,
          numberOfSlides: formData.numberOfSlides,
          additionalInfo: formData.additionalInfo
        }
      });

      if (error) {
        console.error('Error calling webhook:', error);
        toast.error("Erro ao gerar carrossel. Tente novamente.");
        return;
      }

      if (data?.session_id) {
        const isUnlimited = useResult.uses_remaining === -1;
        if (isUnlimited) {
          toast.success("Carrossel sendo gerado!");
        } else {
          toast.success(`Carrossel sendo gerado! ${useResult.uses_remaining || 0} usos restantes.`);
        }
        
        // USO NAVIGATE AO INVÉS DE WINDOW.LOCATION.HREF PARA EVITAR RELOAD
        setTimeout(() => {
          navigate(`/carousel-result?session=${data.session_id}`);
        }, 1500);
      } else {
        toast.error("Erro na resposta do servidor");
      }
    } catch (error) {
      console.error('Error generating carousel:', error);
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const currentPlan = getCurrentPlanType();
  const isUnlimited = currentPlan === 'admin' || currentPlan === 'vip' || currentPlan === 'teste';
  const hasUses = isUnlimited || (userUses && userUses.current_uses !== 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <div className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Gerador de Carrossel IA
                </h1>
                <div className="bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                  <Badge className="h-3 w-3" />
                  Auto-save ativo
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {isUnlimited ? (
                  <span className="text-green-600 font-medium">Usos ilimitados</span>
                ) : (
                  <span>
                    {userUses?.current_uses === -1 ? 'Ilimitado' : (userUses?.current_uses || 0)} usos restantes
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-blue-100 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Criar Carrossel com IA
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                Preencha os campos abaixo para gerar um carrossel personalizado com inteligência artificial.
              </p>
              {!hasUses && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 dark:bg-yellow-900/20 dark:border-yellow-700">
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                    Você esgotou seus usos para este plano. Faça upgrade para continuar gerando carrosséis.
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-gray-700 dark:text-gray-300">
                  Tópico do Carrossel *
                </Label>
                <Input
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  placeholder="Ex: Dicas de marketing digital"
                  className="border-blue-200 focus:border-blue-500"
                  disabled={!hasUses}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience" className="text-gray-700 dark:text-gray-300">
                  Público-alvo
                </Label>
                <Input
                  id="targetAudience"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  placeholder="Ex: Empreendedores iniciantes"
                  className="border-blue-200 focus:border-blue-500"
                  disabled={!hasUses}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="style" className="text-gray-700 dark:text-gray-300">
                  Estilo/Tom
                </Label>
                <Input
                  id="style"
                  name="style"
                  value={formData.style}
                  onChange={handleInputChange}
                  placeholder="Ex: Casual e amigável"
                  className="border-blue-200 focus:border-blue-500"
                  disabled={!hasUses}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfSlides" className="text-gray-700 dark:text-gray-300">
                  Número de Slides
                </Label>
                <Input
                  id="numberOfSlides"
                  name="numberOfSlides"
                  type="number"
                  min="3"
                  max="10"
                  value={formData.numberOfSlides}
                  onChange={handleInputChange}
                  className="border-blue-200 focus:border-blue-500"
                  disabled={!hasUses}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo" className="text-gray-700 dark:text-gray-300">
                  Informações Adicionais
                </Label>
                <Textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  placeholder="Adicione qualquer informação extra que possa ajudar na geração do carrossel..."
                  rows={3}
                  className="border-blue-200 focus:border-blue-500"
                  disabled={!hasUses}
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !formData.topic.trim() || !hasUses}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Gerando Carrossel...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {hasUses ? 'Gerar Carrossel (1 uso)' : 'Usos esgotados'}
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <p>* Campos obrigatórios</p>
                <p>O carrossel será gerado em poucos minutos</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CarouselGenerator;
