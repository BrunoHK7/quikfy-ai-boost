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
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Home,
  Menu,
  X,
  PenTool
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useCarouselProjects, CarouselProject, CarouselFrame, CarouselElement } from "@/hooks/useCarouselProjects";
import { downloadFramesAsZip } from "@/utils/carouselExport";
import { GraphicElementsPicker } from "@/components/carousel/GraphicElementsPicker";
import { EmojiPicker } from "@/components/carousel/EmojiPicker";

const CarouselCreator = () => {
  const { saveProject } = useCarouselProjects();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [project, setProject] = useState<CarouselProject>({
    id: Date.now().toString(),
    name: 'Novo Carrossel',
    dimensions: '1080x1080',
    backgroundColor: '#ffffff',
    textColor: '#131313',
    fontFamily: 'Inter',
    marginEnabled: true,
    marginSize: 250,
    signaturePosition: 'bottom-right',
    signatureSize: 60,
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
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const [activeFrameId, setActiveFrameId] = useState('1');
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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

  const addElement = (element: CarouselElement) => {
    updateActiveFrame({
      elements: [...activeFrame.elements, element]
    });
    toast("Elemento adicionado!");
  };

  const handleEmojiSelect = (emoji: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentText = activeFrame.text;
      const newText = currentText.substring(0, start) + emoji + currentText.substring(end);
      
      updateActiveFrame({ text: newText });
      
      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    }
  };

  const handleSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateProject({ signatureImage: e.target?.result as string });
        toast("Assinatura adicionada!");
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProjectToStorage = async () => {
    setIsSaving(true);
    try {
      const savedProject = saveProject(project);
      updateProject({ id: savedProject.id });
      toast("Projeto salvo com sucesso!");
    } catch (error) {
      toast("Erro ao salvar projeto");
    } finally {
      setIsSaving(false);
    }
  };

  const exportProject = async () => {
    setIsExporting(true);
    try {
      await downloadFramesAsZip(project);
      toast("Download iniciado!");
    } catch (error) {
      toast("Erro ao exportar projeto");
    } finally {
      setIsExporting(false);
    }
  };

  const getDimensions = () => {
    switch (project.dimensions) {
      case '1080x1080':
        return { width: 400, height: 400 };
      case '1080x1350':
        return { width: 400, height: 500 };
      case '1080x1920':
        return { width: 400, height: 712 };
      default:
        return { width: 400, height: 400 };
    }
  };

  const getMarginStyle = () => {
    if (!project.marginEnabled) return {};
    
    const scaleFactor = 400 / 1080; // Scale margin for preview
    const scaledMargin = project.marginSize * scaleFactor;
    
    return {
      padding: `${scaledMargin}px`
    };
  };

  const getSignatureStyle = () => {
    if (!project.signatureImage) return {};
    
    const dimensions = getDimensions();
    const scaleFactor = dimensions.width / 1080;
    const size = project.signatureSize * scaleFactor;
    
    let position = {};
    switch (project.signaturePosition) {
      case 'top-left':
        position = { top: '10px', left: '10px' };
        break;
      case 'top-center':
        position = { top: '10px', left: '50%', transform: 'translateX(-50%)' };
        break;
      case 'top-right':
        position = { top: '10px', right: '10px' };
        break;
      case 'bottom-left':
        position = { bottom: '10px', left: '10px' };
        break;
      case 'bottom-center':
        position = { bottom: '10px', left: '50%', transform: 'translateX(-50%)' };
        break;
      case 'bottom-right':
        position = { bottom: '10px', right: '10px' };
        break;
    }
    
    return {
      position: 'absolute' as const,
      width: `${size}px`,
      height: `${size}px`,
      objectFit: 'contain' as const,
      ...position
    };
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">QUIKFY</span>
              <Badge className="bg-purple-100 text-purple-700">QuikDesign</Badge>
            </Link>
            
            {/* Desktop Header */}
            <div className="hidden md:flex items-center space-x-3">
              <Input
                value={project.name}
                onChange={(e) => updateProject({ name: e.target.value })}
                className="w-48 text-center font-medium"
              />
              <Button onClick={saveProjectToStorage} disabled={isSaving} variant="outline">
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
              <Button onClick={exportProject} disabled={isExporting} className="bg-purple-600 hover:bg-purple-700">
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? "Exportando..." : "Download"}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant="outline"
              size="sm"
              className="md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>

          {/* Mobile Header Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t space-y-3">
              <Input
                value={project.name}
                onChange={(e) => updateProject({ name: e.target.value })}
                className="w-full text-center font-medium"
                placeholder="Nome do projeto"
              />
              <div className="flex space-x-2">
                <Button onClick={saveProjectToStorage} disabled={isSaving} variant="outline" className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Salvando..." : "Salvar"}
                </Button>
                <Button onClick={exportProject} disabled={isExporting} className="flex-1 bg-purple-600 hover:bg-purple-700">
                  <Download className="w-4 h-4 mr-2" />
                  {isExporting ? "Exportando..." : "Download"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Esquerda - Configurações Globais */}
          <div className="lg:col-span-3 space-y-4">
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
                  <div className="grid grid-cols-3 gap-2 mt-1">
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
                    <Button
                      variant={project.dimensions === '1080x1920' ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateProject({ dimensions: '1080x1920' })}
                    >
                      9:16
                    </Button>
                  </div>
                </div>

                {/* Configuração de Margem */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs">Margens</Label>
                    <Switch
                      checked={project.marginEnabled}
                      onCheckedChange={(checked) => updateProject({ marginEnabled: checked })}
                    />
                  </div>
                  {project.marginEnabled && (
                    <div>
                      <Label className="text-xs">Tamanho: {project.marginSize}px</Label>
                      <Slider
                        value={[project.marginSize]}
                        onValueChange={(value) => updateProject({ marginSize: value[0] })}
                        max={400}
                        min={50}
                        step={25}
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>

                {/* Assinatura */}
                <div>
                  <Label className="text-xs">Assinatura</Label>
                  <div className="space-y-2 mt-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleSignatureUpload}
                      className="text-xs"
                    />
                    {project.signatureImage && (
                      <>
                        <div>
                          <Label className="text-xs">Posição</Label>
                          <select
                            value={project.signaturePosition}
                            onChange={(e) => updateProject({ signaturePosition: e.target.value as any })}
                            className="w-full mt-1 p-2 border rounded text-xs"
                          >
                            <option value="top-left">Superior Esquerda</option>
                            <option value="top-center">Superior Centro</option>
                            <option value="top-right">Superior Direita</option>
                            <option value="bottom-left">Inferior Esquerda</option>
                            <option value="bottom-center">Inferior Centro</option>
                            <option value="bottom-right">Inferior Direita</option>
                          </select>
                        </div>
                        <div>
                          <Label className="text-xs">Tamanho: {project.signatureSize}px</Label>
                          <Slider
                            value={[project.signatureSize]}
                            onValueChange={(value) => updateProject({ signatureSize: value[0] })}
                            max={200}
                            min={30}
                            step={10}
                            className="mt-2"
                          />
                        </div>
                      </>
                    )}
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
          <div className="lg:col-span-6">
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
                      backgroundColor: activeFrame.backgroundColor,
                      ...getMarginStyle()
                    }}
                  >
                    {/* Área de Texto */}
                    <div
                      className="absolute inset-0 flex items-center justify-center"
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
                      <div className="w-full h-full flex items-center justify-center text-center p-4">
                        {activeFrame.text}
                      </div>
                    </div>

                    {/* Elementos Gráficos */}
                    {activeFrame.elements.map((element) => (
                      <div
                        key={element.id}
                        className="absolute"
                        style={{
                          left: element.x,
                          top: element.y,
                          width: element.width,
                          height: element.height,
                          backgroundColor: element.type === 'shape' ? element.color : 'transparent'
                        }}
                      >
                        {element.type === 'image' && element.src && (
                          <img
                            src={element.src}
                            alt="Element"
                            className="w-full h-full object-cover"
                          />
                        )}
                        {element.type === 'shape' && element.shape === 'circle' && (
                          <div
                            className="w-full h-full rounded-full"
                            style={{ backgroundColor: element.color }}
                          />
                        )}
                      </div>
                    ))}

                    {/* Assinatura */}
                    {project.signatureImage && (
                      <img
                        src={project.signatureImage}
                        alt="Assinatura"
                        style={getSignatureStyle()}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Direita - Configurações do Quadro */}
          <div className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <Type className="w-4 h-4 mr-2" />
                  Texto do Quadro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Texto</Label>
                    <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                  </div>
                  <Textarea
                    ref={textareaRef}
                    value={activeFrame.text}
                    onChange={(e) => updateActiveFrame({ text: e.target.value })}
                    className="min-h-[100px] text-sm"
                    placeholder="Digite o texto do quadro..."
                  />
                </div>

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
            <GraphicElementsPicker onAddElement={addElement} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselCreator;
