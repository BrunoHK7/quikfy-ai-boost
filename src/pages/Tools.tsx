
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { 
  Palette,
  Instagram,
  ArrowRight,
  Wrench,
  Link
} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

const Tools = () => {
  const tools = [
    {
      title: "QuikDesign",
      description: "Crie designs profissionais em minutos com nossa ferramenta visual intuitiva.",
      icon: <Palette className="w-8 h-8 text-purple-600" />,
      link: "/carousel-creator",
      buttonText: "Acessar QuikDesign",
      category: "Design"
    },
    {
      title: "IA Carrossel",
      description: "Gere carrosséis persuasivos automaticamente usando inteligência artificial.",
      icon: <Instagram className="w-8 h-8 text-purple-600" />,
      link: "/carousel-briefing",
      buttonText: "Acessar IA Carrossel",
      category: "IA"
    },
    {
      title: "Página de Links",
      description: "Crie sua própria página de links personalizada, similar ao Linktree.",
      icon: <Link className="w-8 h-8 text-purple-600" />,
      link: "/linkpage-editor",
      buttonText: "Criar Página de Links",
      category: "Marketing"
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="w-20 h-20 bg-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Wrench className="w-10 h-10 text-purple-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Caixa de <span className="text-purple-600">Ferramentas</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Explore todas as ferramentas disponíveis na plataforma para otimizar seu trabalho e elevar a qualidade do que você entrega.
              </p>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {tools.map((tool, index) => (
                <Card key={index} className="border-2 border-gray-200 hover:border-purple-300 transition-all duration-300 bg-white hover:shadow-lg group">
                  <CardHeader className="text-center pb-6">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                      {tool.icon}
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                        {tool.category}
                      </span>
                    </div>
                    <CardTitle className="text-2xl text-gray-900 mb-2">{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-gray-600 mb-8 text-base leading-relaxed">
                      {tool.description}
                    </CardDescription>
                    <RouterLink to={tool.link}>
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        size="lg"
                      >
                        {tool.buttonText}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </RouterLink>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Coming Soon Section */}
            <div className="text-center mt-16">
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-12 max-w-md mx-auto">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Wrench className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Mais ferramentas em breve</h3>
                <p className="text-gray-600">
                  Estamos sempre desenvolvendo novas ferramentas para ajudar você a crescer ainda mais.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Tools;
