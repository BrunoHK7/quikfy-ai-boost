
import { useState } from 'react';
import { toast } from 'sonner';

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

export const useCarouselFrames = (
  globalBackgroundColor: string,
  globalTextColor: string,
  globalFontFamily: string
) => {
  const [frames, setFrames] = useState<Frame[]>([
    {
      id: '1',
      text: 'Seu título aqui',
      fontSize: 32,
      textAlign: 'center',
      verticalAlign: 'center',
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

  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  const updateCurrentFrame = (updates: Partial<Frame>) => {
    setFrames(prev => prev.map((frame, index) => {
      if (index === currentFrameIndex) {
        const updatedFrame = { ...frame, ...updates };
        return updatedFrame;
      }
      return frame;
    }));
  };

  const addFrame = () => {
    const newFrame: Frame = {
      id: String(frames.length + 1),
      text: `Slide ${frames.length + 1}`,
      fontSize: 32,
      textAlign: 'center',
      verticalAlign: 'center',
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

  return {
    frames,
    setFrames,
    currentFrameIndex,
    setCurrentFrameIndex,
    updateCurrentFrame,
    addFrame,
    removeFrame
  };
};
