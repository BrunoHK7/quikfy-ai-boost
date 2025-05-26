
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
  User
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
            <Link to="/carousel-generator" className="text-gray-600 hover:text-purple-600 transition-colors">
              IA Carrossel
            </Link>
            <Link to="/carousel-creator" className="text-gray-600 hover:text-purple-600 transition-colors">
              Criador Pro
            </Link>
            <Link to="/podcasts" className="text-gray-600 hover:text-purple-600 transition-colors">
              Podcasts
            </Link>
            <Link to="/content-feed" className="text-gray-600 hover:text-purple-600 transition-colors">
              Conteúdo
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
            A plataforma completa para <br />
            <span className="text-purple-600">criadores digitais</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Crie carrosséis profissionais, acesse conteúdo exclusivo e faça parte de uma 
            comunidade que já fatura milhões com marketing digital e IA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/carousel-creator">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 px-8 py-3">
                <ImageIcon className="w-5 h-5 mr-2" />
                Criar Carrossel Pro
              </Button>
            </Link>
            <Link to="/carousel-generator">
              <Button size="lg" variant="outline" className="border-purple-200 px-8 py-3">
                <Brain className="w-5 h-5 mr-2" />
                Gerar com IA
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Tudo que você precisa em uma só plataforma
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <ImageIcon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Criador de Carrossel</CardTitle>
                <CardDescription>
                  Ferramenta profissional completa para criar carrosséis de alta conversão
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/carousel-creator">
                  <Button variant="outline" className="w-full">
                    Criar Agora
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-lg">IA Carrossel</CardTitle>
                <CardDescription>
                  Gere carrosséis automaticamente com nossa IA especializada em copywriting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/carousel-generator">
                  <Button variant="outline" className="w-full">
                    Gerar com IA
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Mic className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Podcasts</CardTitle>
                <CardDescription>
                  Acesse podcasts exclusivos e lives semanais com especialistas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/podcasts">
                  <Button variant="outline" className="w-full">
                    Ouvir Agora
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Video className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Feed de Conteúdo</CardTitle>
                <CardDescription>
                  Conteúdo exclusivo criado pelos administradores da comunidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/content-feed">
                  <Button variant="outline" className="w-full">
                    Ver Conteúdo
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Resultados que falam por si só
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">50k+</div>
              <div className="text-gray-600">Criadores ativos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">1M+</div>
              <div className="text-gray-600">Carrosséis criados</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">300%</div>
              <div className="text-gray-600">Aumento médio em conversão</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">Suporte disponível</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para transformar seu marketing digital?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Junte-se a milhares de criadores que já faturam com nossa plataforma
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/carousel-creator">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3">
                Começar Agora
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3">
                Ver Preços
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
                A plataforma completa para criadores digitais que querem resultados reais.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Ferramentas</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/carousel-creator" className="hover:text-white">Criador de Carrossel</Link></li>
                <li><Link to="/carousel-generator" className="hover:text-white">IA Carrossel</Link></li>
                <li><Link to="/podcasts" className="hover:text-white">Podcasts</Link></li>
                <li><Link to="/content-feed" className="hover:text-white">Feed de Conteúdo</Link></li>
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
