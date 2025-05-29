
import { Brain, Settings, Loader2 } from "lucide-react";
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
import { PhotoUploadDialog } from "@/components/profile/PhotoUploadDialog";
import { CreditDisplay } from "@/components/credits/CreditDisplay";
import { CreditHistory } from "@/components/credits/CreditHistory";
import { useState } from "react";

const Profile = () => {
  const { projects, deleteProject } = useCarouselProjects();
  const { profile, loading: profileLoading, updateProfile, uploadAvatar } = useProfile();
  const { uploadPhoto } = useProfilePhotos();
  const { signOut, user } = useAuth();
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [projectsCount, setProjectsCount] = useState(0);

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

  const handleProjectsCountChange = (count: number) => {
    setProjectsCount(count);
  };

  console.log('Profile component state:', { 
    user: user?.email, 
    profile: profile?.full_name, 
    profileLoading, 
    projectsCount 
  });

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#131313] dark:bg-[#131313]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-300 dark:text-gray-300">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#131313] dark:bg-[#131313]">
        <div className="text-center">
          <p className="text-gray-300 dark:text-gray-300 mb-4">Erro ao carregar perfil</p>
          <Button onClick={() => window.location.reload()} variant="secondary">Tentar novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131313] dark:bg-[#131313]">
      {/* Header */}
      <header className="glass border-b sticky top-0 z-50 bg-[#131313]/80 dark:bg-[#131313]/80 backdrop-blur-md border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-glow">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">QUIKFY</span>
          </Link>
          <div className="flex items-center space-x-3">
            <Link to="/settings">
              <Button variant="outline" className="border-gray-600 text-white hover:bg-purple-600">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
            </Link>
            <Button variant="outline" onClick={signOut} className="border-gray-600 text-white hover:bg-red-600">
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <ProfileHeader profile={profile} updateProfile={updateProfile} uploadAvatar={uploadAvatar} />

        {/* Tabs for Profile Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6 glass rounded-2xl p-1 bg-[#1a1a1a] dark:bg-[#1a1a1a] border-gray-700">
            <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300">Visão Geral</TabsTrigger>
            <TabsTrigger value="projects" className="rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300">Meus Projetos ({projectsCount})</TabsTrigger>
            <TabsTrigger value="photos" className="rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300">Fotos</TabsTrigger>
            <TabsTrigger value="achievements" className="rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300">Conquistas</TabsTrigger>
            <TabsTrigger value="credits" className="rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300">Créditos</TabsTrigger>
            <TabsTrigger value="credit-history" className="rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300">Histórico</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-8">
            <ProfileStats projectsCount={projectsCount} />
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6 mt-8">
            <ProfileProjects 
              projects={projects} 
              onDeleteProject={handleDeleteProject} 
              onProjectsCountChange={handleProjectsCountChange}
            />
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-6 mt-8">
            <ProfilePhotos />
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6 mt-8">
            <ProfileAchievements profile={profile} projectsCount={projectsCount} />
          </TabsContent>

          {/* Credits Tab */}
          <TabsContent value="credits" className="space-y-6 mt-8">
            <CreditDisplay showDetails={true} />
          </TabsContent>

          {/* Credit History Tab */}
          <TabsContent value="credit-history" className="space-y-6 mt-8">
            <CreditHistory />
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
