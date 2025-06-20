
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CoursesSection } from "@/components/CoursesSection";
import { 
  Palette,
  Instagram,
  ArrowRight,
  Crown,
  Link as LinkIcon
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  
  const isSubscribed = subscription?.subscribed;

  const tools = [
    {
      title: "QuikDesign",
      description: "Crie designs profissionais em minutos.",
      icon: <Palette className="w-8 h-8 text-purple-600" />,
      link: "/carousel-creator",
      buttonText: "Acessar QuikDesign"
    },
    {
      title: "IA Carrossel",
      description: "Gere carrosséis persuasivos automaticamente.",
      icon: <Instagram className="w-8 h-8 text-purple-600" />,
      link: "/carousel-briefing",
      buttonText: "Acessar IA Carrossel"
    }
  ];

  const scrollToFerramentas = () => {
    const element = document.getElementById('ferramentas');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Você acaba de encontrar a caixa de ferramentas definitiva para fazer seu negócio
              <span className="text-purple-600"> crescer!</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
              Automatize processos, crie conteúdos virais e aprenda com os melhores — tudo em um só lugar.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Link to="/profile">
                    <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white min-w-40">
                      Meu Perfil
                    </Button>
                  </Link>
                  {isSubscribed ? (
                    <Link to="/settings">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 min-w-40"
                      >
                        <Crown className="w-5 h-5 mr-2" />
                        Gerenciar Assinatura
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/pricing">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 min-w-40"
                      >
                        Assinar Agora
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link to="/profile">
                    <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white min-w-40">
                      Meu Perfil
                    </Button>
                  </Link>
                  <Link to="/pricing">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 min-w-40"
                    >
                      Assinar Agora
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Seção Cursos */}
        <CoursesSection />

        {/* Seção Ferramentas */}
        <section id="ferramentas" className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ferramentas que impulsionam seus resultados
              </h2>
              <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
                Explore soluções que otimizam o seu trabalho e elevam a qualidade do que você entrega.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {tools.map((tool, index) => (
                <Card key={index} className="border-2 border-gray-200 hover:border-purple-300 transition-all duration-300 bg-white hover:shadow-lg group">
                  <CardHeader className="text-center pb-6">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                      {tool.icon}
                    </div>
                    <CardTitle className="text-2xl text-gray-900 mb-2">{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-gray-600 mb-8 text-base leading-relaxed">
                      {tool.description}
                    </CardDescription>
                    <Link to={tool.link}>
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        size="lg"
                      >
                        {tool.buttonText}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
