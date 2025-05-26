
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
  Palette
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
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
            <Link to="/carousel-creator" className="text-gray-600 hover:text-purple-600 transition-colors">
              QuikDesign
            </Link>
            <Link to="/carousel-generator" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center">
              IA Carrossel <Lock className="w-3 h-3 ml-1" />
            </Link>
            <Link to="/podcasts" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center">
              Podcasts <Lock className="w-3 h-3 ml-1" />
            </Link>
            <Link to="/content-feed" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center">
              Conteúdo <Lock className="w-3 h-3 ml-1" />
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-purple-600 transition-colors">
              Preços
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/profile">
              <Button variant="outline" size="sm" className="border-purple-200">
                <User className="w-4 h-4 mr-2" />
                Perfil
              </Button>
            </Link>
            <Link to="/login">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <Badge className="mb-6 bg-purple-100 text-purple-700 border-purple-200">
            <Sparkles className="w-4 h-4 mr-2" />
            Powered by AI
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Ferramentas e cursos de IA para <br />
            <span className="text-purple-600">criadores digitais</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Domine as ferramentas de IA mais poderosas do mercado e transforme 
            seu negócio digital com nossa plataforma completa de ensino e produtividade.
          </p>
          
          {/* Prova Social */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600 mb-1">50k+</div>
              <div className="text-sm text-gray-600">Usuários ativos</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600 mb-1">24/7</div>
              <div className="text-sm text-gray-600">Suporte disponível</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600 mb-1">R$ 50M+</div>
              <div className="text-sm text-gray-600">Faturamento dos usuários</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600 mb-1">95%</div>
              <div className="text-sm text-gray-600">Satisfação</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pricing">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 px-8 py-3">
                <Crown className="w-5 h-5 mr-2" />
                Assinar Agora
              </Button>
            </Link>
            <Link to="/carousel-creator">
              <Button size="lg" variant="outline" className="border-purple-200 px-8 py-3">
                <Palette className="w-5 h-5 mr-2" />
                Usar QuikDesign Grátis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Ferramentas e recursos exclusivos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow border-2 border-green-200 bg-green-50">
              <CardHeader>
                <Badge className="bg-green-100 text-green-700 mx-auto mb-2 w-fit">
                  GRÁTIS
                </Badge>
                <Palette className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-lg">QuikDesign</CardTitle>
                <CardDescription>
                  Criador profissional de carrosséis para redes sociais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/carousel-creator">
                  <Button variant="outline" className="w-full">
                    Usar Grátis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow relative">
              <div className="absolute top-2 right-2">
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
              <CardHeader>
                <Badge className="bg-orange-100 text-orange-700 mx-auto mb-2 w-fit">
                  PREMIUM
                </Badge>
                <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-lg">IA Carrossel</CardTitle>
                <CardDescription>
                  Gere carrosséis automaticamente com nossa IA especializada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/pricing">
                  <Button variant="outline" className="w-full">
                    Assinar para Usar
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow relative">
              <div className="absolute top-2 right-2">
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
              <CardHeader>
                <Badge className="bg-orange-100 text-orange-700 mx-auto mb-2 w-fit">
                  PREMIUM
                </Badge>
                <Mic className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Podcasts</CardTitle>
                <CardDescription>
                  Cursos e podcasts exclusivos com especialistas em IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/pricing">
                  <Button variant="outline" className="w-full">
                    Assinar para Acessar
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow relative">
              <div className="absolute top-2 right-2">
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
              <CardHeader>
                <Badge className="bg-orange-100 text-orange-700 mx-auto mb-2 w-fit">
                  PREMIUM
                </Badge>
                <Video className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Conteúdo Exclusivo</CardTitle>
                <CardDescription>
                  Cursos, templates e estratégias criadas pelos especialistas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/pricing">
                  <Button variant="outline" className="w-full">
                    Assinar para Ver
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Plans Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Escolha seu plano
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-6xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg text-gray-600">Free</CardTitle>
                <div className="text-2xl font-bold">R$ 0</div>
                <CardDescription>Apenas QuikDesign</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center border-purple-200">
              <CardHeader>
                <CardTitle className="text-lg text-purple-600">Essential</CardTitle>
                <div className="text-2xl font-bold">R$ 29</div>
                <CardDescription>Ferramentas básicas</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center border-purple-400 bg-purple-50">
              <CardHeader>
                <Badge className="bg-purple-100 text-purple-700 mx-auto mb-2">
                  POPULAR
                </Badge>
                <CardTitle className="text-lg text-purple-600">Pro</CardTitle>
                <div className="text-2xl font-bold">R$ 99</div>
                <CardDescription>Todas as ferramentas</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center border-yellow-400">
              <CardHeader>
                <CardTitle className="text-lg text-yellow-600">VIP</CardTitle>
                <div className="text-2xl font-bold">R$ 299</div>
                <CardDescription>Acesso total + mentoria</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center border-gray-400">
              <CardHeader>
                <CardTitle className="text-lg text-gray-600">ADM</CardTitle>
                <div className="text-2xl font-bold">---</div>
                <CardDescription>Administradores</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="mt-8">
            <Link to="/pricing">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Ver Todos os Planos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para dominar as ferramentas de IA?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Junte-se a milhares de criadores que já faturam milhões com nossa plataforma
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pricing">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3">
                Começar Agora
              </Button>
            </Link>
            <Link to="/carousel-creator">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3">
                Experimentar QuikDesign
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-6 h-6 text-purple-400" />
                <span className="text-xl font-bold">QUIKFY</span>
              </div>
              <p className="text-gray-400">
                A plataforma completa de ferramentas e cursos de IA para criadores digitais.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Ferramentas</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/carousel-creator" className="hover:text-white">QuikDesign</Link></li>
                <li><Link to="/carousel-generator" className="hover:text-white">IA Carrossel</Link></li>
                <li><Link to="/podcasts" className="hover:text-white">Podcasts</Link></li>
                <li><Link to="/content-feed" className="hover:text-white">Conteúdo Exclusivo</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Comunidade</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Discord</a></li>
                <li><a href="#" className="hover:text-white">Telegram</a></li>
                <li><a href="#" className="hover:text-white">YouTube</a></li>
                <li><a href="#" className="hover:text-white">Instagram</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white">Contato</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
                <li><Link to="/pricing" className="hover:text-white">Preços</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 QUIKFY. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
