import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { 
  Instagram, 
  Sparkles, 
  ArrowRight,
  User,
  Crown,
  Palette,
  Image
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  const { profile } = useProfile();

  const tools = [
    {
      title: "QuikDesign",
      description: "Crie designs profissionais com nossa ferramenta avançada de design",
      icon: <Palette className="w-8 h-8 text-purple-600" />,
      link: "/carousel-creator",
      available: true
    },
    {
      title: "IA Carrossel",
      description: "Gere carrosséis automaticamente com nossa inteligência artificial",
      icon: <Instagram className="w-8 h-8 text-purple-600" />,
      link: "/carousel-briefing",
      available: true
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Transforme Suas Ideias em
            <span className="text-purple-600"> Conteúdo Viral</span>
          </h1>
          
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Crie carrosséis profissionais que engajam, convertem e fazem sua marca se destacar nas redes sociais. 
            Tudo isso com a potência da inteligência artificial.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {user ? (
              <>
                <Link to="/profile">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                    <User className="w-5 h-5 mr-2" />
                    Ir para o Perfil
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
                  >
                    <Crown className="w-5 h-5 mr-2" />
                    Fazer Upgrade
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Começar Gratuitamente
                  </Button>
                </Link>
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
                  >
                    Fazer Login
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nossas Ferramentas
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Escolha a ferramenta ideal para criar seu conteúdo
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {tools.map((tool, index) => (
              <Card key={index} className="border-2 border-gray-200 hover:border-purple-300 transition-all duration-300 bg-white">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {tool.icon}
                  </div>
                  <CardTitle className="text-2xl text-gray-900">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 mb-6 text-base">
                    {tool.description}
                  </CardDescription>
                  <Link to={tool.link}>
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      size="lg"
                    >
                      Acessar Ferramenta
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Access - Only visible to admin users */}
      {profile?.role === 'admin' && (
        <section className="bg-purple-50 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Painel Administrativo
              </h2>
              <p className="text-gray-700">
                Acesso exclusivo para administradores
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/admin">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                  Dashboard Admin
                </Button>
              </Link>
              <Link to="/admin/create-course">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  Criar Curso
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Pronto para revolucionar seu conteúdo?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Junte-se a milhares de criadores que já estão criando conteúdo que converte
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Link to="/carousel-briefing">
                    <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                      <Image className="w-5 h-5 mr-2" />
                      Criar Agora
                    </Button>
                  </Link>
                  <Link to="/pricing">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border-2 border-white text-white hover:bg-white hover:text-purple-600"
                    >
                      Ver Planos
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Começar Gratuitamente
                    </Button>
                  </Link>
                  <Link to="/pricing">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border-2 border-white text-white hover:bg-white hover:text-purple-600"
                    >
                      Ver Planos
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
