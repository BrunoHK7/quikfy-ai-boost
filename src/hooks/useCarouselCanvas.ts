
export const useCarouselCanvas = () => {
  const downloadImages = (
    frames: any[],
    dimensions: string,
    projectName: string,
    marginEnabled: boolean,
    marginHorizontal: number,
    marginVertical: number,
    signatureImage: string | null,
    signaturePosition: string,
    signatureSize: number
  ) => {
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
          drawFullSizeContent(ctx, frame, canvas, marginEnabled, marginHorizontal, marginVertical, signatureImage, signaturePosition, signatureSize);
          downloadCanvas(canvas, `${projectName}-slide-${index + 1}.png`);
        };
        img.src = frame.backgroundImage;
      } else {
        ctx.fillStyle = frame.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawFullSizeContent(ctx, frame, canvas, marginEnabled, marginHorizontal, marginVertical, signatureImage, signaturePosition, signatureSize);
        downloadCanvas(canvas, `${projectName}-slide-${index + 1}.png`);
      }
    });
  };

  const drawFullSizeContent = (
    ctx: CanvasRenderingContext2D, 
    frame: any, 
    canvas: HTMLCanvasElement,
    marginEnabled: boolean,
    marginHorizontal: number,
    marginVertical: number,
    signatureImage: string | null,
    signaturePosition: string,
    signatureSize: number
  ) => {
    const marginX = marginEnabled ? marginHorizontal : 20;
    const marginY = marginEnabled ? marginVertical : 20;
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
      
      wrapTextFullSize(ctx, frame.text, textX, marginY, contentWidth, lineHeight, contentHeight, frame.verticalAlign);
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

  const wrapTextFullSize = (ctx: CanvasRenderingContext2D, text: string, x: number, topMargin: number, maxWidth: number, lineHeight: number, contentHeight: number, verticalAlign: 'top' | 'center' | 'bottom') => {
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

  const downloadCanvas = (canvas: HTMLCanvasElement, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL();
    link.click();
  };

  return { downloadImages };
};
