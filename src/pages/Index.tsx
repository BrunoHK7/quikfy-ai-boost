import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Instagram, 
  Video, 
  Zap,
  Sparkles,
  Crown,
  Mic,
  Users,
  ArrowRight,
  Star,
  Target,
  TrendingUp,
  Palette,
  FileText,
  BarChart3,
  Camera,
  Mail,
  MessageCircle,
  Globe,
  Play
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { AdminAccessWrapper } from "@/components/AdminAccessWrapper";
import { usePageReload } from "@/hooks/usePageReload";

const Index = () => {
  const { user } = useAuth();
  const { profile, refetch: refetchProfile } = useProfile();
  const navigate = useNavigate();

  // Previne recarregamento da página
  usePageReload();

  // Admin users have access to everything
  const isAdmin = profile?.role === 'admin';
  const isPremium = isAdmin || ['plus', 'pro', 'vip'].includes(profile?.role || '');

  // Force profile refresh for admin users
  const handleForceRefresh = async () => {
    if (user) {
      await refetchProfile();
      window.location.reload();
    }
  };

  const tools = [
    {
      title: "QuikDesign",
      description: "Crie designs profissionais para redes sociais em segundos",
      icon: Palette,
      gradient: "from-purple-500 to-indigo-500",
      href: "/carousel-creator",
      category: "creation",
      free: true
    },
    {
      title: "Carrossel IA",
      description: "Crie carrosséis virais que convertem com nossa IA especializada",
      icon: Instagram,
      gradient: "from-pink-500 to-rose-500",
      href: "/carousel-generator",
      hot: true,
      category: "creation",
      uses: true
    }
  ];

  const premiumContent = [
    {
      title: "Podcasts",
      description: "Cursos e podcasts exclusivos com especialistas em IA",
      icon: Mic,
      gradient: "from-pink-500 to-purple-500",
      href: "/podcasts",
      badge: "PREMIUM"
    },
    {
      title: "Conteúdo Exclusivo",
      description: "Cursos, templates e estratégias criadas pelos especialistas",
      icon: Video,
      gradient: "from-blue-500 to-indigo-500", 
      href: "/content-feed",
      badge: "PREMIUM"
    }
  ];

  const stats = [
    { icon: Users, value: "50K+", label: "Usuários Ativos" },
    { icon: Zap, value: "1M+", label: "Conteúdos Gerados" },
    { icon: TrendingUp, value: "300%", label: "Aumento em Vendas" },
    { icon: Star, value: "4.9", label: "Avaliação Média" }
  ];

  const getUsesText = (planType: string) => {
    switch (planType) {
      case 'free': return '3 usos';
      case 'plus': return '10 usos';
      case 'pro': return '30 usos';
      case 'vip': 
      case 'admin': 
        return 'Usos ilimitados';
      default: return '3 usos';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold">QUIKFY</span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700">
                    <Crown className="w-4 h-4 mr-1" />
                    Admin
                  </Badge>
                )}
                {/* Debug button for admin role update */}
                {user?.id === 'f870ffbc-d23a-458d-bac5-131291b5676d' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleForceRefresh}
                    className="text-xs"
                  >
                    Atualizar Role
                  </Button>
                )}
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" className="border-yellow-600 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950">
                      Administração
                    </Button>
                  </Link>
                )}
                <Link to="/profile">
                  <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950">
                    Perfil
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="outline">Entrar</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-purple-600 hover:bg-purple-700">Cadastrar</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-background dark:bg-background py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700">
              🚀 A Revolução da IA chegou
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Crie Conteúdo que <span className="text-purple-600">Converte</span> com IA
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Transforme ideias em milhões. Nossa plataforma com IA especializada cria carrosséis, designs, 
              scripts e campanhas que realmente vendem. Usado por +50K empreendedores.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/carousel-creator">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-4">
                  <Palette className="w-6 h-6 mr-2" />
                  Usar QuikDesign Grátis
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950">
                  Ver Planos Premium
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 bg-muted/30 dark:bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Ferramentas Poderosas de <span className="text-purple-600">IA</span></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cada ferramenta foi projetada para maximizar suas conversões e acelerar seus resultados
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {tools.map((tool, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.gradient} p-4 mb-4 group-hover:scale-110 transition-transform`}>
                      <tool.icon className="w-8 h-8 text-white" />
                    </div>
                    {tool.hot && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white border-0 text-xs">
                        🔥 HOT
                      </Badge>
                    )}
                    {tool.free && (
                      <Badge className="absolute -top-2 -right-2 bg-green-500 text-white border-0 text-xs">
                        ✨ GRÁTIS
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{tool.title}</CardTitle>
                  <p className="text-muted-foreground">{tool.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="text-xs">
                      {tool.free 
                        ? 'Gratuito para todos' 
                        : tool.uses 
                          ? (isAdmin ? 'Usos ilimitados (Admin)' : getUsesText(profile?.role || 'free'))
                          : 'Gratuito'
                      }
                    </Badge>
                  </div>
                  <Link to={tool.href}>
                    <Button className="w-full group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      {tool.free ? 'Usar Grátis' : 'Usar Agora'}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Conteúdo <span className="text-purple-600">Exclusivo</span></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isAdmin 
                ? "Como admin, você tem acesso total a todo conteúdo premium"
                : isPremium 
                  ? "Acesse cursos e conteúdos exclusivos dos nossos especialistas"
                  : "Upgrade para Premium e acesse conteúdos exclusivos dos nossos especialistas"
              }
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {premiumContent.map((content, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-card/50 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                    {content.badge}
                  </Badge>
                </div>
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${content.gradient} p-4 mb-4 group-hover:scale-110 transition-transform`}>
                    <content.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{content.title}</CardTitle>
                  <p className="text-muted-foreground">{content.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Admin users always get access */}
                  <AdminAccessWrapper
                    fallback={
                      isPremium ? (
                        <Link to={content.href}>
                          <Button className="w-full bg-purple-600 hover:bg-purple-700">
                            <Play className="w-4 h-4 mr-2" />
                            Acessar Agora
                          </Button>
                        </Link>
                      ) : (
                        <Link to="/pricing">
                          <Button className="w-full" variant="outline">
                            <Crown className="w-4 h-4 mr-2" />
                            Assinar para Acessar
                          </Button>
                        </Link>
                      )
                    }
                  >
                    <Link to={content.href}>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        <Play className="w-4 h-4 mr-2" />
                        Acessar Agora (Admin)
                      </Button>
                    </Link>
                  </AdminAccessWrapper>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Melhor design e contraste */}
      <section className="py-24 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-300/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-300/5 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-8 bg-yellow-400/20 text-yellow-200 border-yellow-400/30 backdrop-blur-sm">
              ⚡ Transforme seu negócio hoje mesmo
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Pronto para <span className="text-yellow-300 drop-shadow-lg">Revolucionar</span> seu Negócio?
            </h2>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90 leading-relaxed">
              Junte-se a mais de <strong className="text-yellow-300">50.000 empreendedores</strong> que já estão 
              faturando mais com nossa plataforma de IA
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/carousel-creator">
                <Button 
                  size="lg" 
                  className="bg-white text-purple-900 hover:bg-gray-100 text-lg px-10 py-5 font-semibold shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:scale-105 border-2 border-white/20"
                >
                  <Palette className="w-6 h-6 mr-3" />
                  Começar Grátis com QuikDesign
                </Button>
              </Link>
              <Link to="/pricing">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white/40 text-white hover:bg-white/10 hover:border-white text-lg px-10 py-5 font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  <Crown className="w-6 h-6 mr-3" />
                  Ver Planos Premium
                </Button>
              </Link>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                <div className="w-12 h-12 bg-green-400/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-green-300" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Resultados Imediatos</h3>
                <p className="text-white/80 text-sm">Veja resultados em minutos, não em meses</p>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-300" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Comunidade Ativa</h3>
                <p className="text-white/80 text-sm">Networking com outros empreendedores</p>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                <div className="w-12 h-12 bg-purple-400/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-purple-300" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Suporte Premium</h3>
                <p className="text-white/80 text-sm">Assistência dedicada para seu sucesso</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
