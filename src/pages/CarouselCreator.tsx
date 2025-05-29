import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Save, Plus, Trash2, Upload, Smile, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
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
  textColor: string;
  fontFamily: string;
  backgroundImage?: string;
}

const CarouselCreator = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  
  const [projectName, setProjectName] = useState("Novo Projeto");
  const [dimensions, setDimensions] = useState<'1080x1080' | '1080x1350' | '1080x1920'>('1080x1080');
  const [globalBackgroundColor, setGlobalBackgroundColor] = useState("#FFFFFF");
  const [globalTextColor, setGlobalTextColor] = useState("#131313");
  const [globalFontFamily, setGlobalFontFamily] = useState("Inter");
  const [marginEnabled, setMarginEnabled] = useState(true);
  const [marginSize, setMarginSize] = useState(40);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [signaturePosition, setSignaturePosition] = useState<'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'>('bottom-right');
  const [signatureSize, setSignatureSize] = useState(80);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  
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
      textColor: "#131313",
      fontFamily: "Inter",
      backgroundImage: undefined
    }
  ]);

  const googleFonts = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Source Sans Pro',
    'Raleway', 'PT Sans', 'Lora', 'Merriweather', 'Playfair Display',
    'Oswald', 'Ubuntu', 'Nunito', 'Poppins', 'Arial', 'Georgia', 'Times New Roman',
    'Helvetica', 'Verdana', 'Trebuchet MS', 'Impact', 'Comic Sans MS'
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
  }, [frames, currentFrameIndex, globalBackgroundColor, globalTextColor, globalFontFamily, marginEnabled, marginSize, signatureImage, signaturePosition, signatureSize, dimensions]);

  // Apply global changes to all frames in real-time
  useEffect(() => {
    setFrames(prev => prev.map(frame => ({
      ...frame,
      backgroundColor: frame.backgroundColor === globalBackgroundColor ? globalBackgroundColor : frame.backgroundColor,
      textColor: frame.textColor === globalTextColor ? globalTextColor : frame.textColor,
      fontFamily: frame.fontFamily === globalFontFamily ? globalFontFamily : frame.fontFamily
    })));
  }, [globalBackgroundColor, globalTextColor, globalFontFamily]);

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
      ctx.fillStyle = currentFrame.backgroundColor;
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
      ctx.fillStyle = frame.textColor;
      let fontStyle = '';
      if (frame.isBold) fontStyle += 'bold ';
      if (frame.isItalic) fontStyle += 'italic ';
      
      ctx.font = `${fontStyle}${frame.fontSize * 0.35}px ${frame.fontFamily}`;
      ctx.textAlign = frame.textAlign;
      
      let textX = marginX;
      if (frame.textAlign === 'center') {
        textX = canvas.width / 2;
      } else if (frame.textAlign === 'right') {
        textX = canvas.width - marginX;
      }
      
      const lineHeight = frame.fontSize * 0.35 * frame.lineHeight;
      wrapText(ctx, frame.text, textX, marginY + frame.fontSize * 0.35, contentWidth, lineHeight, contentHeight);
    }

    // Signature
    if (signatureImage) {
      const img = new Image();
      img.onload = () => {
        const sigWidth = signatureSize * 0.35;
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

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxHeight: number) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        // Check if we still have space for another line
        if (currentY + lineHeight <= y + maxHeight - lineHeight) {
          ctx.fillText(line, x, currentY);
          line = words[n] + ' ';
          currentY += lineHeight;
        } else {
          // No more space, truncate with ellipsis
          ctx.fillText(line.trim() + '...', x, currentY);
          return;
        }
      } else {
        line = testLine;
      }
    }
    
    // Check if we have space for the last line
    if (currentY <= y + maxHeight - lineHeight) {
      ctx.fillText(line, x, currentY);
    }
  };

  const updateCurrentFrame = (updates: Partial<Frame>) => {
    setFrames(prev => prev.map((frame, index) => {
      if (index === currentFrameIndex) {
        const updatedFrame = { ...frame, ...updates };
        // Load font if it's being changed
        if (updates.fontFamily) {
          loadGoogleFont(updates.fontFamily);
        }
        return updatedFrame;
      }
      return frame;
    }));
  };

  const updateGlobalFont = (fontFamily: string) => {
    loadGoogleFont(fontFamily);
    setGlobalFontFamily(fontFamily);
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
      backgroundColor: globalBackgroundColor,
      textColor: globalTextColor,
      fontFamily: globalFontFamily,
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

      const actualDims = dimensions.split('x').map(Number);
      canvas.width = actualDims[0];
      canvas.height = actualDims[1];

      if (frame.backgroundImage) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          drawFullSizeContent(ctx, frame, canvas);
          downloadCanvas(canvas, `${projectName}-slide-${index + 1}.png`);
        };
        img.src = frame.backgroundImage;
      } else {
        ctx.fillStyle = frame.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawFullSizeContent(ctx, frame, canvas);
        downloadCanvas(canvas, `${projectName}-slide-${index + 1}.png`);
      }
    });
    
    toast.success("Download iniciado!");
  };

  const drawFullSizeContent = (ctx: CanvasRenderingContext2D, frame: Frame, canvas: HTMLCanvasElement) => {
    const marginX = marginEnabled ? marginSize : 20;
    const marginY = marginEnabled ? marginSize : 20;
    const contentWidth = canvas.width - (marginX * 2);
    const contentHeight = canvas.height - (marginY * 2);

    // Text
    if (frame.text) {
      ctx.fillStyle = frame.textColor;
      let fontStyle = '';
      if (frame.isBold) fontStyle += 'bold ';
      if (frame.isItalic) fontStyle += 'italic ';
      
      ctx.font = `${fontStyle}${frame.fontSize}px ${frame.fontFamily}`;
      ctx.textAlign = frame.textAlign;
      
      let textX = marginX;
      if (frame.textAlign === 'center') {
        textX = canvas.width / 2;
      } else if (frame.textAlign === 'right') {
        textX = canvas.width - marginX;
      }
      
      const lineHeight = frame.fontSize * frame.lineHeight;
      wrapTextFullSize(ctx, frame.text, textX, marginY + frame.fontSize, contentWidth, lineHeight, contentHeight);
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

  const wrapTextFullSize = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxHeight: number) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        // Check if we still have space for another line
        if (currentY + lineHeight <= y + maxHeight - lineHeight) {
          ctx.fillText(line, x, currentY);
          line = words[n] + ' ';
          currentY += lineHeight;
        } else {
          // No more space, truncate with ellipsis
          ctx.fillText(line.trim() + '...', x, currentY);
          return;
        }
      } else {
        line = testLine;
      }
    }
    
    // Check if we have space for the last line
    if (currentY <= y + maxHeight - lineHeight) {
      ctx.fillText(line, x, currentY);
    }
  };

  const downloadCanvas = (canvas: HTMLCanvasElement, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL();
    link.click();
  };

  const saveCarouselProject = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para salvar o projeto");
      return;
    }

    setSaving(true);
    try {
      const projectData = {
        user_id: user.id,
        title: projectName,
        content: JSON.stringify({
          dimensions,
          globalBackgroundColor,
          globalTextColor,
          globalFontFamily,
          marginEnabled,
          marginSize,
          signatureImage,
          signaturePosition,
          signatureSize,
          frames
        })
      };

      const { error } = await supabase
        .from('carousel_projects')
        .insert([projectData]);

      if (error) throw error;

      toast.success("Projeto salvo com sucesso!");
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
      toast.error("Erro ao salvar projeto. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const currentFrame = frames[currentFrameIndex];

  const onEmojiSelect = (emoji: string) => {
    updateCurrentFrame({ text: currentFrame.text + emoji });
    setShowEmojiPicker(false);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      {/* Header */}
      <header className="border-b bg-background border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-purple-600">QUIKFY</div>
                <div className="text-xl font-semibold text-foreground">QuikDesign</div>
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Grátis
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-48 bg-background border-border"
                placeholder="Nome do projeto"
              />
              <Button
                onClick={saveCarouselProject}
                disabled={saving}
                variant="outline"
                className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Salvando..." : "Salvar"}
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
        {/* Left Sidebar - Global Project Settings */}
        <div className="w-80 border-r border-border bg-muted/30 p-6 overflow-y-auto">
          <h3 className="font-semibold text-foreground mb-4 text-center">Configurações Globais</h3>
          
          {/* Dimensões */}
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-3 block">Dimensões</label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={dimensions === '1080x1080' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDimensions('1080x1080')}
                className="text-xs h-12 flex flex-col"
              >
                <div className="font-semibold">1:1</div>
                <div className="text-xs opacity-75">Feed</div>
              </Button>
              <Button
                variant={dimensions === '1080x1350' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDimensions('1080x1350')}
                className="text-xs h-12 flex flex-col"
              >
                <div className="font-semibold">4:5</div>
                <div className="text-xs opacity-75">Vertical</div>
              </Button>
              <Button
                variant={dimensions === '1080x1920' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDimensions('1080x1920')}
                className="text-xs h-12 flex flex-col"
              >
                <div className="font-semibold">9:16</div>
                <div className="text-xs opacity-75">Stories</div>
              </Button>
            </div>
          </div>

          {/* Cores Globais */}
          <div className="mb-6">
            <div className="mb-4">
              <label className="text-sm font-medium text-foreground mb-2 block">Cor do Fundo (Global)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={globalBackgroundColor}
                  onChange={(e) => setGlobalBackgroundColor(e.target.value)}
                  className="w-10 h-8 rounded border border-border"
                />
                <Input
                  value={globalBackgroundColor}
                  onChange={(e) => setGlobalBackgroundColor(e.target.value)}
                  className="flex-1 text-xs bg-background border-border"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Cor do Texto (Global)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={globalTextColor}
                  onChange={(e) => setGlobalTextColor(e.target.value)}
                  className="w-10 h-8 rounded border border-border"
                />
                <Input
                  value={globalTextColor}
                  onChange={(e) => setGlobalTextColor(e.target.value)}
                  className="flex-1 text-xs bg-background border-border"
                />
              </div>
            </div>
          </div>

          {/* Fonte Global */}
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-2 block">Fonte (Global)</label>
            <select
              value={globalFontFamily}
              onChange={(e) => updateGlobalFont(e.target.value)}
              className="w-full p-2 border border-border rounded text-sm bg-background text-foreground"
              style={{ fontFamily: globalFontFamily }}
            >
              {googleFonts.map(font => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Margem */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                id="margin"
                checked={marginEnabled}
                onChange={(e) => setMarginEnabled(e.target.checked)}
                className="rounded accent-purple-600"
              />
              <label htmlFor="margin" className="text-sm font-medium text-foreground">
                Margem
              </label>
            </div>
            {marginEnabled && (
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Tamanho: {marginSize}px</label>
                <input
                  type="range"
                  min="20"
                  max="400"
                  value={marginSize}
                  onChange={(e) => setMarginSize(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>
            )}
          </div>

          {/* Assinatura */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-foreground mb-3">Assinatura</h4>
            <Button
              variant="outline"
              onClick={() => signatureInputRef.current?.click()}
              className="w-full mb-3"
              size="sm"
            >
              <Upload className="h-4 w-4 mr-2" />
              {signatureImage ? 'Alterar' : 'Adicionar'}
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
                <div className="mb-3">
                  <label className="text-xs text-muted-foreground mb-2 block">Posição</label>
                  <select
                    value={signaturePosition}
                    onChange={(e) => setSignaturePosition(e.target.value as any)}
                    className="w-full p-2 border border-border rounded text-sm bg-background text-foreground"
                  >
                    <option value="top-left">Superior Esquerda</option>
                    <option value="top-center">Superior Centro</option>
                    <option value="top-right">Superior Direita</option>
                    <option value="bottom-left">Inferior Esquerda</option>
                    <option value="bottom-center">Inferior Centro</option>
                    <option value="bottom-right">Inferior Direita</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="text-xs text-muted-foreground mb-2 block">Tamanho: {signatureSize}px</label>
                  <input
                    type="range"
                    min="40"
                    max="400"
                    value={signatureSize}
                    onChange={(e) => setSignatureSize(Number(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>

                <Button
                  variant="outline"
                  onClick={() => setSignatureImage(null)}
                  className="w-full text-red-600 text-xs"
                  size="sm"
                >
                  Remover
                </Button>
              </>
            )}
          </div>

          {/* Lista de Quadros */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Quadros</h3>
              <Button 
                onClick={addFrame} 
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white"
                disabled={frames.length >= 10}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {frames.map((frame, index) => (
                <div
                  key={frame.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    currentFrameIndex === index
                      ? "border-purple-500 bg-purple-50 shadow-md dark:bg-purple-900/20 dark:border-purple-400"
                      : "border-border hover:border-purple-300 hover:bg-accent"
                  }`}
                  onClick={() => setCurrentFrameIndex(index)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-foreground">Slide {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFrame(index);
                      }}
                      disabled={frames.length === 1}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{frame.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 flex items-center justify-center p-8 bg-muted/20">
          <div className="bg-background rounded-lg shadow-lg p-6 border border-border">
            <div className="mb-4 text-center">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                {dimensions.replace('x', ' × ')}px
              </Badge>
            </div>
            <div className="border-2 border-border rounded-lg overflow-hidden bg-background">
              <canvas
                ref={canvasRef}
                width={canvasDimensions.width}
                height={canvasDimensions.height}
                className="block bg-background"
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar - Current Slide Controls */}
        <div className="w-80 border-l border-border bg-muted/30 p-6 overflow-y-auto">
          <h3 className="font-semibold text-foreground mb-4 text-center">Slide Atual</h3>
          
          {/* Texto */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-foreground">Texto</label>
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
              className="min-h-[80px] mb-2 bg-background border-border text-foreground"
            />
            {showEmojiPicker && (
              <div className="mb-3">
                <EmojiPicker onSelect={onEmojiSelect} />
              </div>
            )}
          </div>

          {/* Cores do Slide Atual */}
          <div className="mb-6">
            <div className="mb-4">
              <label className="text-sm font-medium text-foreground mb-2 block">Cor do Fundo (Slide)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentFrame?.backgroundColor || globalBackgroundColor}
                  onChange={(e) => updateCurrentFrame({ backgroundColor: e.target.value })}
                  className="w-10 h-8 rounded border border-border"
                />
                <Input
                  value={currentFrame?.backgroundColor || globalBackgroundColor}
                  onChange={(e) => updateCurrentFrame({ backgroundColor: e.target.value })}
                  className="flex-1 text-xs bg-background border-border"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Cor do Texto (Slide)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentFrame?.textColor || globalTextColor}
                  onChange={(e) => updateCurrentFrame({ textColor: e.target.value })}
                  className="w-10 h-8 rounded border border-border"
                />
                <Input
                  value={currentFrame?.textColor || globalTextColor}
                  onChange={(e) => updateCurrentFrame({ textColor: e.target.value })}
                  className="flex-1 text-xs bg-background border-border"
                />
              </div>
            </div>
          </div>

          {/* Fonte do Slide Atual */}
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-2 block">Fonte (Slide)</label>
            <select
              value={currentFrame?.fontFamily || globalFontFamily}
              onChange={(e) => {
                updateCurrentFrame({ fontFamily: e.target.value });
              }}
              className="w-full p-2 border border-border rounded text-sm bg-background text-foreground"
              style={{ fontFamily: currentFrame?.fontFamily || globalFontFamily }}
            >
              {googleFonts.map(font => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Alinhamento */}
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-3 block">Alinhamento</label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={currentFrame?.textAlign === 'left' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateCurrentFrame({ textAlign: 'left' })}
                className="flex items-center justify-center"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={currentFrame?.textAlign === 'center' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateCurrentFrame({ textAlign: 'center' })}
                className="flex items-center justify-center"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant={currentFrame?.textAlign === 'right' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateCurrentFrame({ textAlign: 'right' })}
                className="flex items-center justify-center"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Formatação */}
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-3 block">Formatação</label>
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
          </div>

          {/* Tamanho da Fonte */}
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Tamanho da Fonte: {currentFrame?.fontSize}px
            </label>
            <input
              type="range"
              min="12"
              max="72"
              value={currentFrame?.fontSize || 32}
              onChange={(e) => updateCurrentFrame({ fontSize: Number(e.target.value) })}
              className="w-full accent-purple-600"
            />
          </div>

          {/* Altura da Linha */}
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Altura da Linha: {currentFrame?.lineHeight?.toFixed(1)}
            </label>
            <input
              type="range"
              min="1"
              max="2"
              step="0.1"
              value={currentFrame?.lineHeight || 1.4}
              onChange={(e) => updateCurrentFrame({ lineHeight: Number(e.target.value) })}
              className="w-full accent-purple-600"
            />
          </div>

          {/* Espaçamento de Letras */}
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Espaçamento de Letras: {currentFrame?.letterSpacing}px
            </label>
            <input
              type="range"
              min="-2"
              max="10"
              step="0.5"
              value={currentFrame?.letterSpacing || 0}
              onChange={(e) => updateCurrentFrame({ letterSpacing: Number(e.target.value) })}
              className="w-full accent-purple-600"
            />
          </div>

          {/* Imagem de Fundo do Quadro */}
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-2 block">Imagem de Fundo</label>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full mb-2"
              size="sm"
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
                className="w-full text-red-600 text-xs"
                size="sm"
              >
                Remover Imagem
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselCreator;
