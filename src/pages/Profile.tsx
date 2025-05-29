
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
import { CarouselUsesDisplay } from "@/components/carousel/CarouselUsesDisplay";
import { CarouselUsesHistory } from "@/components/carousel/CarouselUsesHistory";
import { SubscriptionManagement } from "@/components/profile/SubscriptionManagement";
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Erro ao carregar perfil</p>
          <Button onClick={() => window.location.reload()} variant="secondary">Tentar novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b sticky top-0 z-50 backdrop-blur-md border-border bg-background/80">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-glow">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold gradient-text">QUIKFY</span>
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link to="/settings">
              <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-purple-600 hover:text-white text-xs sm:text-sm">
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Configurações</span>
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={signOut} className="border-border text-foreground hover:bg-red-600 hover:text-white text-xs sm:text-sm">
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-6xl">
        {/* Profile Header */}
        <ProfileHeader profile={profile} updateProfile={updateProfile} uploadAvatar={uploadAvatar} />

        {/* Tabs for Profile Content */}
        <Tabs defaultValue="overview" className="w-full">
          <div className="overflow-x-auto mb-4 sm:mb-6">
            <TabsList className="inline-flex min-w-full sm:w-full grid-cols-none sm:grid sm:grid-cols-7 glass rounded-2xl p-1 border-border bg-card/50 whitespace-nowrap">
              <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white text-muted-foreground text-xs sm:text-sm px-2 sm:px-3">
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="projects" className="rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white text-muted-foreground text-xs sm:text-sm px-2 sm:px-3">
                Projetos ({projectsCount})
              </TabsTrigger>
              <TabsTrigger value="photos" className="rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white text-muted-foreground text-xs sm:text-sm px-2 sm:px-3">
                Fotos
              </TabsTrigger>
              <TabsTrigger value="achievements" className="rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white text-muted-foreground text-xs sm:text-sm px-2 sm:px-3">
                Conquistas
              </TabsTrigger>
              <TabsTrigger value="uses" className="rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white text-muted-foreground text-xs sm:text-sm px-2 sm:px-3">
                Usos
              </TabsTrigger>
              <TabsTrigger value="uses-history" className="rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white text-muted-foreground text-xs sm:text-sm px-2 sm:px-3">
                Histórico
              </TabsTrigger>
              <TabsTrigger value="subscription" className="rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white text-muted-foreground text-xs sm:text-sm px-2 sm:px-3">
                Assinatura
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-4 sm:mt-8">
            <ProfileStats projectsCount={projectsCount} />
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4 sm:space-y-6 mt-4 sm:mt-8">
            <ProfileProjects 
              projects={projects} 
              onDeleteProject={handleDeleteProject} 
              onProjectsCountChange={handleProjectsCountChange}
            />
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-4 sm:space-y-6 mt-4 sm:mt-8">
            <ProfilePhotos />
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4 sm:space-y-6 mt-4 sm:mt-8">
            <ProfileAchievements profile={profile} projectsCount={projectsCount} />
          </TabsContent>

          {/* Uses Tab */}
          <TabsContent value="uses" className="space-y-4 sm:space-y-6 mt-4 sm:mt-8">
            <CarouselUsesDisplay showDetails={true} />
          </TabsContent>

          {/* Uses History Tab */}
          <TabsContent value="uses-history" className="space-y-4 sm:space-y-6 mt-4 sm:mt-8">
            <CarouselUsesHistory />
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-4 sm:space-y-6 mt-4 sm:mt-8">
            <SubscriptionManagement />
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
