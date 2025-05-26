
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit3, Trash2, ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface Project {
  id: string;
  name: string;
  frames: any[];
  dimensions: string;
  createdAt: string;
  fontFamily: string;
}

interface ProfileProjectsProps {
  projects: Project[];
  onDeleteProject: (projectId: string) => void;
}

export const ProfileProjects = ({ projects, onDeleteProject }: ProfileProjectsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Meus Projetos</h2>
        <Link to="/carousel-creator">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <ImageIcon className="w-4 h-4 mr-2" />
            Novo Carrossel
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum projeto criado</h3>
            <p className="text-gray-500 mb-6">Comece criando seu primeiro carrossel profissional!</p>
            <Link to="/carousel-creator">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <ImageIcon className="w-4 h-4 mr-2" />
                Criar Primeiro Carrossel
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg truncate">{project.name}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {project.frames.length} quadros • {project.dimensions}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {project.dimensions === '1080x1080' ? '1:1' : '4:5'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Preview do primeiro quadro */}
                <div 
                  className="w-full aspect-square rounded-lg mb-4 flex items-center justify-center text-center p-4 border"
                  style={{
                    backgroundColor: project.frames[0]?.backgroundColor || '#ffffff',
                    color: project.frames[0]?.textColor || '#131313',
                    fontFamily: project.fontFamily,
                    fontSize: '12px'
                  }}
                >
                  {project.frames[0]?.text.substring(0, 50)}...
                </div>
                
                <div className="text-xs text-gray-500 mb-4">
                  Criado em {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                </div>
                
                <div className="flex space-x-2">
                  <Link to={`/carousel-creator?project=${project.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit3 className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => onDeleteProject(project.id)}
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
