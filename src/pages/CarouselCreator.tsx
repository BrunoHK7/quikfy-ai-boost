
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Download, 
  Save, 
  Plus, 
  Trash2, 
  Move,
  Type,
  Palette,
  Settings,
  Eye,
  Upload,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface CarouselFrame {
  id: string;
  text: string;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  textAlign: 'left' | 'center' | 'right';
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  lineHeight: number;
  letterSpacing: number;
  backgroundImage?: string;
  elements: any[];
}

interface CarouselProject {
  id: string;
  name: string;
  dimensions: '1080x1080' | '1080x1350';
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  frames: CarouselFrame[];
  createdAt: Date;
}

const CarouselCreator = () => {
  const [project, setProject] = useState<CarouselProject>({
    id: '',
    name: 'Novo Carrossel',
    dimensions: '1080x1080',
    backgroundColor: '#ffffff',
    textColor: '#131313',
    fontFamily: 'Inter',
    frames: [
      {
        id: '1',
        text: 'Seu texto aqui...',
        backgroundColor: '#ffffff',
        textColor: '#131313',
        fontSize: 24,
        textAlign: 'center',
        isBold: false,
        isItalic: false,
        isUnderline: false,
        lineHeight: 1.5,
        letterSpacing: 0,
        elements: []
      }
    ],
    createdAt: new Date()
  });

  const [activeFrameId, setActiveFrameId] = useState('1');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAIPanel, setShowAIPanel] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activeFrame = project.frames.find(f => f.id === activeFrameId) || project.frames[0];

  // Google Fonts integration
  const googleFonts = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald', 
    'Source Sans Pro', 'Raleway', 'PT Sans', 'Lora', 'Merriweather',
    'Playfair Display', 'Bebas Neue', 'Dancing Script', 'Lobster'
  ];

  useEffect(() => {
    // Carregar Google Fonts dinamicamente
    googleFonts.forEach(font => {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@300;400;500;600;700&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    });
  }, []);

  const updateProject = (updates: Partial<CarouselProject>) => {
    setProject(prev => ({ ...prev, ...updates }));
  };

  const updateActiveFrame = (updates: Partial<CarouselFrame>) => {
    setProject(prev => ({
      ...prev,
      frames: prev.frames.map(frame => 
        frame.id === activeFrameId 
          ? { ...frame, ...updates }
          : frame
      )
    }));
  };

  const addFrame = () => {
    const newFrame: CarouselFrame = {
      id: (project.frames.length + 1).toString(),
      text: 'Novo quadro...',
      backgroundColor: project.backgroundColor,
      textColor: project.textColor,
      fontSize: 24,
      textAlign: 'center',
      isBold: false,
      isItalic: false,
      isUnderline: false,
      lineHeight: 1.5,
      letterSpacing: 0,
      elements: []
    };
    
    updateProject({
      frames: [...project.frames, newFrame]
    });
    setActiveFrameId(newFrame.id);
    toast("Novo quadro adicionado!");
  };

  const deleteFrame = (frameId: string) => {
    if (project.frames.length === 1) {
      toast("Não é possível excluir o último quadro");
      return;
    }
    
    const newFrames = project.frames.filter(f => f.id !== frameId);
    updateProject({ frames: newFrames });
    
    if (activeFrameId === frameId) {
      setActiveFrameId(newFrames[0].id);
    }
    toast("Quadro excluído!");
  };

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGeneratingAI(true);
    try {
      // Simular geração de IA (aqui você integraria com a API da OpenAI)
      setTimeout(() => {
        const aiFrames = [
          "🎯 Problema: Você ainda não descobriu o poder desta ferramenta?",
          "💡 Agitação: Seus concorrentes já estão criando conteúdo incrível",
          "🚀 Solução: QUIKFY Carrossel - Crie designs profissionais em minutos",
          "⚡ Benefício 1: Interface intuitiva e ferramentas profissionais",
          "💰 Benefício 2: Economize tempo e dinheiro em design",
          "🎓 Benefício 3: Templates e IA para máxima produtividade",
          "🔥 Prova Social: Milhares de criadores já usam",
          "💎 Oferta: Comece a criar agora mesmo",
          "⏰ Urgência: Não perca tempo com ferramentas complexas",
          "✅ CTA: Clique e transforme suas ideias em realidade"
        ];

        const newFrames = aiFrames.map((text, index) => ({
          id: (index + 1).toString(),
          text,
          backgroundColor: project.backgroundColor,
          textColor: project.textColor,
          fontSize: 24,
          textAlign: 'center' as const,
          isBold: false,
          isItalic: false,
          isUnderline: false,
          lineHeight: 1.5,
          letterSpacing: 0,
          elements: []
        }));

        updateProject({ frames: newFrames });
        setActiveFrameId('1');
        setIsGeneratingAI(false);
        setShowAIPanel(false);
        toast("Carrossel gerado com IA!");
      }, 3000);
    } catch (error) {
      toast("Erro ao gerar com IA");
      setIsGeneratingAI(false);
    }
  };

  const saveProject = () => {
    // Aqui você salvaria no Supabase
    toast("Projeto salvo com sucesso!");
  };

  const exportProject = () => {
    // Aqui você implementaria a exportação
    toast("Exportando projeto...");
  };

  const getDimensions = () => {
    return project.dimensions === '1080x1080' 
      ? { width: 400, height: 400 }
      : { width: 400, height: 500 };
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
          
          <div className="flex items-center space-x-3">
            <Input
              value={project.name}
              onChange={(e) => updateProject({ name: e.target.value })}
              className="w-48 text-center font-medium"
            />
            <Button
              onClick={() => setShowAIPanel(!showAIPanel)}
              variant="outline"
              className="border-purple-200"
            >
              <Brain className="w-4 h-4 mr-2" />
              IA
            </Button>
            <Button onClick={saveProject} variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
            <Button onClick={exportProject} className="bg-purple-600 hover:bg-purple-700">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </header>

      {/* AI Panel */}
      {showAIPanel && (
        <div className="border-b bg-purple-50 p-4">
          <div className="container mx-auto max-w-4xl">
            <div className="flex space-x-4">
              <Input
                placeholder="Ex: Gere um carrossel sobre 'Como aumentar vendas com IA'"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={generateWithAI}
                disabled={isGeneratingAI}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isGeneratingAI ? "Gerando..." : "Gerar com IA"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Esquerda - Configurações Globais */}
          <div className="col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações do Projeto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs">Dimensões</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Button
                      variant={project.dimensions === '1080x1080' ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateProject({ dimensions: '1080x1080' })}
                    >
                      1:1
                    </Button>
                    <Button
                      variant={project.dimensions === '1080x1350' ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateProject({ dimensions: '1080x1350' })}
                    >
                      4:5
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Cor do Fundo</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      type="color"
                      value={project.backgroundColor}
                      onChange={(e) => updateProject({ backgroundColor: e.target.value })}
                      className="w-12 h-8 p-1 rounded"
                    />
                    <Input
                      value={project.backgroundColor}
                      onChange={(e) => updateProject({ backgroundColor: e.target.value })}
                      className="flex-1 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Cor da Fonte</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      type="color"
                      value={project.textColor}
                      onChange={(e) => updateProject({ textColor: e.target.value })}
                      className="w-12 h-8 p-1 rounded"
                    />
                    <Input
                      value={project.textColor}
                      onChange={(e) => updateProject({ textColor: e.target.value })}
                      className="flex-1 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Fonte</Label>
                  <select
                    value={project.fontFamily}
                    onChange={(e) => updateProject({ fontFamily: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs"
                  >
                    {googleFonts.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Miniaturas dos Quadros */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Quadros ({project.frames.length}/10)</CardTitle>
                  <Button
                    onClick={addFrame}
                    disabled={project.frames.length >= 10}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {project.frames.map((frame, index) => (
                    <div
                      key={frame.id}
                      className={`relative border-2 rounded p-2 cursor-pointer transition-all ${
                        activeFrameId === frame.id 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setActiveFrameId(frame.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">Quadro {index + 1}</span>
                        {project.frames.length > 1 && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteFrame(frame.id);
                            }}
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-red-500"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 truncate">
                        {frame.text.substring(0, 30)}...
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Área Central - Editor */}
          <div className="col-span-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    Editor - Quadro {project.frames.findIndex(f => f.id === activeFrameId) + 1}
                  </span>
                  <Badge variant="outline">
                    {project.dimensions}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div
                    className="relative border-2 border-gray-300 rounded-lg overflow-hidden"
                    style={{
                      width: getDimensions().width,
                      height: getDimensions().height,
                      backgroundColor: activeFrame.backgroundColor
                    }}
                  >
                    {/* Margens de Segurança */}
                    <div
                      className="absolute inset-0 flex items-center justify-center p-12"
                      style={{
                        fontFamily: project.fontFamily,
                        fontSize: `${activeFrame.fontSize}px`,
                        color: activeFrame.textColor,
                        textAlign: activeFrame.textAlign,
                        lineHeight: activeFrame.lineHeight,
                        letterSpacing: `${activeFrame.letterSpacing}px`,
                        fontWeight: activeFrame.isBold ? 'bold' : 'normal',
                        fontStyle: activeFrame.isItalic ? 'italic' : 'normal',
                        textDecoration: activeFrame.isUnderline ? 'underline' : 'none'
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center text-center">
                        {activeFrame.text}
                      </div>
                    </div>
                    
                    {/* Guias de Margem */}
                    <div className="absolute top-0 left-12 right-12 h-1 bg-purple-200 opacity-50"></div>
                    <div className="absolute bottom-0 left-12 right-12 h-1 bg-purple-200 opacity-50"></div>
                    <div className="absolute top-0 left-12 bottom-0 w-1 bg-purple-200 opacity-50"></div>
                    <div className="absolute top-0 right-12 bottom-0 w-1 bg-purple-200 opacity-50"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Direita - Configurações do Quadro */}
          <div className="col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <Type className="w-4 h-4 mr-2" />
                  Texto do Quadro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={activeFrame.text}
                  onChange={(e) => updateActiveFrame({ text: e.target.value })}
                  className="min-h-[100px] text-sm"
                  placeholder="Digite o texto do quadro..."
                />

                {/* Formatação de Texto */}
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant={activeFrame.isBold ? "default" : "outline"}
                    onClick={() => updateActiveFrame({ isBold: !activeFrame.isBold })}
                  >
                    <Bold className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant={activeFrame.isItalic ? "default" : "outline"}
                    onClick={() => updateActiveFrame({ isItalic: !activeFrame.isItalic })}
                  >
                    <Italic className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant={activeFrame.isUnderline ? "default" : "outline"}
                    onClick={() => updateActiveFrame({ isUnderline: !activeFrame.isUnderline })}
                  >
                    <Underline className="w-3 h-3" />
                  </Button>
                </div>

                {/* Alinhamento */}
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant={activeFrame.textAlign === 'left' ? "default" : "outline"}
                    onClick={() => updateActiveFrame({ textAlign: 'left' })}
                  >
                    <AlignLeft className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant={activeFrame.textAlign === 'center' ? "default" : "outline"}
                    onClick={() => updateActiveFrame({ textAlign: 'center' })}
                  >
                    <AlignCenter className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant={activeFrame.textAlign === 'right' ? "default" : "outline"}
                    onClick={() => updateActiveFrame({ textAlign: 'right' })}
                  >
                    <AlignRight className="w-3 h-3" />
                  </Button>
                </div>

                {/* Tamanho da Fonte */}
                <div>
                  <Label className="text-xs">Tamanho da Fonte: {activeFrame.fontSize}px</Label>
                  <Slider
                    value={[activeFrame.fontSize]}
                    onValueChange={(value) => updateActiveFrame({ fontSize: value[0] })}
                    max={72}
                    min={12}
                    step={2}
                    className="mt-2"
                  />
                </div>

                {/* Espaçamento entre Linhas */}
                <div>
                  <Label className="text-xs">Espaçamento de Linha: {activeFrame.lineHeight}</Label>
                  <Slider
                    value={[activeFrame.lineHeight]}
                    onValueChange={(value) => updateActiveFrame({ lineHeight: value[0] })}
                    max={3}
                    min={0.8}
                    step={0.1}
                    className="mt-2"
                  />
                </div>

                {/* Espaçamento entre Letras */}
                <div>
                  <Label className="text-xs">Espaçamento de Letra: {activeFrame.letterSpacing}px</Label>
                  <Slider
                    value={[activeFrame.letterSpacing]}
                    onValueChange={(value) => updateActiveFrame({ letterSpacing: value[0] })}
                    max={10}
                    min={-2}
                    step={0.5}
                    className="mt-2"
                  />
                </div>

                {/* Cor do Texto Individual */}
                <div>
                  <Label className="text-xs">Cor do Texto (este quadro)</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      type="color"
                      value={activeFrame.textColor}
                      onChange={(e) => updateActiveFrame({ textColor: e.target.value })}
                      className="w-12 h-8 p-1 rounded"
                    />
                    <Input
                      value={activeFrame.textColor}
                      onChange={(e) => updateActiveFrame({ textColor: e.target.value })}
                      className="flex-1 text-xs"
                    />
                  </div>
                </div>

                {/* Cor de Fundo Individual */}
                <div>
                  <Label className="text-xs">Cor de Fundo (este quadro)</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      type="color"
                      value={activeFrame.backgroundColor}
                      onChange={(e) => updateActiveFrame({ backgroundColor: e.target.value })}
                      className="w-12 h-8 p-1 rounded"
                    />
                    <Input
                      value={activeFrame.backgroundColor}
                      onChange={(e) => updateActiveFrame({ backgroundColor: e.target.value })}
                      className="flex-1 text-xs"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Elementos Gráficos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  Elementos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Upload className="w-3 h-3 mr-2" />
                    Upload Imagem
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Palette className="w-3 h-3 mr-2" />
                    Formas
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Type className="w-3 h-3 mr-2" />
                    Ícones
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselCreator;
