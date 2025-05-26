
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Upload, 
  Square, 
  Circle, 
  ArrowRight, 
  Minus,
  Triangle,
  Star
} from 'lucide-react';
import { CarouselElement } from '@/hooks/useCarouselProjects';

interface GraphicElementsPickerProps {
  onAddElement: (element: CarouselElement) => void;
}

export const GraphicElementsPicker = ({ onAddElement }: GraphicElementsPickerProps) => {
  const [selectedColor, setSelectedColor] = useState('#8B5CF6');

  const shapes = [
    { icon: Square, shape: 'rectangle', name: 'Retângulo' },
    { icon: Circle, shape: 'circle', name: 'Círculo' },
    { icon: ArrowRight, shape: 'arrow', name: 'Seta' },
    { icon: Minus, shape: 'line', name: 'Linha' },
    { icon: Triangle, shape: 'triangle', name: 'Triângulo' },
    { icon: Star, shape: 'star', name: 'Estrela' }
  ];

  const addShape = (shape: string) => {
    const element: CarouselElement = {
      id: Date.now().toString(),
      type: 'shape',
      shape: shape as any,
      x: 50,
      y: 50,
      width: 60,
      height: 60,
      color: selectedColor
    };
    onAddElement(element);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const element: CarouselElement = {
          id: Date.now().toString(),
          type: 'image',
          src: e.target?.result as string,
          x: 50,
          y: 50,
          width: 100,
          height: 100
        };
        onAddElement(element);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center">
          <Upload className="w-4 h-4 mr-2" />
          Elementos Gráficos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload de Imagem */}
        <div>
          <Label className="text-xs">Upload de Imagem</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-1"
          />
        </div>

        {/* Cor para Formas */}
        <div>
          <Label className="text-xs">Cor dos Elementos</Label>
          <div className="flex space-x-2 mt-1">
            <Input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-12 h-8 p-1 rounded"
            />
            <Input
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="flex-1 text-xs"
            />
          </div>
        </div>

        {/* Formas Básicas */}
        <div>
          <Label className="text-xs mb-2 block">Formas Básicas</Label>
          <div className="grid grid-cols-3 gap-2">
            {shapes.map((shape) => (
              <Button
                key={shape.shape}
                onClick={() => addShape(shape.shape)}
                variant="outline"
                size="sm"
                className="p-2 h-auto flex flex-col items-center space-y-1"
                title={shape.name}
              >
                <shape.icon className="w-4 h-4" />
                <span className="text-xs">{shape.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
