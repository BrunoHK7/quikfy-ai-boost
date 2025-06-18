
import React, { useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface Frame {
  id: string;
  text: string;
  fontSize: number;
  textAlign: 'left' | 'center' | 'right';
  verticalAlign: 'top' | 'center' | 'bottom';
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

interface CanvasPreviewProps {
  dimensions: '1080x1080' | '1080x1350' | '1080x1920';
  currentFrame: Frame;
  marginEnabled: boolean;
  marginHorizontal: number;
  marginVertical: number;
  signatureImage: string | null;
  signaturePosition: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  signatureSize: number;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  dimensions,
  currentFrame,
  marginEnabled,
  marginHorizontal,
  marginVertical,
  signatureImage,
  signaturePosition,
  signatureSize
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    if (document.hidden) {
      console.log('⏸️ Skipping canvas draw - page hidden');
      return;
    }
    drawCanvas();
  }, [currentFrame, marginEnabled, marginHorizontal, marginVertical, signatureImage, signaturePosition, signatureSize, dimensions]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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
    const marginX = marginEnabled ? marginHorizontal * 0.35 : 20;
    const marginY = marginEnabled ? marginVertical * 0.35 : 20;
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
      
      wrapText(ctx, frame.text, textX, marginY, contentWidth, lineHeight, contentHeight, frame.verticalAlign);
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

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, topMargin: number, maxWidth: number, lineHeight: number, contentHeight: number, verticalAlign: 'top' | 'center' | 'bottom') => {
    // Dividir o texto por quebras de linha primeiro
    const paragraphs = text.split('\n');
    const lines: string[] = [];
    
    // Quebrar texto em linhas
    for (let p = 0; p < paragraphs.length; p++) {
      const paragraph = paragraphs[p];
      
      if (paragraph.trim() === '') {
        lines.push('');
        continue;
      }

      const words = paragraph.split(' ');
      let line = '';

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      
      lines.push(line);
    }
    
    // Calcular altura total do texto
    const totalTextHeight = lines.length * lineHeight;
    
    // Ajustar posição Y baseada no alinhamento vertical
    let startY = topMargin + lineHeight; // Posição padrão (topo)
    
    if (verticalAlign === 'center') {
      // Centralizar o texto no meio da área de conteúdo
      startY = topMargin + (contentHeight / 2) - (totalTextHeight / 2) + lineHeight;
    } else if (verticalAlign === 'bottom') {
      // Alinhar o texto na parte inferior da área de conteúdo
      startY = topMargin + contentHeight - totalTextHeight + lineHeight;
    }
    
    // Renderizar as linhas
    for (let i = 0; i < lines.length; i++) {
      const currentY = startY + (i * lineHeight);
      
      // Verificar se a linha está dentro da área visível
      if (currentY >= topMargin && currentY <= topMargin + contentHeight) {
        ctx.fillText(lines[i], x, currentY);
      }
    }
  };

  return (
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
  );
};
