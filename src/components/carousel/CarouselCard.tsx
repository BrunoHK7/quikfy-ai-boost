
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
      case 'primary': return 'border-l-purple-500 bg-purple-50/50 dark:bg-[#1a1a1a] dark:border-l-purple-400';
      case 'blue': return 'border-l-blue-500 bg-blue-50/50 dark:bg-[#1a1a1a] dark:border-l-blue-400';
      case 'orange': return 'border-l-orange-500 bg-orange-50/50 dark:bg-[#1a1a1a] dark:border-l-orange-400';
      case 'green': return 'border-l-green-500 bg-green-50/50 dark:bg-[#1a1a1a] dark:border-l-green-400';
      case 'red': return 'border-l-red-500 bg-red-50/50 dark:bg-[#1a1a1a] dark:border-l-red-400';
      default: return 'border-l-gray-500 bg-gray-50/50 dark:bg-[#1a1a1a] dark:border-l-gray-400';
    }
  };

  const getTitleColor = () => {
    switch (color) {
      case 'primary': return 'text-purple-600 dark:text-purple-400';
      case 'blue': return 'text-blue-600 dark:text-blue-400';
      case 'orange': return 'text-orange-600 dark:text-orange-400';
      case 'green': return 'text-green-600 dark:text-green-400';
      case 'red': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getNumberColor = () => {
    switch (color) {
      case 'primary': return 'text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-400';
      case 'blue': return 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400';
      case 'orange': return 'text-orange-600 dark:text-orange-400 border-orange-600 dark:border-orange-400';
      case 'green': return 'text-green-600 dark:text-green-400 border-green-600 dark:border-green-400';
      case 'red': return 'text-red-600 dark:text-red-400 border-red-600 dark:border-red-400';
      default: return 'text-gray-600 dark:text-gray-400 border-gray-600 dark:border-gray-400';
    }
  };

  return (
    <Card className={`${getCardColor()} border-l-4 aspect-square flex flex-col group hover:shadow-lg transition-all duration-300 dark:border-gray-700`}>
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full bg-white dark:bg-[#131313] border-2 flex items-center justify-center text-sm font-bold ${getNumberColor()}`}>
              {index}
            </div>
            <h3 className={`text-lg font-bold ${getTitleColor()}`}>{title}</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyContent}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={`Copiar ${title}`}
          >
            <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <p className="text-foreground dark:text-gray-200 whitespace-pre-line leading-relaxed text-sm">
            {content}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
