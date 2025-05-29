
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Save, Palette, Type, Wand2, Sparkles, Instagram, FileImage, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CarouselCreator = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedTemplate, setSelectedTemplate] = useState("minimal");
  const [title, setTitle] = useState("Seu Título Aqui");
  const [subtitle, setSubtitle] = useState("Seu subtítulo personalizado");
  const [backgroundColor, setBackgroundColor] = useState("#4F46E5");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [accentColor, setAccentColor] = useState("#F59E0B");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  const templates = [
    { id: "minimal", name: "Minimalista", description: "Design limpo e elegante" },
    { id: "modern", name: "Moderno", description: "Estilo contemporâneo" },
    { id: "creative", name: "Criativo", description: "Visual impactante" },
    { id: "business", name: "Empresarial", description: "Profissional e sério" }
  ];

  useEffect(() => {
    drawCanvas();
  }, [selectedTemplate, title, subtitle, backgroundColor, textColor, accentColor, backgroundImage]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    if (backgroundImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawContent(ctx);
      };
      img.src = backgroundImage;
    } else {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, backgroundColor);
      gradient.addColorStop(1, adjustBrightness(backgroundColor, -20));
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawContent(ctx);
    }
  };

  const drawContent = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Template-specific styling
    switch (selectedTemplate) {
      case "minimal":
        drawMinimalTemplate(ctx);
        break;
      case "modern":
        drawModernTemplate(ctx);
        break;
      case "creative":
        drawCreativeTemplate(ctx);
        break;
      case "business":
        drawBusinessTemplate(ctx);
        break;
    }

    // Title
    if (title) {
      ctx.fillStyle = textColor;
      ctx.font = "bold 32px Arial";
      ctx.textAlign = "center";
      const titleY = canvas.height / 2 - 30;
      wrapText(ctx, title, canvas.width / 2, titleY, canvas.width - 60, 40);
    }

    // Subtitle
    if (subtitle) {
      ctx.fillStyle = adjustOpacity(textColor, 0.8);
      ctx.font = "18px Arial";
      ctx.textAlign = "center";
      const subtitleY = canvas.height / 2 + 30;
      wrapText(ctx, subtitle, canvas.width / 2, subtitleY, canvas.width - 60, 25);
    }
  };

  const drawMinimalTemplate = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Simple border
    ctx.strokeStyle = adjustOpacity(accentColor, 0.3);
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
  };

  const drawModernTemplate = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Geometric shapes
    ctx.fillStyle = adjustOpacity(accentColor, 0.1);
    ctx.fillRect(0, 0, 80, 80);
    ctx.fillRect(canvas.width - 80, canvas.height - 80, 80, 80);
    
    // Accent line
    ctx.fillStyle = accentColor;
    ctx.fillRect(0, canvas.height - 8, canvas.width, 8);
  };

  const drawCreativeTemplate = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Creative circles
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = adjustOpacity(accentColor, 0.2);
      ctx.beginPath();
      ctx.arc(50 + i * 100, 50, 25, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const drawBusinessTemplate = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Professional header
    ctx.fillStyle = adjustOpacity(accentColor, 0.8);
    ctx.fillRect(0, 0, canvas.width, 60);
    
    // Professional footer
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
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

  const adjustBrightness = (hex: string, percent: number) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  const adjustOpacity = (hex: string, opacity: number) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;
    
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `quikdesign-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    toast.success("Design baixado com sucesso!");
  };

  const saveProject = () => {
    const projectData = {
      title,
      subtitle,
      backgroundColor,
      textColor,
      accentColor,
      selectedTemplate,
      backgroundImage,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(`quikdesign-${Date.now()}`, JSON.stringify(projectData));
    toast.success("Projeto salvo com sucesso!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
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
                <Sparkles className="h-6 w-6 text-purple-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  QuikDesign
                </h1>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Grátis
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={saveProject}
                variant="outline"
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              <Button
                onClick={downloadImage}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Grátis
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Template Selection */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                  <Wand2 className="h-5 w-5 text-purple-600" />
                  Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md"
                        : "border-gray-200 dark:border-gray-600 hover:border-purple-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <h3 className="font-medium text-gray-800 dark:text-white">{template.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{template.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Text Content */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                  <Type className="h-5 w-5 text-purple-600" />
                  Conteúdo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Digite o título..."
                    className="mt-1 border-purple-200 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subtítulo</label>
                  <Textarea
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Digite o subtítulo..."
                    className="mt-1 border-purple-200 focus:border-purple-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Colors & Background */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                  <Palette className="h-5 w-5 text-purple-600" />
                  Design
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Imagem de Fundo</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Escolher Imagem
                    </Button>
                    {backgroundImage && (
                      <Button
                        variant="outline"
                        onClick={() => setBackgroundImage(null)}
                        className="px-3"
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cor de Fundo</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-12 h-10 rounded border border-purple-200"
                      disabled={!!backgroundImage}
                    />
                    <Input
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="border-purple-200 focus:border-purple-500"
                      disabled={!!backgroundImage}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cor do Texto</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-12 h-10 rounded border border-purple-200"
                    />
                    <Input
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="border-purple-200 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cor de Destaque</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-12 h-10 rounded border border-purple-200"
                    />
                    <Input
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="border-purple-200 focus:border-purple-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Canvas Preview */}
          <div className="lg:col-span-2">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                  <FileImage className="h-5 w-5 text-purple-600" />
                  Preview
                  <Badge variant="secondary" className="ml-auto bg-purple-100 text-purple-800">
                    <Instagram className="h-3 w-3 mr-1" />
                    1080x1080px
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="border-2 border-purple-200 rounded-lg overflow-hidden shadow-lg">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={400}
                    className="max-w-full h-auto bg-white"
                  />
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
