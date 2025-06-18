
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Download, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CarouselHeaderProps {
  projectName: string;
  setProjectName: (name: string) => void;
  onSave: () => void;
  onDownload: () => void;
  saving: boolean;
  hasUnsavedChanges: boolean;
}

export const CarouselHeader: React.FC<CarouselHeaderProps> = ({
  projectName,
  setProjectName,
  onSave,
  onDownload,
  saving,
  hasUnsavedChanges
}) => {
  const navigate = useNavigate();

  return (
    <header className="border-b bg-background border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-purple-600">QUIKFY</div>
              <div className="text-xl font-semibold text-foreground">QuikDesign</div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                Grátis
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300">
                Auto-save ativo
              </Badge>
              {hasUnsavedChanges && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  Alterações não salvas
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-48 bg-background border-border"
              placeholder="Nome do projeto"
            />
            <Button
              onClick={onSave}
              disabled={saving}
              variant="outline"
              className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Salvando..." : "Salvar"}
            </Button>
            <Button
              onClick={onDownload}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
