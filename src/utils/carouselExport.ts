
import { CarouselProject, CarouselFrame } from '@/hooks/useCarouselProjects';

export const generateFrameImage = async (
  frame: CarouselFrame,
  project: CarouselProject,
  frameIndex: number
): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');

  // Set canvas dimensions
  const [width, height] = project.dimensions === '1080x1080' ? [1080, 1080] : [1080, 1350];
  canvas.width = width;
  canvas.height = height;

  // Set background
  ctx.fillStyle = frame.backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // Draw background image if exists
  if (frame.backgroundImage) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = frame.backgroundImage!;
      });
      ctx.drawImage(img, 0, 0, width, height);
    } catch (error) {
      console.warn('Failed to load background image:', error);
    }
  }

  // Calculate text area with margins
  const margin = project.marginEnabled ? project.marginSize : 0;
  const textX = margin;
  const textY = margin;
  const textWidth = width - (margin * 2);
  const textHeight = height - (margin * 2);

  // Draw margin guides (visual only, not in export)
  if (project.marginEnabled) {
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(margin, margin, textWidth, textHeight);
  }

  // Set text properties
  const fontSize = frame.fontSize * (width / 400); // Scale for export
  let fontStyle = '';
  if (frame.isBold) fontStyle += 'bold ';
  if (frame.isItalic) fontStyle += 'italic ';
  
  ctx.font = `${fontStyle}${fontSize}px ${project.fontFamily}`;
  ctx.fillStyle = frame.textColor;
  ctx.textAlign = frame.textAlign;

  // Calculate text position based on alignment
  let textStartX = textX;
  if (frame.textAlign === 'center') {
    textStartX = textX + textWidth / 2;
  } else if (frame.textAlign === 'right') {
    textStartX = textX + textWidth;
  }

  // Word wrap and draw text
  const words = frame.text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > textWidth - 40) { // 40px padding
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        lines.push(word);
      }
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);

  // Draw text lines
  const lineHeight = fontSize * frame.lineHeight;
  const totalTextHeight = lines.length * lineHeight;
  const startY = textY + (textHeight - totalTextHeight) / 2 + fontSize;

  lines.forEach((line, index) => {
    const y = startY + (index * lineHeight);
    ctx.fillText(line, textStartX, y);
  });

  // Draw elements
  for (const element of frame.elements) {
    if (element.type === 'shape') {
      ctx.fillStyle = element.color || '#000000';
      const x = (element.x / 400) * width;
      const y = (element.y / 400) * height;
      const w = (element.width / 400) * width;
      const h = (element.height / 400) * height;

      switch (element.shape) {
        case 'rectangle':
          ctx.fillRect(x, y, w, h);
          break;
        case 'circle':
          ctx.beginPath();
          ctx.arc(x + w/2, y + h/2, Math.min(w, h)/2, 0, 2 * Math.PI);
          ctx.fill();
          break;
      }
    }
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!);
    }, 'image/png', 1.0);
  });
};

export const downloadFramesAsZip = async (project: CarouselProject) => {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();

  for (let i = 0; i < project.frames.length; i++) {
    const frame = project.frames[i];
    const blob = await generateFrameImage(frame, project, i);
    zip.file(`${project.name}_frame_${i + 1}.png`, blob);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  
  // Download zip file
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.name}_carousel.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
