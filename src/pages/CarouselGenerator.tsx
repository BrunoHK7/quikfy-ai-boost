
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
import { useAutoSave } from "@/hooks/useAutoSave";

// Função para gerar sessionId único
const generateSessionId = () => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 11);
  return `quiz_session_${timestamp}_${randomString}`;
};

const CarouselGenerator = () => {
  const navigate = useNavigate();
  
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
      // Gerar sessionId único
      const sessionId = generateSessionId();
      console.log('🎯 CarouselGenerator - Generated sessionId:', sessionId);

      // Salvar sessionId no localStorage ANTES da chamada
      localStorage.setItem('carouselSessionId', sessionId);

      const { data, error } = await supabase.functions.invoke('webhook-receiver', {
        body: {
          sessionId: sessionId, // Usar sessionId consistente
          topic: formData.topic,
          targetAudience: formData.targetAudience,
          style: formData.style,
          numberOfSlides: formData.numberOfSlides,
          additionalInfo: formData.additionalInfo
        }
      });

      console.log('🔄 Resposta da função webhook-receiver:', { data, error });

      if (error) {
        console.error('Error calling webhook:', error);
        toast.error("Erro ao gerar carrossel. Tente novamente.");
        return;
      }

      // Sucesso - navegar independente da resposta específica
      console.log('✅ Chamada realizada com sucesso, navegando...');
      toast.success("Carrossel sendo gerado!");
      
      // Navegar para a página de resultado com sessionId na URL
      setTimeout(() => {
        navigate(`/carousel-result?sessionId=${sessionId}`);
      }, 1500);

    } catch (error) {
      console.error('Error generating carousel:', error);
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

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
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !formData.topic.trim()}
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
                    Gerar Carrossel
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
