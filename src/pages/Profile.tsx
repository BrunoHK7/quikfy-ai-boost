import { Brain, Settings, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useCarouselProjects } from "@/hooks/useCarouselProjects";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useProfilePhotos } from "@/hooks/useProfilePhotos";
import { toast } from "sonner";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileProjects } from "@/components/profile/ProfileProjects";
import { ProfileAchievements } from "@/components/profile/ProfileAchievements";
import { ProfilePhotos } from "@/components/profile/ProfilePhotos";
import { ProfileOverviewPhotos } from "@/components/profile/ProfileOverviewPhotos";
import { PhotoUploadDialog } from "@/components/profile/PhotoUploadDialog";
import { useState } from "react";

const Profile = () => {
  const { projects, deleteProject } = useCarouselProjects();
  const { profile, loading: profileLoading, updateProfile, uploadAvatar } = useProfile();
  const { photos, uploadPhoto } = useProfilePhotos();
  const { signOut, user } = useAuth();
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);

  const handleDeleteProject = (projectId: string) => {
    if (confirm("Tem certeza que deseja excluir este projeto?")) {
      deleteProject(projectId);
      toast("Projeto excluído com sucesso!");
    }
  };

  const handlePhotoUpload = async (file: File, caption: string) => {
    const { error } = await uploadPhoto(file, caption);
    
    if (error) {
      toast.error("Erro ao fazer upload da foto");
    } else {
      toast.success("Foto adicionada com sucesso!");
      setPhotoDialogOpen(false);
    }
  };

  console.log('Profile component state:', { 
    user: user?.email, 
    profile: profile?.full_name, 
    profileLoading, 
    projectsCount: projects.length 
  });

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Erro ao carregar perfil</p>
          <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">QUIKFY</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Link to="/settings">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
            </Link>
            <Button variant="outline" onClick={signOut}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <ProfileHeader profile={profile} updateProfile={updateProfile} uploadAvatar={uploadAvatar} />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link to="/carousel-generator">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Criar Carrossel
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => setPhotoDialogOpen(true)}
            className="border-purple-600 text-purple-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Foto
          </Button>
        </div>

        {/* Tabs for Profile Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="projects">Meus Projetos ({projects.length})</TabsTrigger>
            <TabsTrigger value="photos">Fotos</TabsTrigger>
            <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <ProfileStats projectsCount={projects.length} />
            <ProfileOverviewPhotos photos={photos} />
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <ProfileProjects projects={projects} onDeleteProject={handleDeleteProject} />
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-6">
            <ProfilePhotos />
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <ProfileAchievements profile={profile} projectsCount={projects.length} />
          </TabsContent>
        </Tabs>

        {/* Photo Upload Dialog */}
        <PhotoUploadDialog 
          open={photoDialogOpen}
          onOpenChange={setPhotoDialogOpen}
          onUpload={handlePhotoUpload}
        />
      </div>
    </div>
  );
};

export default Profile;
