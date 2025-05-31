
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePageReload } from "@/hooks/usePageReload";
import { 
  Instagram, 
  Sparkles, 
  Target, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Trophy,
  Heart,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  usePageReload();

  const features = [
    {
      icon: <Instagram className="w-8 h-8 text-purple-600" />,
      title: "Carrosséis para Instagram",
      description: "Crie carrosséis profissionais com nossa IA especializada em marketing digital"
    },
    {
      icon: <Sparkles className="w-8 h-8 text-purple-600" />,
      title: "IA Avançada",
      description: "Nossa inteligência artificial cria conteúdo otimizado para engagement"
    },
    {
      icon: <Target className="w-8 h-8 text-purple-600" />,
      title: "Resultados Comprovados",
      description: "Aumente suas vendas e alcance com conteúdo que converte"
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Empreendedora Digital",
      content: "Meus carrosséis nunca tiveram tanto engajamento! A IA realmente entende o que funciona.",
      rating: 5
    },
    {
      name: "João Santos",
      role: "Coach",
      content: "Em apenas 1 mês usando a plataforma, dobrei meu alcance no Instagram.",
      rating: 5
    },
    {
      name: "Ana Costa",
      role: "Consultora",
      content: "A qualidade dos carrosséis é impressionante. Economizo horas de trabalho.",
      rating: 5
    }
  ];

  const plans = [
    {
      name: "Plus",
      price: "R$ 29,99",
      period: "/mês",
      description: "Perfeito para começar",
      features: [
        "50 carrosséis por mês",
        "Templates premium",
        "Suporte por email",
        "Exportação em alta qualidade"
      ],
      highlight: false
    },
    {
      name: "Pro",
      price: "R$ 79,99",
      period: "/mês",
      description: "Para profissionais",
      features: [
        "200 carrosséis por mês",
        "Todos os templates",
        "Suporte prioritário",
        "Analytics avançados",
        "Acesso a cursos exclusivos"
      ],
      highlight: true
    },
    {
      name: "VIP",
      price: "R$ 199,99",
      period: "/mês",
      description: "Para empresas",
      features: [
        "Carrosséis ilimitados",
        "Templates exclusivos",
        "Suporte 24/7",
        "Consultoria personalizada",
        "Acesso total à plataforma"
      ],
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-6 bg-purple-100 text-purple-800 border-purple-200">
          🚀 Nova IA Disponível
        </Badge>
        
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Crie Carrosséis que
          <span className="text-purple-600"> Convertem</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Nossa IA especializada em marketing digital cria carrosséis profissionais 
          que aumentam seu engajamento e vendas no Instagram.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/register">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
              <Zap className="w-5 h-5 mr-2" />
              Começar Gratuitamente
            </Button>
          </Link>
          <Link to="/pricing">
            <Button variant="outline" size="lg" className="border-purple-200 text-purple-600 hover:bg-purple-50">
              Ver Planos
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            Sem necessidade de cartão
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            Cancele quando quiser
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Por que escolher nossa plataforma?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Desenvolvemos a tecnologia mais avançada para criação de conteúdo
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-purple-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              O que nossos usuários dizem
            </h2>
            <p className="text-gray-600">
              Mais de 10.000 criadores já transformaram seus resultados
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Escolha seu plano
          </h2>
          <p className="text-gray-600">
            Planos flexíveis para todos os tipos de criadores
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative border-2 ${plan.highlight ? 'border-purple-500 shadow-2xl scale-105' : 'border-gray-200'}`}>
              {plan.highlight && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white">
                  Mais Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-900">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="w-full">
                  <Button 
                    className={`w-full ${
                      plan.highlight 
                        ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                        : 'bg-white hover:bg-gray-50 text-purple-600 border-2 border-purple-600'
                    }`}
                  >
                    Começar Agora
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">
              Pronto para transformar seu Instagram?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Junte-se a mais de 10.000 criadores que já estão criando carrosséis que convertem
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  <Heart className="w-5 h-5 mr-2" />
                  Começar Gratuitamente
                </Button>
              </Link>
              <Link to="/pricing">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white hover:text-purple-600"
                >
                  Ver Planos
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            <p className="text-purple-200 text-sm mt-4">
              Comece grátis • Sem cartão de crédito • Cancele quando quiser
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
