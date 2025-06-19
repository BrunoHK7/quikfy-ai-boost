import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, ExternalLink, Edit, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCarouselProjects } from '@/hooks/useCarouselProjects';
import { useLinkPages } from '@/hooks/useLinkPages';

interface ProfileProjectsProps {
  isOwnProfile: boolean;
}

export const ProfileProjects: React.FC<ProfileProjectsProps> = ({ isOwnProfile }) => {
  const navigate = useNavigate();
  const { projects } = useCarouselProjects();
  const { linkPage, isLoading: linkPageLoading, hasLinkPage } = useLinkPages();
  const [hasUserLinkPage, setHasUserLinkPage] = useState(false);

  useEffect(() => {
    const checkLinkPage = async () => {
      const exists = await hasLinkPage();
      setHasUserLinkPage(exists);
    };

    if (isOwnProfile) {
      checkLinkPage();
    }
  }, [isOwnProfile, hasLinkPage]);

  const handleCreateCarousel = () => {
    navigate('/carousel-briefing');
  };

  const handleViewCarousel = (projectId: string) => {
    navigate(`/carousel-result/${projectId}`);
  };

  const handleCreateLinkPage = () => {
    navigate('/link-page-editor');
  };

  const handleViewLinkPage = () => {
    if (linkPage?.slug) {
      window.open(`https://quikfy.com.br/quiklink-${linkPage.slug}`, '_blank');
    }
  };

  const isLoading = linkPageLoading;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Meus Projetos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {isOwnProfile ? 'Meus Projetos' : 'Projetos'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Seção de Carrosséis */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Carrosséis Instagram</h3>
            {isOwnProfile && (
              <Button onClick={handleCreateCarousel} size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Criar Carrossel
              </Button>
            )}
          </div>
          
          {projects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{isOwnProfile ? 'Você ainda não criou nenhum carrossel' : 'Nenhum carrossel criado'}</p>
              {isOwnProfile && (
                <Button onClick={handleCreateCarousel} className="mt-4">
                  Criar seu primeiro carrossel
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-medium mb-2 truncate">{project.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {project.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewCarousel(project.id)}
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Ver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Seção de Página de Links */}
        {isOwnProfile && (
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Página de Links</h3>
              <Button 
                onClick={handleCreateLinkPage} 
                size="sm" 
                className="flex items-center gap-2"
                variant={hasUserLinkPage ? "outline" : "default"}
              >
                {hasUserLinkPage ? (
                  <>
                    <Edit className="w-4 h-4" />
                    Editar
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Criar
                  </>
                )}
              </Button>
            </div>
            
            {!hasUserLinkPage ? (
              <div className="text-center py-8 text-gray-500">
                <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Crie sua página de links personalizada</p>
                <p className="text-sm mt-2">Centralize todos os seus links importantes em uma única página</p>
                <Button onClick={handleCreateLinkPage} className="mt-4">
                  Criar página de links
                </Button>
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-purple-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Sua página de links está ativa</h4>
                    {linkPage?.slug && (
                      <p className="text-sm text-gray-600 mt-1">
                        quikfy.com.br/quiklink-{linkPage.slug}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleViewLinkPage}
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Ver
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleCreateLinkPage}
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Editar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
