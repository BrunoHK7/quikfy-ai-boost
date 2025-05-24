
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
  Download, 
  Copy,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";

const CarouselGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [niche, setNiche] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCarousel, setGeneratedCarousel] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simular geração (aqui você integraria com o GPT personalizado)
    setTimeout(() => {
      const mockCarousel = [
        "🎯 Slide 1: Problema - Você ainda não descobriu o poder da IA?",
        "💡 Slide 2: Agitação - Enquanto isso, seus concorrentes faturam milhões",
        "🚀 Slide 3: Solução - QUIKFY: A plataforma que vai mudar tudo",
        "⚡ Slide 4: Benefício 1 - Automatize 90% do seu marketing",
        "💰 Slide 5: Benefício 2 - Aumente seu faturamento em 300%",
        "🎓 Slide 6: Benefício 3 - Aprenda com quem já faturou milhões",
        "🔥 Slide 7: Prova Social - +50.000 alunos transformados",
        "💎 Slide 8: Oferta - Acesso completo por apenas R$ 30/mês",
        "⏰ Slide 9: Urgência - Vagas limitadas até meia-noite",
        "✅ Slide 10: CTA - Link na bio para garantir sua vaga"
      ];
      
      setGeneratedCarousel(mockCarousel);
      setIsGenerating(false);
    }, 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const copyAllSlides = () => {
    const allText = generatedCarousel.join('\n\n');
    navigator.clipboard.writeText(allText);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">QUIKFY</span>
          </Link>
          <Badge className="bg-purple-100 text-purple-700 border-purple-200">
            <Sparkles className="w-4 h-4 mr-2" />
            IA Carrossel Pro
          </Badge>
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
                <Label htmlFor="prompt">Descreva seu produto/serviço</Label>
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

              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
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
                    Gerar Carrossel com IA
                  </>
                )}
              </Button>

              <div className="text-xs text-gray-500 text-center">
                💡 Dica: Seja específico sobre seu produto e público-alvo para melhores resultados
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2 text-purple-600" />
                  Seu Carrossel Gerado
                </CardTitle>
                {generatedCarousel.length > 0 && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyAllSlides}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar Tudo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {generatedCarousel.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Seu carrossel aparecerá aqui após a geração</p>
                  <p className="text-sm mt-2">Preencha os campos ao lado e clique em "Gerar"</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {generatedCarousel.map((slide, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 relative group">
                      <div className="flex items-start justify-between">
                        <p className="text-gray-800 leading-relaxed flex-1 pr-8">
                          {slide}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(slide)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        {generatedCarousel.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>💡 Dicas para Maximizar Resultados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">📱 Design</h4>
                  <p className="text-purple-700">Use cores contrastantes e fontes legíveis. Cada slide deve ter uma informação principal clara.</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">⏰ Timing</h4>
                  <p className="text-blue-700">Poste nos horários de maior engajamento do seu público (geralmente 19h-21h).</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">📊 Métricas</h4>
                  <p className="text-green-700">Acompanhe alcance, saves e cliques no link. Teste variações do mesmo conteúdo.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CarouselGenerator;
