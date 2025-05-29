
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Sparkles, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCredits } from "@/hooks/useCredits";

const CarouselGenerator = () => {
  const navigate = useNavigate();
  const { consumeCredits } = useCredits();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    topic: "",
    targetAudience: "",
    style: "",
    numberOfSlides: "5",
    additionalInfo: ""
  });

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
      // Consume credits before generating
      const creditResult = await consumeCredits("carousel_generation", 3, "Geração de carrossel com IA");
      
      if (!creditResult.success) {
        toast.error(creditResult.error || "Erro ao consumir créditos");
        setIsGenerating(false);
        return;
      }

      // Call the webhook function
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
        toast.success("Carrossel sendo gerado! Redirecionando...");
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
                    Gerar Carrossel (3 créditos)
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
