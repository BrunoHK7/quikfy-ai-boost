import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Zap, 
  Brain, 
  Rocket, 
  Trophy, 
  Users, 
  BookOpen, 
  Lock,
  TrendingUp,
  DollarSign,
  Star,
  Crown,
  MessageCircle,
  Send,
  Heart,
  Share2,
  Target,
  BarChart3,
  Mail,
  FileText,
  Image as ImageIcon,
  Play,
  Paperclip,
  Smile,
  MoreHorizontal,
  User
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [activeTab, setActiveTab] = useState("tools");
  const [newPost, setNewPost] = useState("");
  const [chatMessage, setChatMessage] = useState("");

  const aiTools = [
    {
      title: "Carrossel de Alta Conversão",
      description: "IA que cria carrosséis irresistíveis para vendas",
      icon: <ImageIcon className="w-6 h-6" />,
      available: true,
      premium: false
    },
    {
      title: "Email Marketing IA",
      description: "Scripts de email que convertem em vendas",
      icon: <Mail className="w-6 h-6" />,
      available: true,
      premium: false
    },
    {
      title: "Landing Page Generator",
      description: "Páginas de vendas que faturam milhões",
      icon: <FileText className="w-6 h-6" />,
      available: false,
      premium: true
    },
    {
      title: "Roteiros de Vídeo IA",
      description: "Scripts virais para redes sociais",
      icon: <Play className="w-6 h-6" />,
      available: true,
      premium: false
    },
    {
      title: "Análise de Concorrentes",
      description: "Descubra os segredos dos top players",
      icon: <Target className="w-6 h-6" />,
      available: false,
      premium: true
    },
    {
      title: "Copy Milionário",
      description: "Textos que fazem pessoas comprarem",
      icon: <Zap className="w-6 h-6" />,
      available: true,
      premium: false
    }
  ];

  const courses = [
    {
      title: "Marketing Digital com IA",
      description: "Do zero aos primeiros 100K com automação",
      progress: 65,
      image: "🤖",
      lessons: 24,
      duration: "8h"
    },
    {
      title: "Escala Exponencial",
      description: "Como multiplicar seu faturamento por 10",
      progress: 30,
      image: "🚀",
      lessons: 18,
      duration: "6h"
    },
    {
      title: "Automação Total",
      description: "Sistemas que trabalham 24/7 para você",
      progress: 0,
      image: "⚡",
      lessons: 32,
      duration: "12h"
    }
  ];

  const communityPosts = [
    {
      author: "Carlos M.",
      avatar: "CM",
      content: "Acabei de bater 50K no mês usando só as IAs da QUIKFY! 🔥 O carrossel generator é insano!",
      likes: 89,
      comments: 23,
      time: "2h"
    },
    {
      author: "Marina Silva",
      avatar: "MS",
      content: "Galera, quem mais está testando o novo script de email? Minha taxa de conversão subiu 340% 📈",
      likes: 156,
      comments: 45,
      time: "4h"
    },
    {
      author: "Tech Entrepreneur",
      avatar: "TE",
      content: "Print do resultado: R$ 127.450 em 15 dias. A metodologia funciona mesmo! 💰",
      likes: 234,
      comments: 67,
      time: "6h"
    }
  ];

  const rankings = [
    { name: "Bruno Oliveira", revenue: "R$ 2.847.320", level: "DIAMOND", position: 1 },
    { name: "Ana Costa", revenue: "R$ 1.923.450", level: "PLATINUM", position: 2 },
    { name: "Pedro Santos", revenue: "R$ 1.456.780", level: "GOLD", position: 3 },
    { name: "Você", revenue: "R$ 234.560", level: "SILVER", position: 47 }
  ];

  const chatHistory = [
    {
      id: 1,
      author: "Carlos M.",
      avatar: "CM",
      message: "Galera, quem mais testou a nova IA de carrossel?",
      time: "10:30",
      type: "text"
    },
    {
      id: 2,
      author: "Ana Silva",
      avatar: "AS",
      message: "Testei ontem! Resultado insano 🔥 Já gerou 3 carrosséis que bombaram",
      time: "10:32",
      type: "text"
    },
    {
      id: 3,
      author: "Pedro Santos",
      avatar: "PS",
      message: "Podem me mandar o link? Não estou encontrando",
      time: "10:35",
      type: "text"
    },
    {
      id: 4,
      author: "Marina Costa",
      avatar: "MC",
      message: "📸",
      time: "10:37",
      type: "image",
      content: "Screenshot dos resultados"
    },
    {
      id: 5,
      author: "Bruno Tech",
      avatar: "BT",
      message: "🎥 Tutorial de como usar",
      time: "10:40",
      type: "video"
    }
  ];

  const sendMessage = () => {
    if (!chatMessage.trim()) return;
    setChatMessage("");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">QUIKFY</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => setActiveTab("tools")}
              className={`font-medium transition-colors ${activeTab === "tools" ? "text-purple-600" : "text-gray-600 hover:text-purple-600"}`}
            >
              Ferramentas IA
            </button>
            <button 
              onClick={() => setActiveTab("courses")}
              className={`font-medium transition-colors ${activeTab === "courses" ? "text-purple-600" : "text-gray-600 hover:text-purple-600"}`}
            >
              Cursos
            </button>
            <button 
              onClick={() => setActiveTab("community")}
              className={`font-medium transition-colors ${activeTab === "community" ? "text-purple-600" : "text-gray-600 hover:text-purple-600"}`}
            >
              Comunidade
            </button>
            <button 
              onClick={() => setActiveTab("ranking")}
              className={`font-medium transition-colors ${activeTab === "ranking" ? "text-purple-600" : "text-gray-600 hover:text-purple-600"}`}
            >
              Ranking
            </button>
            <Link to="/podcasts" className="font-medium text-gray-600 hover:text-purple-600 transition-colors">
              Podcasts
            </Link>
            <Link to="/content-feed" className="font-medium text-gray-600 hover:text-purple-600 transition-colors">
              Feed Premium
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/profile">
              <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                <User className="w-4 h-4 mr-2" />
                Perfil
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/pricing">
              <Button className="bg-purple-600 hover:bg-purple-700">Começar Agora</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-purple-50/30 to-white py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-purple-100 text-purple-700 border-purple-200">
              🚀 Revolucione seus negócios com IA
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              A chave para <span className="text-purple-600">escalar</span> seus negócios com IA está aqui
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Automatize, escale e <strong className="text-purple-600">fature como nunca antes</strong>. 
              Seus concorrentes vão se perguntar como você ficou tão rico tão rápido.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/pricing">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-4">
                  <Rocket className="w-5 h-5 mr-2" />
                  Começar Agora
                </Button>
              </Link>
              <Link to="/carousel-generator">
                <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 text-lg px-8 py-4">
                  <Brain className="w-5 h-5 mr-2" />
                  Testar IA Grátis
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Ver Planos
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                +50.000 usuários
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                R$ 1.2B+ faturados
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                4.9/5 avaliação
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="tools" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Zap className="w-4 h-4 mr-2" />
              Ferramentas IA
            </TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <BookOpen className="w-4 h-4 mr-2" />
              Cursos
            </TabsTrigger>
            <TabsTrigger value="community" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Comunidade
            </TabsTrigger>
            <TabsTrigger value="ranking" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Trophy className="w-4 h-4 mr-2" />
              Ranking
            </TabsTrigger>
          </TabsList>

          {/* AI Tools */}
          <TabsContent value="tools" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ferramentas de IA que Faturam</h2>
              <p className="text-lg text-gray-600">Cada ferramenta foi criada para multiplicar seus resultados</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiTools.map((tool, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-gray-100 hover:border-purple-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-3 rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        {tool.icon}
                      </div>
                      {tool.premium && <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">PRO</Badge>}
                    </div>
                    <CardTitle className="text-xl text-gray-900">{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{tool.description}</p>
                    {tool.available ? (
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Acessar Ferramenta
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full border-purple-600 text-purple-600">
                        <Lock className="w-4 h-4 mr-2" />
                        Fazer Upgrade
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Courses */}
          <TabsContent value="courses" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Cursos que Transformam Vidas</h2>
              <p className="text-lg text-gray-600">Aprenda as estratégias dos milionários digitais</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="text-4xl mb-4">{course.image}</div>
                    <CardTitle className="text-xl text-gray-900">{course.title}</CardTitle>
                    <p className="text-gray-600">{course.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{course.lessons} aulas</span>
                        <span>{course.duration}</span>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progresso</span>
                          <span className="text-purple-600 font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        {course.progress > 0 ? "Continuar" : "Iniciar Curso"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Community */}
          <TabsContent value="community" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Community Feed */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-purple-600" />
                      Feed da Comunidade
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mb-6">
                      <Textarea
                        placeholder="Compartilhe seus resultados, dicas ou conquistas..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="border-gray-200"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <ImageIcon className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Paperclip className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Smile className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button className="bg-purple-600 hover:bg-purple-700">
                          <Send className="w-4 h-4 mr-2" />
                          Publicar
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {communityPosts.map((post, index) => (
                        <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                          <div className="flex items-start space-x-3">
                            <Avatar>
                              <AvatarFallback className="bg-purple-100 text-purple-600">{post.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-medium text-gray-900">{post.author}</span>
                                <span className="text-sm text-gray-500">{post.time}</span>
                              </div>
                              <p className="text-gray-700 mb-3">{post.content}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <button className="flex items-center space-x-1 hover:text-purple-600">
                                  <Heart className="w-4 h-4" />
                                  <span>{post.likes}</span>
                                </button>
                                <button className="flex items-center space-x-1 hover:text-purple-600">
                                  <MessageCircle className="w-4 h-4" />
                                  <span>{post.comments}</span>
                                </button>
                                <button className="flex items-center space-x-1 hover:text-purple-600">
                                  <Share2 className="w-4 h-4" />
                                  <span>Compartilhar</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Chat */}
              <div>
                <Card className="h-[600px] flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <MessageCircle className="w-5 h-5 mr-2 text-purple-600" />
                        Chat da Comunidade
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-500">847 online</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1 space-y-3 mb-4 overflow-y-auto">
                      {chatHistory.map((chat) => (
                        <div key={chat.id} className="flex items-start space-x-3 group">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                              {chat.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-gray-900">{chat.author}</span>
                              <span className="text-xs text-gray-500">{chat.time}</span>
                            </div>
                            {chat.type === "text" ? (
                              <p className="text-sm text-gray-700 break-words">{chat.message}</p>
                            ) : chat.type === "image" ? (
                              <div className="bg-gray-100 rounded-lg p-2 text-sm text-gray-600">
                                📸 {chat.content}
                              </div>
                            ) : (
                              <div className="bg-gray-100 rounded-lg p-2 text-sm text-gray-600">
                                🎥 {chat.message}
                              </div>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Paperclip className="w-4 h-4" />
                        </Button>
                        <Input
                          placeholder="Digite sua mensagem..."
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          className="border-gray-200 flex-1"
                        />
                        <Button variant="ghost" size="sm">
                          <Smile className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={sendMessage}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Ranking */}
          <TabsContent value="ranking" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ranking dos Milionários</h2>
              <p className="text-lg text-gray-600">Veja quem está faturando mais na comunidade</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Ranking */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                    Top Faturamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rankings.map((user, index) => (
                      <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${user.name === "Você" ? "bg-purple-50 border border-purple-200" : "bg-gray-50"}`}>
                        <div className="flex items-center space-x-3">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                            index === 0 ? "bg-yellow-500 text-white" :
                            index === 1 ? "bg-gray-400 text-white" :
                            index === 2 ? "bg-amber-600 text-white" :
                            "bg-purple-600 text-white"
                          }`}>
                            {user.position}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <Badge variant="outline" className={`text-xs ${
                              user.level === "DIAMOND" ? "border-blue-500 text-blue-600" :
                              user.level === "PLATINUM" ? "border-gray-500 text-gray-600" :
                              user.level === "GOLD" ? "border-yellow-500 text-yellow-600" :
                              "border-purple-500 text-purple-600"
                            }`}>
                              {user.level}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">{user.revenue}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Personal Dashboard */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                    Seu Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">R$ 234.560</div>
                      <div className="text-gray-600">Faturamento Total</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">47°</div>
                        <div className="text-sm text-gray-600">Posição</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">SILVER</div>
                        <div className="text-sm text-gray-600">Nível</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Progresso para GOLD</span>
                        <span className="text-purple-600 font-medium">68%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                      <div className="text-xs text-gray-500">Faltam R$ 165.440 para o próximo nível</div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <h4 className="font-medium text-gray-900 mb-3">Conquistas Recentes</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Crown className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-gray-700">Primeiro 100K</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Trophy className="w-4 h-4 text-purple-500" />
                          <span className="text-sm text-gray-700">Master do Copy</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
