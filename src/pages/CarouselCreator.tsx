
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Save, Palette, Type, Plus, Trash2, ChevronUp, ChevronDown, Upload, Smile } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCarouselProjects } from "@/hooks/useCarouselProjects";
import { EmojiPicker } from "@/components/carousel/EmojiPicker";

interface Frame {
  id: string;
  text: string;
  fontSize: number;
  textAlign: 'left' | 'center' | 'right';
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  lineHeight: number;
  letterSpacing: number;
  backgroundColor: string;
  backgroundImage?: string;
}

const CarouselCreator = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const { saveProject } = useCarouselProjects();
  
  const [projectName, setProjectName] = useState("Novo Projeto");
  const [dimensions, setDimensions] = useState<'1080x1080' | '1080x1350' | '1080x1920'>('1080x1080');
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [textColor, setTextColor] = useState("#131313");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [marginEnabled, setMarginEnabled] = useState(false);
  const [marginSize, setMarginSize] = useState(40);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [signaturePosition, setSignaturePosition] = useState<'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'>('bottom-right');
  const [signatureSize, setSignatureSize] = useState(80);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const [frames, setFrames] = useState<Frame[]>([
    {
      id: '1',
      text: 'Seu título aqui',
      fontSize: 32,
      textAlign: 'center',
      isBold: true,
      isItalic: false,
      isUnderline: false,
      lineHeight: 1.4,
      letterSpacing: 0,
      backgroundColor: "#FFFFFF",
      backgroundImage: undefined
    }
  ]);

  const googleFonts = [
    'Arial', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Source Sans Pro',
    'Raleway', 'PT Sans', 'Lora', 'Merriweather', 'Playfair Display',
    'Oswald', 'Ubuntu', 'Nunito', 'Poppins', 'Inter'
  ];

  const dimensionOptions = [
    { value: '1080x1080', label: 'Feed Quadrado (1080x1080)' },
    { value: '1080x1350', label: 'Feed Vertical (1080x1350)' },
    { value: '1080x1920', label: 'Stories (1080x1920)' }
  ];

  const getDimensionsForCanvas = () => {
    const scale = 0.35;
    switch (dimensions) {
      case '1080x1080':
        return { width: 1080 * scale, height: 1080 * scale };
      case '1080x1350':
        return { width: 1080 * scale, height: 1350 * scale };
      case '1080x1920':
        return { width: 1080 * scale, height: 1920 * scale };
      default:
        return { width: 378, height: 378 };
    }
  };

  const canvasDimensions = getDimensionsForCanvas();

  useEffect(() => {
    drawCanvas();
  }, [frames, currentFrameIndex, backgroundColor, textColor, fontFamily, marginEnabled, marginSize, signatureImage, signaturePosition, signatureSize]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const currentFrame = frames[currentFrameIndex];
    if (!currentFrame) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    if (currentFrame.backgroundImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawContent(ctx, currentFrame);
      };
      img.src = currentFrame.backgroundImage;
    } else {
      ctx.fillStyle = currentFrame.backgroundColor || backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawContent(ctx, currentFrame);
    }
  };

  const drawContent = (ctx: CanvasRenderingContext2D, frame: Frame) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Calculate margins
    const marginX = marginEnabled ? marginSize * 0.35 : 20;
    const marginY = marginEnabled ? marginSize * 0.35 : 20;
    const contentWidth = canvas.width - (marginX * 2);
    const contentHeight = canvas.height - (marginY * 2);

    // Text
    if (frame.text) {
      ctx.fillStyle = textColor;
      let fontStyle = '';
      if (frame.isBold) fontStyle += 'bold ';
      if (frame.isItalic) fontStyle += 'italic ';
      
      ctx.font = `${fontStyle}${frame.fontSize * 0.35}px ${fontFamily}`;
      ctx.textAlign = frame.textAlign;
      
      let textX = marginX;
      if (frame.textAlign === 'center') {
        textX = canvas.width / 2;
      } else if (frame.textAlign === 'right') {
        textX = canvas.width - marginX;
      }
      
      const lineHeight = frame.fontSize * 0.35 * frame.lineHeight;
      wrapText(ctx, frame.text, textX, marginY + frame.fontSize * 0.35, contentWidth, lineHeight);
    }

    // Signature
    if (signatureImage) {
      const img = new Image();
      img.onload = () => {
        const sigWidth = signatureSize * 0.35;
        const sigHeight = (sigWidth * img.height) / img.width;
        
        let sigX = 0;
        let sigY = 0;
        
        // Position signature
        switch (signaturePosition) {
          case 'top-left':
            sigX = marginX;
            sigY = marginY;
            break;
          case 'top-center':
            sigX = (canvas.width - sigWidth) / 2;
            sigY = marginY;
            break;
          case 'top-right':
            sigX = canvas.width - marginX - sigWidth;
            sigY = marginY;
            break;
          case 'bottom-left':
            sigX = marginX;
            sigY = canvas.height - marginY - sigHeight;
            break;
          case 'bottom-center':
            sigX = (canvas.width - sigWidth) / 2;
            sigY = canvas.height - marginY - sigHeight;
            break;
          case 'bottom-right':
            sigX = canvas.width - marginX - sigWidth;
            sigY = canvas.height - marginY - sigHeight;
            break;
        }
        
        ctx.drawImage(img, sigX, sigY, sigWidth, sigHeight);
      };
      img.src = signatureImage;
    }
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  };

  const updateCurrentFrame = (updates: Partial<Frame>) => {
    setFrames(prev => prev.map((frame, index) => 
      index === currentFrameIndex ? { ...frame, ...updates } : frame
    ));
  };

  const addFrame = () => {
    const newFrame: Frame = {
      id: String(frames.length + 1),
      text: `Slide ${frames.length + 1}`,
      fontSize: 32,
      textAlign: 'center',
      isBold: true,
      isItalic: false,
      isUnderline: false,
      lineHeight: 1.4,
      letterSpacing: 0,
      backgroundColor: backgroundColor,
      backgroundImage: undefined
    };
    setFrames(prev => [...prev, newFrame]);
    setCurrentFrameIndex(frames.length);
  };

  const removeFrame = (index: number) => {
    if (frames.length === 1) {
      toast.error("Deve haver pelo menos um quadro");
      return;
    }
    setFrames(prev => prev.filter((_, i) => i !== index));
    if (currentFrameIndex >= frames.length - 1) {
      setCurrentFrameIndex(Math.max(0, frames.length - 2));
    }
  };

  const moveFrame = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= frames.length) return;

    const newFrames = [...frames];
    [newFrames[index], newFrames[newIndex]] = [newFrames[newIndex], newFrames[index]];
    setFrames(newFrames);
    
    if (currentFrameIndex === index) {
      setCurrentFrameIndex(newIndex);
    } else if (currentFrameIndex === newIndex) {
      setCurrentFrameIndex(index);
    }
  };

  const handleBackgroundImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateCurrentFrame({ backgroundImage: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSignatureImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadImages = () => {
    frames.forEach((frame, index) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set actual dimensions
      const actualDims = dimensions.split('x').map(Number);
      canvas.width = actualDims[0];
      canvas.height = actualDims[1];

      // Draw background
      if (frame.backgroundImage) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          drawFullSizeContent(ctx, frame, canvas);
          downloadCanvas(canvas, `${projectName}-slide-${index + 1}.png`);
        };
        img.src = frame.backgroundImage;
      } else {
        ctx.fillStyle = frame.backgroundColor || backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawFullSizeContent(ctx, frame, canvas);
        downloadCanvas(canvas, `${projectName}-slide-${index + 1}.png`);
      }
    });
    
    toast.success("Download iniciado!");
  };

  const drawFullSizeContent = (ctx: CanvasRenderingContext2D, frame: Frame, canvas: HTMLCanvasElement) => {
    // Calculate margins for full size
    const marginX = marginEnabled ? marginSize : 20;
    const marginY = marginEnabled ? marginSize : 20;
    const contentWidth = canvas.width - (marginX * 2);

    // Text
    if (frame.text) {
      ctx.fillStyle = textColor;
      let fontStyle = '';
      if (frame.isBold) fontStyle += 'bold ';
      if (frame.isItalic) fontStyle += 'italic ';
      
      ctx.font = `${fontStyle}${frame.fontSize}px ${fontFamily}`;
      ctx.textAlign = frame.textAlign;
      
      let textX = marginX;
      if (frame.textAlign === 'center') {
        textX = canvas.width / 2;
      } else if (frame.textAlign === 'right') {
        textX = canvas.width - marginX;
      }
      
      const lineHeight = frame.fontSize * frame.lineHeight;
      wrapText(ctx, frame.text, textX, marginY + frame.fontSize, contentWidth, lineHeight);
    }

    // Signature
    if (signatureImage) {
      const img = new Image();
      img.onload = () => {
        const sigWidth = signatureSize;
        const sigHeight = (sigWidth * img.height) / img.width;
        
        let sigX = 0;
        let sigY = 0;
        
        switch (signaturePosition) {
          case 'top-left':
            sigX = marginX;
            sigY = marginY;
            break;
          case 'top-center':
            sigX = (canvas.width - sigWidth) / 2;
            sigY = marginY;
            break;
          case 'top-right':
            sigX = canvas.width - marginX - sigWidth;
            sigY = marginY;
            break;
          case 'bottom-left':
            sigX = marginX;
            sigY = canvas.height - marginY - sigHeight;
            break;
          case 'bottom-center':
            sigX = (canvas.width - sigWidth) / 2;
            sigY = canvas.height - marginY - sigHeight;
            break;
          case 'bottom-right':
            sigX = canvas.width - marginX - sigWidth;
            sigY = canvas.height - marginY - sigHeight;
            break;
        }
        
        ctx.drawImage(img, sigX, sigY, sigWidth, sigHeight);
      };
      img.src = signatureImage;
    }
  };

  const downloadCanvas = (canvas: HTMLCanvasElement, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL();
    link.click();
  };

  const saveCarouselProject = () => {
    const project = {
      id: Date.now().toString(),
      name: projectName,
      dimensions,
      backgroundColor,
      textColor,
      fontFamily,
      marginEnabled,
      marginSize,
      signatureImage,
      signaturePosition,
      signatureSize,
      frames: frames.map(frame => ({
        id: frame.id,
        text: frame.text,
        backgroundColor: frame.backgroundColor,
        textColor,
        fontSize: frame.fontSize,
        textAlign: frame.textAlign,
        isBold: frame.isBold,
        isItalic: frame.isItalic,
        isUnderline: frame.isUnderline,
        lineHeight: frame.lineHeight,
        letterSpacing: frame.letterSpacing,
        backgroundImage: frame.backgroundImage,
        elements: []
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    saveProject(project);
    toast.success("Projeto salvo com sucesso!");
  };

  const currentFrame = frames[currentFrameIndex];

  const onEmojiSelect = (emoji: string) => {
    updateCurrentFrame({ text: currentFrame.text + emoji });
    setShowEmojiPicker(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
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
                <Type className="h-6 w-6 text-purple-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  QuikDesign
                </h1>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Grátis
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-48"
                placeholder="Nome do projeto"
              />
              <Button
                onClick={saveCarouselProject}
                variant="outline"
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              <Button
                onClick={downloadImages}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Frames */}
        <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">Quadros</h3>
            <Button 
              onClick={addFrame} 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={frames.length >= 10}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Quadro
            </Button>
          </div>
          
          <div className="space-y-2">
            {frames.map((frame, index) => (
              <div
                key={frame.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  currentFrameIndex === index
                    ? "border-purple-500 bg-purple-50 shadow-md"
                    : "border-gray-200 hover:border-purple-300 hover:bg-white"
                }`}
                onClick={() => setCurrentFrameIndex(index)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-gray-900">Slide {index + 1}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveFrame(index, 'up');
                      }}
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveFrame(index, 'down');
                      }}
                      disabled={index === frames.length - 1}
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFrame(index);
                      }}
                      disabled={frames.length === 1}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-600 truncate">{frame.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-100">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4 text-center">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {dimensions.replace('x', ' × ')}px
              </Badge>
            </div>
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                width={canvasDimensions.width}
                height={canvasDimensions.height}
                className="block bg-white"
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar - Controls */}
        <div className="w-80 border-l bg-white p-4 overflow-y-auto">
          {/* Project Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Palette className="h-5 w-5 text-purple-600" />
                Configurações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Dimensões</label>
                <select
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value as any)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                >
                  {dimensionOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Fonte</label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                >
                  {googleFonts.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Cor do Fundo</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Cor do Texto</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="margin"
                    checked={marginEnabled}
                    onChange={(e) => setMarginEnabled(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="margin" className="text-sm font-medium text-gray-700">
                    Margem Personalizada
                  </label>
                </div>
                {marginEnabled && (
                  <div>
                    <label className="text-xs text-gray-600">Tamanho: {marginSize}px</label>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={marginSize}
                      onChange={(e) => setMarginSize(Number(e.target.value))}
                      className="w-full mt-1"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Frame Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Type className="h-5 w-5 text-purple-600" />
                Quadro Atual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">Texto</label>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  value={currentFrame?.text || ''}
                  onChange={(e) => updateCurrentFrame({ text: e.target.value })}
                  placeholder="Digite seu texto..."
                  className="min-h-[80px]"
                />
                {showEmojiPicker && (
                  <div className="mt-2">
                    <EmojiPicker onSelect={onEmojiSelect} />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={currentFrame?.textAlign === 'left' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateCurrentFrame({ textAlign: 'left' })}
                  className="text-xs"
                >
                  Esquerda
                </Button>
                <Button
                  variant={currentFrame?.textAlign === 'center' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateCurrentFrame({ textAlign: 'center' })}
                  className="text-xs"
                >
                  Centro
                </Button>
                <Button
                  variant={currentFrame?.textAlign === 'right' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateCurrentFrame({ textAlign: 'right' })}
                  className="text-xs"
                >
                  Direita
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={currentFrame?.isBold ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateCurrentFrame({ isBold: !currentFrame?.isBold })}
                  className="text-xs font-bold"
                >
                  B
                </Button>
                <Button
                  variant={currentFrame?.isItalic ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateCurrentFrame({ isItalic: !currentFrame?.isItalic })}
                  className="text-xs italic"
                >
                  I
                </Button>
                <Button
                  variant={currentFrame?.isUnderline ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateCurrentFrame({ isUnderline: !currentFrame?.isUnderline })}
                  className="text-xs underline"
                >
                  U
                </Button>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Tamanho: {currentFrame?.fontSize}px</label>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={currentFrame?.fontSize || 32}
                  onChange={(e) => updateCurrentFrame({ fontSize: Number(e.target.value) })}
                  className="w-full mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Altura da Linha</label>
                <input
                  type="range"
                  min="1"
                  max="2"
                  step="0.1"
                  value={currentFrame?.lineHeight || 1.4}
                  onChange={(e) => updateCurrentFrame({ lineHeight: Number(e.target.value) })}
                  className="w-full mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Imagem de Fundo</label>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full mt-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundImageUpload}
                  className="hidden"
                />
                {currentFrame?.backgroundImage && (
                  <Button
                    variant="outline"
                    onClick={() => updateCurrentFrame({ backgroundImage: undefined })}
                    className="w-full mt-2 text-red-600"
                  >
                    Remover Imagem
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Signature Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Assinatura</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                onClick={() => signatureInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {signatureImage ? 'Alterar Assinatura' : 'Adicionar Assinatura'}
              </Button>
              <input
                ref={signatureInputRef}
                type="file"
                accept="image/*"
                onChange={handleSignatureUpload}
                className="hidden"
              />

              {signatureImage && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Posição</label>
                    <select
                      value={signaturePosition}
                      onChange={(e) => setSignaturePosition(e.target.value as any)}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
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
                    <label className="text-sm font-medium text-gray-700">Tamanho: {signatureSize}px</label>
                    <input
                      type="range"
                      min="40"
                      max="200"
                      value={signatureSize}
                      onChange={(e) => setSignatureSize(Number(e.target.value))}
                      className="w-full mt-1"
                    />
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setSignatureImage(null)}
                    className="w-full text-red-600"
                  >
                    Remover Assinatura
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CarouselCreator;
