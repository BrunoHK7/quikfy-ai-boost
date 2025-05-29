import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Brain, 
  Zap, 
  Target, 
  TrendingUp, 
  Users, 
  Star, 
  Play, 
  Sparkles,
  ImageIcon,
  Mic,
  Video,
  User,
  Lock,
  Crown,
  Palette,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

const Index = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const isAdmin = profile?.role === 'admin';
  const isPremium = isAdmin || profile?.role === 'pro' || profile?.role === 'vip' || profile?.role === 'essential';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-glow">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">QUIKFY</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/carousel-creator" className="text-muted-foreground hover:text-purple-600 transition-colors font-medium">
              QuikDesign
            </Link>
            <Link to="/carousel-generator" className="text-muted-foreground hover:text-purple-600 transition-colors font-medium">
              IA Carrossel
            </Link>
            {!isPremium ? (
              <Link to="/podcasts" className="text-muted-foreground hover:text-purple-600 transition-colors flex items-center font-medium">
                Podcasts <Lock className="w-3 h-3 ml-1" />
              </Link>
            ) : (
              <Link to="/podcasts" className="text-muted-foreground hover:text-purple-600 transition-colors font-medium">
                Podcasts
              </Link>
            )}
            {!isPremium ? (
              <Link to="/content-feed" className="text-muted-foreground hover:text-purple-600 transition-colors flex items-center font-medium">
                Conteúdo <Lock className="w-3 h-3 ml-1" />
              </Link>
            ) : (
              <Link to="/content-feed" className="text-muted-foreground hover:text-purple-600 transition-colors font-medium">
                Conteúdo
              </Link>
            )}
          </nav>
          <div className="flex items-center space-x-3">
            <Link to="/profile">
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                Perfil
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="purple" size="sm">
                Entrar
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20" />
        <div className="container mx-auto px-4 relative">
          <Badge className="mb-8 bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700 text-sm font-semibold px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Powered by AI
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Ferramentas e cursos de IA para <br />
            <span className="gradient-text">criadores digitais</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Domine as ferramentas de IA mais poderosas do mercado e transforme 
            seu negócio digital com nossa plataforma completa de ensino e produtividade.
          </p>
          
          {/* Prova Social */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="glass rounded-2xl p-6 hover:shadow-glow transition-all duration-300">
              <div className="text-3xl font-bold gradient-text mb-2">50k+</div>
              <div className="text-sm text-muted-foreground font-medium">Usuários ativos</div>
            </div>
            <div className="glass rounded-2xl p-6 hover:shadow-glow transition-all duration-300">
              <div className="text-3xl font-bold gradient-text mb-2">24/7</div>
              <div className="text-sm text-muted-foreground font-medium">Suporte disponível</div>
            </div>
            <div className="glass rounded-2xl p-6 hover:shadow-glow transition-all duration-300">
              <div className="text-3xl font-bold gradient-text mb-2">R$ 50M+</div>
              <div className="text-sm text-muted-foreground font-medium">Faturamento dos usuários</div>
            </div>
            <div className="glass rounded-2xl p-6 hover:shadow-glow transition-all duration-300">
              <div className="text-3xl font-bold gradient-text mb-2">95%</div>
              <div className="text-sm text-muted-foreground font-medium">Satisfação</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAdmin && (
              <Link to="/pricing">
                <Button variant="purple" size="lg" className="group">
                  <Crown className="w-5 h-5 mr-2" />
                  Assinar Agora
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
            <Link to="/carousel-creator">
              <Button variant="purple-outline" size="lg" className="group">
                <Palette className="w-5 h-5 mr-2" />
                Usar QuikDesign Grátis
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Ferramentas e recursos exclusivos
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para dominar a criação de conteúdo com IA
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* QuikDesign - Sempre grátis */}
            <Card className="text-center hover:shadow-lg transition-all duration-300 border-2 border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20 group hover:-translate-y-2">
              <CardHeader>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 mx-auto mb-4 w-fit text-xs font-bold px-3 py-1">
                  GRÁTIS
                </Badge>
                <div className="mx-auto mb-4 p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 w-fit shadow-lg group-hover:shadow-glow transition-all duration-300">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-2">QuikDesign</CardTitle>
                <CardDescription>
                  Criador profissional de carrosséis para redes sociais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/carousel-creator">
                  <Button variant="outline" className="w-full group">
                    Usar Grátis
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* IA Carrossel - Todos usuários autenticados (usa créditos) */}
            <Card className="text-center hover:shadow-lg transition-all duration-300 relative group hover:-translate-y-2">
              {isAdmin && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs">ADMIN</Badge>
                </div>
              )}
              <CardHeader>
                <Badge className={`mx-auto mb-4 w-fit text-xs font-bold px-3 py-1 ${isAdmin ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'}`}>
                  {isAdmin ? 'ILIMITADO' : 'USA CRÉDITOS'}
                </Badge>
                <div className="mx-auto mb-4 p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 w-fit shadow-lg group-hover:shadow-glow transition-all duration-300">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-2">IA Carrossel</CardTitle>
                <CardDescription>
                  Gere carrosséis automaticamente com nossa IA especializada
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user ? (
                  <Link to="/carousel-generator">
                    <Button variant="outline" className="w-full group">
                      Usar IA Carrossel
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button variant="outline" className="w-full group">
                      Fazer Login para Usar
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Podcasts - Premium content */}
            <Card className="text-center hover:shadow-lg transition-all duration-300 relative group hover:-translate-y-2">
              {!isPremium && (
                <div className="absolute top-4 right-4">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              {isAdmin && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs">ADMIN</Badge>
                </div>
              )}
              <CardHeader>
                <Badge className={`mx-auto mb-4 w-fit text-xs font-bold px-3 py-1 ${isAdmin || isPremium ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300'}`}>
                  {isAdmin || isPremium ? 'LIBERADO' : 'PREMIUM'}
                </Badge>
                <div className="mx-auto mb-4 p-4 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 w-fit shadow-lg group-hover:shadow-glow transition-all duration-300">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-2">Podcasts</CardTitle>
                <CardDescription>
                  Cursos e podcasts exclusivos com especialistas em IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isPremium ? (
                  <Link to="/podcasts">
                    <Button variant="outline" className="w-full group">
                      Acessar Podcasts
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/pricing">
                    <Button variant="outline" className="w-full group">
                      Assinar para Acessar
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Conteúdo Exclusivo - Premium content */}
            <Card className="text-center hover:shadow-lg transition-all duration-300 relative group hover:-translate-y-2">
              {!isPremium && (
                <div className="absolute top-4 right-4">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              {isAdmin && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs">ADMIN</Badge>
                </div>
              )}
              <CardHeader>
                <Badge className={`mx-auto mb-4 w-fit text-xs font-bold px-3 py-1 ${isAdmin || isPremium ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300'}`}>
                  {isAdmin || isPremium ? 'LIBERADO' : 'PREMIUM'}
                </Badge>
                <div className="mx-auto mb-4 p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 w-fit shadow-lg group-hover:shadow-glow transition-all duration-300">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-2">Conteúdo Exclusivo</CardTitle>
                <CardDescription>
                  Cursos, templates e estratégias criadas pelos especialistas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isPremium ? (
                  <Link to="/content-feed">
                    <Button variant="outline" className="w-full group">
                      Ver Conteúdo
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/pricing">
                    <Button variant="outline" className="w-full group">
                      Assinar para Ver
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Pronto para dominar as ferramentas de IA?
          </h2>
          <p className="text-xl mb-12 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Junte-se a milhares de criadores que já faturam milhões com nossa plataforma
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {!isAdmin && (
              <Link to="/pricing">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <Crown className="w-5 h-5 mr-2" />
                  Começar Agora
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
            <Link to="/carousel-creator">
              <Button size="lg" className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white hover:text-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <Palette className="w-5 h-5 mr-2" />
                Experimentar QuikDesign
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-glow">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">QUIKFY</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                A plataforma completa de ferramentas e cursos de IA para criadores digitais.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Ferramentas</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link to="/carousel-creator" className="hover:text-purple-600 transition-colors">QuikDesign</Link></li>
                <li><Link to="/carousel-generator" className="hover:text-purple-600 transition-colors">IA Carrossel</Link></li>
                <li><Link to="/podcasts" className="hover:text-purple-600 transition-colors">Podcasts</Link></li>
                <li><Link to="/content-feed" className="hover:text-purple-600 transition-colors">Conteúdo Exclusivo</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Comunidade</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-purple-600 transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Telegram</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">YouTube</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Instagram</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Suporte</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-purple-600 transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 QUIKFY. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
