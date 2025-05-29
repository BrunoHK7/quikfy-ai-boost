
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit3, Trash2, ImageIcon, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface CarouselProject {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface ProfileProjectsProps {
  projects: any[];
  onDeleteProject: (projectId: string) => void;
  onProjectsCountChange?: (count: number) => void;
}

export const ProfileProjects = ({ projects: legacyProjects, onDeleteProject: legacyDelete, onProjectsCountChange }: ProfileProjectsProps) => {
  const { user } = useAuth();
  const [carouselProjects, setCarouselProjects] = useState<CarouselProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCarouselProjects();
    }
  }, [user]);

  useEffect(() => {
    // Notifica o componente pai sobre a mudança na contagem
    if (onProjectsCountChange) {
      onProjectsCountChange(carouselProjects.length);
    }
  }, [carouselProjects.length, onProjectsCountChange]);

  const fetchCarouselProjects = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('carousel_projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setCarouselProjects(data || []);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os projetos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;

    try {
      const { error } = await supabase
        .from('carousel_projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      setCarouselProjects(prev => prev.filter(p => p.id !== projectId));
      toast({
        title: "Projeto Excluído",
        description: "O projeto foi excluído com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o projeto.",
        variant: "destructive",
      });
    }
  };

  const copyProjectContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copiado!",
      description: "Conteúdo do projeto copiado para a área de transferência.",
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch (error) {
      return 'Data inválida';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Meus Projetos</h2>
          <Link to="/carousel-generator">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <ImageIcon className="w-4 h-4 mr-2" />
              Novo Carrossel
            </Button>
          </Link>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Carregando projetos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Meus Projetos ({carouselProjects.length})</h2>
        <Link to="/carousel-generator">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <ImageIcon className="w-4 h-4 mr-2" />
            Novo Carrossel
          </Button>
        </Link>
      </div>

      {carouselProjects.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum projeto criado</h3>
            <p className="text-muted-foreground mb-6">Comece criando seu primeiro carrossel profissional!</p>
            <Link to="/carousel-generator">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <ImageIcon className="w-4 h-4 mr-2" />
                Criar Primeiro Carrossel
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carouselProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg truncate">{project.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Criado em {formatDate(project.created_at)}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Carrossel
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Preview do conteúdo */}
                <div className="w-full bg-muted rounded-lg p-4 mb-4 max-h-32 overflow-hidden">
                  <p className="text-sm line-clamp-4">
                    {project.content.substring(0, 150)}...
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => copyProjectContent(project.content)}
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copiar
                  </Button>
                  <Button 
                    onClick={() => handleDeleteProject(project.id)}
                    variant="outline" 
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
