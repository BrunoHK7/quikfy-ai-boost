
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brain, 
  Camera, 
  Edit3, 
  DollarSign, 
  MessageSquare, 
  Trophy, 
  Star,
  MapPin,
  Calendar,
  Link as LinkIcon,
  Settings,
  ImageIcon,
  Trash2,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCarouselProjects } from "@/hooks/useCarouselProjects";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { projects, deleteProject } = useCarouselProjects();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { signOut } = useAuth();

  // Form states for editing
  const [editFullName, setEditFullName] = useState(profile?.full_name || "");
  const [editPhone, setEditPhone] = useState(profile?.phone || "");
  const [editCity, setEditCity] = useState(profile?.city || "");
  const [editState, setEditState] = useState(profile?.state || "");
  const [editCountry, setEditCountry] = useState(profile?.country || "");
  const [editOccupation, setEditOccupation] = useState(profile?.occupation || "");

  // Update form when profile loads
  useState(() => {
    if (profile) {
      setEditFullName(profile.full_name);
      setEditPhone(profile.phone);
      setEditCity(profile.city);
      setEditState(profile.state);
      setEditCountry(profile.country);
      setEditOccupation(profile.occupation);
    }
  });

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await updateProfile({
        full_name: editFullName,
        phone: editPhone,
        city: editCity,
        state: editState,
        country: editCountry,
        occupation: editOccupation,
      });

      if (error) {
        toast.error("Erro ao atualizar perfil");
      } else {
        toast.success("Perfil atualizado com sucesso!");
        setIsEditing(false);
      }
    } catch (error) {
      toast.error("Erro inesperado ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm("Tem certeza que deseja excluir este projeto?")) {
      deleteProject(projectId);
      toast("Projeto excluído com sucesso!");
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-700 border-red-200">ADMIN</Badge>;
      case 'vip':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">VIP MEMBER</Badge>;
      case 'pro':
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200">PRO MEMBER</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">FREE MEMBER</Badge>;
    }
  };

  const getOccupationLabel = (occupation: string) => {
    switch (occupation) {
      case 'empresario':
        return 'Empresário';
      case 'autonomo':
        return 'Autônomo';
      case 'funcionario':
        return 'Funcionário';
      default:
        return occupation;
    }
  };

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
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
            <Button variant="outline" onClick={signOut}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-purple-100 text-purple-600 text-2xl">
                      {profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                {getRoleBadge(profile.role)}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{profile.full_name}</h1>
                  <Button 
                    onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                    variant="outline"
                    className="border-purple-600 text-purple-600"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-4 h-4 mr-2" />
                        {isEditing ? "Salvar" : "Editar Perfil"}
                      </>
                    )}
                  </Button>
                </div>

                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nome Completo</label>
                      <Input
                        value={editFullName}
                        onChange={(e) => setEditFullName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Telefone</label>
                      <Input
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Cidade</label>
                      <Input
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Estado</label>
                      <Input
                        value={editState}
                        onChange={(e) => setEditState(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">País</label>
                      <Input
                        value={editCountry}
                        onChange={(e) => setEditCountry(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Ocupação</label>
                      <Select value={editOccupation} onValueChange={setEditOccupation}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="empresario">Empresário</SelectItem>
                          <SelectItem value="autonomo">Autônomo</SelectItem>
                          <SelectItem value="funcionario">Funcionário</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {profile.city}, {profile.state}, {profile.country}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Membro desde {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      {getOccupationLabel(profile.occupation)}
                    </div>
                  </div>
                )}

                {isEditing && (
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    className="mr-2"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Profile Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="projects">Meus Projetos ({projects.length})</TabsTrigger>
            <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <div className="lg:col-span-2 space-y-6">
                {/* Revenue Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                      Estatísticas de Faturamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">R$ 0</div>
                        <div className="text-sm text-gray-600">Total Faturado</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">R$ 0</div>
                        <div className="text-sm text-gray-600">Este Mês</div>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                      <Trophy className="w-4 h-4 mr-2" />
                      Comprovar Faturamento
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Photos */}
                <Card>
                  <CardHeader>
                    <CardTitle>Fotos Recentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                          <Camera className="w-6 h-6 text-gray-400" />
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      <Camera className="w-4 h-4 mr-2" />
                      Adicionar Foto
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons & Achievements */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ações Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link to="/carousel-creator">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Criar Carrossel
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Criar Post
                    </Button>
                  </CardContent>
                </Card>

                {/* Activity Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Atividade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Carrosséis Criados</span>
                        <span className="font-semibold">{projects.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Posts na Comunidade</span>
                        <span className="font-semibold">0</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Lives Assistidas</span>
                        <span className="font-semibold">0</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
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
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Conquistas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4 p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Designer Pro</div>
                      <div className="text-sm text-gray-600">{projects.length} carrosséis criados</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 rounded-lg bg-purple-50 border border-purple-200">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">Membro {profile.role.toUpperCase()}</div>
                      <div className="text-sm text-gray-600">Status atual da conta</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
