
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Save, Palette, Type, Wand2, Sparkles, Instagram, FileImage } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CarouselCreator = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#6366f1");
  const [textColor, setTextColor] = useState("#ffffff");
  const [accentColor, setAccentColor] = useState("#f59e0b");

  const templates = [
    { id: "modern", name: "Moderno", description: "Design limpo e minimalista" },
    { id: "vibrant", name: "Vibrante", description: "Cores vivas e chamativas" },
    { id: "elegant", name: "Elegante", description: "Sofisticado e profissional" },
    { id: "playful", name: "Divertido", description: "Colorido e descontraído" }
  ];

  useEffect(() => {
    drawCanvas();
  }, [selectedTemplate, title, subtitle, backgroundColor, textColor, accentColor]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, backgroundColor);
    gradient.addColorStop(1, adjustBrightness(backgroundColor, -20));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative elements based on template
    drawTemplateElements(ctx, selectedTemplate);

    // Title
    if (title) {
      ctx.fillStyle = textColor;
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";
      const titleY = canvas.height / 2 - 30;
      wrapText(ctx, title, canvas.width / 2, titleY, canvas.width - 100, 60);
    }

    // Subtitle
    if (subtitle) {
      ctx.fillStyle = adjustOpacity(textColor, 0.8);
      ctx.font = "24px Arial";
      ctx.textAlign = "center";
      const subtitleY = canvas.height / 2 + 50;
      wrapText(ctx, subtitle, canvas.width / 2, subtitleY, canvas.width - 100, 30);
    }

    // Brand accent
    ctx.fillStyle = accentColor;
    ctx.fillRect(0, canvas.height - 10, canvas.width, 10);
  };

  const drawTemplateElements = (ctx: CanvasRenderingContext2D, template: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    switch (template) {
      case "modern":
        // Geometric shapes
        ctx.fillStyle = adjustOpacity(accentColor, 0.1);
        ctx.fillRect(0, 0, 100, 100);
        ctx.fillRect(canvas.width - 100, canvas.height - 100, 100, 100);
        break;
      case "vibrant":
        // Colorful circles
        for (let i = 0; i < 5; i++) {
          ctx.fillStyle = adjustOpacity(accentColor, 0.2);
          ctx.beginPath();
          ctx.arc(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            20 + Math.random() * 30,
            0,
            2 * Math.PI
          );
          ctx.fill();
        }
        break;
      case "elegant":
        // Subtle lines
        ctx.strokeStyle = adjustOpacity(textColor, 0.2);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(50, 50);
        ctx.lineTo(canvas.width - 50, 50);
        ctx.moveTo(50, canvas.height - 50);
        ctx.lineTo(canvas.width - 50, canvas.height - 50);
        ctx.stroke();
        break;
      case "playful":
        // Fun shapes
        ctx.fillStyle = adjustOpacity(accentColor, 0.3);
        for (let i = 0; i < 3; i++) {
          const x = 100 + i * 150;
          const y = 100;
          drawStar(ctx, x, y, 5, 20, 40);
        }
        break;
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

  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
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
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(`quikdesign-${Date.now()}`, JSON.stringify(projectData));
    toast.success("Projeto salvo com sucesso!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
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
                <Palette className="h-6 w-6 text-purple-600" />
                <h1 className="text-2xl font-bold">QuikDesign</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={saveProject}
                variant="outline"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              <Button
                onClick={downloadImage}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Text Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Conteúdo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Título</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Digite o título..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Subtítulo</label>
                  <Textarea
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Digite o subtítulo..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Colors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Cores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Fundo</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-12 h-10 rounded border"
                    />
                    <Input
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Texto</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-12 h-10 rounded border"
                    />
                    <Input
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Destaque</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-12 h-10 rounded border"
                    />
                    <Input
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Canvas Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="h-5 w-5" />
                  Preview
                  <Badge variant="secondary" className="ml-auto">
                    1080x1080px
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="border rounded-lg overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={400}
                    className="max-w-full h-auto"
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
