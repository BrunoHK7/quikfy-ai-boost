
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Play,
  Trash2,
  Copy,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCarouselProjects } from "@/hooks/useCarouselProjects";
import { toast } from "sonner";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("Empreendedor digital apaixonado por tecnologia e IA. Transformando negócios através da automação e estratégias inovadoras. 🚀");
  const { projects, deleteProject } = useCarouselProjects();

  const handleDeleteProject = (projectId: string) => {
    if (confirm("Tem certeza que deseja excluir este projeto?")) {
      deleteProject(projectId);
      toast("Projeto excluído com sucesso!");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">QUIKFY</span>
          </Link>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
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
                    <AvatarFallback className="bg-purple-100 text-purple-600 text-2xl">CM</AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                  GOLD MEMBER
                </Badge>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">Carlos Miranda</h1>
                  <Button 
                    onClick={() => setIsEditing(!isEditing)}
                    variant="outline"
                    className="border-purple-600 text-purple-600"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    {isEditing ? "Salvar" : "Editar Perfil"}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    São Paulo, BR
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Membro desde Mar 2024
                  </div>
                  <div className="flex items-center text-gray-600">
                    <LinkIcon className="w-4 h-4 mr-2" />
                    carlosmiranda.com
                  </div>
                </div>

                {isEditing ? (
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="border-gray-200"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">{bio}</p>
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
                        <div className="text-3xl font-bold text-green-600">R$ 234.560</div>
                        <div className="text-sm text-gray-600">Total Faturado</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">R$ 45.890</div>
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
                    <Button variant="outline" className="w-full">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Editar Perfil
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
                        <span className="font-semibold">47</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Lives Assistidas</span>
                        <span className="font-semibold">12</span>
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
                  <div className="flex items-center space-x-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <div className="font-medium">Primeiro 100K</div>
                      <div className="text-sm text-gray-600">Primeiro faturamento de 6 dígitos</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 rounded-lg bg-purple-50 border border-purple-200">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">Master do Copy</div>
                      <div className="text-sm text-gray-600">100+ copies criados</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Influencer</div>
                      <div className="text-sm text-gray-600">50+ posts na comunidade</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Designer Pro</div>
                      <div className="text-sm text-gray-600">{projects.length} carrosséis criados</div>
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
