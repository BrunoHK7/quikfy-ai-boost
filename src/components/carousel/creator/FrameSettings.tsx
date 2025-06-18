
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Smile, AlignLeft, AlignCenter, AlignRight, AlignHorizontalJustifyStart, AlignHorizontalJustifyCenter, AlignHorizontalJustifyEnd } from "lucide-react";
import { EmojiPicker } from "@/components/carousel/EmojiPicker";

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

interface FrameSettingsProps {
  currentFrame: Frame;
  updateCurrentFrame: (updates: Partial<Frame>) => void;
  globalBackgroundColor: string;
  globalTextColor: string;
  globalFontFamily: string;
}

export const FrameSettings: React.FC<FrameSettingsProps> = ({
  currentFrame,
  updateCurrentFrame,
  globalBackgroundColor,
  globalTextColor,
  globalFontFamily
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const googleFonts = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Source Sans Pro',
    'Raleway', 'PT Sans', 'Lora', 'Merriweather', 'Playfair Display',
    'Oswald', 'Ubuntu', 'Nunito', 'Poppins', 'Arial', 'Georgia', 'Times New Roman',
    'Helvetica', 'Verdana', 'Trebuchet MS', 'Impact', 'Comic Sans MS'
  ];

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

  const onEmojiSelect = (emoji: string) => {
    updateCurrentFrame({ text: currentFrame.text + emoji });
    setShowEmojiPicker(false);
  };

  return (
    <div className="w-80 border-l border-border bg-muted/30 p-6 overflow-y-auto">
      <h3 className="font-semibold text-foreground mb-4 text-center">Slide Atual</h3>
      
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

      <div className="mb-6">
        <label className="text-sm font-medium text-foreground mb-3 block">Alinhamento Horizontal</label>
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

      <div className="mb-6">
        <label className="text-sm font-medium text-foreground mb-3 block">Alinhamento Vertical</label>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={currentFrame?.verticalAlign === 'top' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateCurrentFrame({ verticalAlign: 'top' })}
            className="flex items-center justify-center"
          >
            <AlignHorizontalJustifyStart className="h-4 w-4 rotate-90" />
          </Button>
          <Button
            variant={currentFrame?.verticalAlign === 'center' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateCurrentFrame({ verticalAlign: 'center' })}
            className="flex items-center justify-center"
          >
            <AlignHorizontalJustifyCenter className="h-4 w-4 rotate-90" />
          </Button>
          <Button
            variant={currentFrame?.verticalAlign === 'bottom' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateCurrentFrame({ verticalAlign: 'bottom' })}
            className="flex items-center justify-center"
          >
            <AlignHorizontalJustifyEnd className="h-4 w-4 rotate-90" />
          </Button>
        </div>
      </div>

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
  );
};
