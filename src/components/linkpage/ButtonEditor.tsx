
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';
import { LinkButton } from '@/pages/LinkPageEditor';

interface ButtonEditorProps {
  button: LinkButton;
  updateButton: (updates: Partial<LinkButton>) => void;
  onClose: () => void;
}

const fontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Poppins', label: 'Poppins' }
];

export const ButtonEditor: React.FC<ButtonEditorProps> = ({
  button,
  updateButton,
  onClose
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Editar Botão</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Texto do botão */}
      <div className="space-y-2">
        <Label htmlFor="buttonText">Texto do botão</Label>
        <Input
          id="buttonText"
          value={button.text}
          onChange={(e) => updateButton({ text: e.target.value })}
          placeholder="Texto do botão"
        />
      </div>

      {/* URL do botão */}
      <div className="space-y-2">
        <Label htmlFor="buttonUrl">Link do botão</Label>
        <Input
          id="buttonUrl"
          value={button.url}
          onChange={(e) => updateButton({ url: e.target.value })}
          placeholder="https://exemplo.com"
        />
      </div>

      {/* Tipografia */}
      <div className="space-y-4">
        <Label>Tipografia</Label>
        
        <div className="space-y-2">
          <Label>Fonte</Label>
          <Select
            value={button.fontFamily}
            onValueChange={(value) => updateButton({ fontFamily: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Peso da fonte</Label>
            <Select
              value={button.fontWeight}
              onValueChange={(value: 'normal' | 'bold') => updateButton({ fontWeight: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="bold">Negrito</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Tamanho da fonte: {button.fontSize}px</Label>
            <Slider
              value={[button.fontSize]}
              onValueChange={([value]) => updateButton({ fontSize: value })}
              min={12}
              max={24}
              step={1}
            />
          </div>
        </div>
      </div>

      {/* Cor do texto */}
      <div className="space-y-2">
        <Label htmlFor="textColor">Cor do texto</Label>
        <div className="flex gap-2">
          <input
            type="color"
            id="textColor"
            value={button.textColor}
            onChange={(e) => updateButton({ textColor: e.target.value })}
            className="w-12 h-10 rounded border border-gray-300"
          />
          <Input
            value={button.textColor}
            onChange={(e) => updateButton({ textColor: e.target.value })}
            placeholder="#ffffff"
            className="flex-1"
          />
        </div>
      </div>

      {/* Cor do botão */}
      <div className="space-y-2">
        <Label htmlFor="buttonColor">Cor do botão</Label>
        <div className="flex gap-2">
          <input
            type="color"
            id="buttonColor"
            value={button.backgroundColor}
            onChange={(e) => updateButton({ backgroundColor: e.target.value })}
            className="w-12 h-10 rounded border border-gray-300"
          />
          <Input
            value={button.backgroundColor}
            onChange={(e) => updateButton({ backgroundColor: e.target.value })}
            placeholder="#6366f1"
            className="flex-1"
          />
        </div>
      </div>

      {/* Borda */}
      <div className="space-y-4">
        <Label>Configurações da borda</Label>
        
        <div className="space-y-2">
          <Label htmlFor="borderColor">Cor da borda</Label>
          <div className="flex gap-2">
            <input
              type="color"
              id="borderColor"
              value={button.borderColor}
              onChange={(e) => updateButton({ borderColor: e.target.value })}
              className="w-12 h-10 rounded border border-gray-300"
            />
            <Input
              value={button.borderColor}
              onChange={(e) => updateButton({ borderColor: e.target.value })}
              placeholder="#6366f1"
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Espessura da borda: {button.borderWidth}px</Label>
          <Slider
            value={[button.borderWidth]}
            onValueChange={([value]) => updateButton({ borderWidth: value })}
            min={0}
            max={5}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <Label>Arredondamento: {button.borderRadius}px</Label>
          <Slider
            value={[button.borderRadius]}
            onValueChange={([value]) => updateButton({ borderRadius: value })}
            min={0}
            max={50}
            step={1}
          />
        </div>
      </div>
    </div>
  );
};
