
import { Card, CardContent } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface CarouselCardProps {
  title: string;
  content: string;
  color: string;
  index: number;
}

export const CarouselCard = ({ title, content, color, index }: CarouselCardProps) => {
  const copyContent = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copiado!",
      description: `Conteúdo do ${title} copiado para a área de transferência.`,
    });
  };

  const getCardColor = () => {
    switch (color) {
      case 'primary': return 'border-l-purple-500 bg-purple-50/50';
      case 'blue': return 'border-l-blue-500 bg-blue-50/50';
      case 'orange': return 'border-l-orange-500 bg-orange-50/50';
      case 'green': return 'border-l-green-500 bg-green-50/50';
      case 'red': return 'border-l-red-500 bg-red-50/50';
      default: return 'border-l-gray-500 bg-gray-50/50';
    }
  };

  const getTitleColor = () => {
    switch (color) {
      case 'primary': return 'text-purple-600';
      case 'blue': return 'text-blue-600';
      case 'orange': return 'text-orange-600';
      case 'green': return 'text-green-600';
      case 'red': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className={`${getCardColor()} border-l-4 aspect-square flex flex-col group hover:shadow-lg transition-shadow`}>
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-current flex items-center justify-center text-sm font-bold text-current">
              {index}
            </div>
            <h3 className={`text-lg font-bold ${getTitleColor()}`}>{title}</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyContent}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <p className="text-foreground whitespace-pre-line leading-relaxed text-sm">
            {content}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
