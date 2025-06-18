
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Upload } from "lucide-react";

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

interface GlobalSettingsProps {
  dimensions: '1080x1080' | '1080x1350' | '1080x1920';
  setDimensions: (dim: '1080x1080' | '1080x1350' | '1080x1920') => void;
  globalBackgroundColor: string;
  setGlobalBackgroundColor: (color: string) => void;
  globalTextColor: string;
  setGlobalTextColor: (color: string) => void;
  globalFontFamily: string;
  setGlobalFontFamily: (font: string) => void;
  marginEnabled: boolean;
  setMarginEnabled: (enabled: boolean) => void;
  marginHorizontal: number;
  setMarginHorizontal: (margin: number) => void;
  marginVertical: number;
  setMarginVertical: (margin: number) => void;
  signatureImage: string | null;
  setSignatureImage: (image: string | null) => void;
  signaturePosition: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  setSignaturePosition: (pos: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right') => void;
  signatureSize: number;
  setSignatureSize: (size: number) => void;
  frames: Frame[];
  currentFrameIndex: number;
  setCurrentFrameIndex: (index: number) => void;
  addFrame: () => void;
  removeFrame: (index: number) => void;
}

export const GlobalSettings: React.FC<GlobalSettingsProps> = ({
  dimensions,
  setDimensions,
  globalBackgroundColor,
  setGlobalBackgroundColor,
  globalTextColor,
  setGlobalTextColor,
  globalFontFamily,
  setGlobalFontFamily,
  marginEnabled,
  setMarginEnabled,
  marginHorizontal,
  setMarginHorizontal,
  marginVertical,
  setMarginVertical,
  signatureImage,
  setSignatureImage,
  signaturePosition,
  setSignaturePosition,
  signatureSize,
  setSignatureSize,
  frames,
  currentFrameIndex,
  setCurrentFrameIndex,
  addFrame,
  removeFrame
}) => {
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const googleFonts = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Source Sans Pro',
    'Raleway', 'PT Sans', 'Lora', 'Merriweather', 'Playfair Display',
    'Oswald', 'Ubuntu', 'Nunito', 'Poppins', 'Arial', 'Georgia', 'Times New Roman',
    'Helvetica', 'Verdana', 'Trebuchet MS', 'Impact', 'Comic Sans MS'
  ];

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

  return (
    <div className="w-80 border-r border-border bg-muted/30 p-6 overflow-y-auto">
      <h3 className="font-semibold text-foreground mb-4 text-center">Configurações Globais</h3>
      
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

      <div className="mb-6">
        <label className="text-sm font-medium text-foreground mb-2 block">Fonte (Global)</label>
        <select
          value={globalFontFamily}
          onChange={(e) => setGlobalFontFamily(e.target.value)}
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
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Margem Horizontal: {marginHorizontal}px</label>
              <input
                type="range"
                min="20"
                max="400"
                value={marginHorizontal}
                onChange={(e) => setMarginHorizontal(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Margem Vertical: {marginVertical}px</label>
              <input
                type="range"
                min="20"
                max="400"
                value={marginVertical}
                onChange={(e) => setMarginVertical(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
            </div>
          </div>
        )}
      </div>

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
  );
};
