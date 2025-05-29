
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Check, 
  Crown, 
  Zap, 
  Star,
  Rocket,
  Gift,
  Briefcase
} from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      icon: <Gift className="w-6 h-6" />,
      price: 0,
      emoji: "🎁",
      description: "Ideal para teste inicial da plataforma",
      badge: null,
      color: "green",
      features: [
        "3 créditos",
        "Renovação: Não renova",
        "Acesso ao QuikDesign",
        "Suporte básico"
      ],
      credits: "3 créditos",
      renewal: "Não renova",
      accumulation: null,
      obs: "Ideal para teste inicial da plataforma"
    },
    {
      name: "Essential",
      icon: <Briefcase className="w-6 h-6" />,
      price: 15,
      emoji: "💼",
      description: "Para uso básico mensal",
      badge: null,
      color: "blue",
      features: [
        "50 créditos mensais",
        "Renovação: Mensal",
        "Acúmulo: Não cumulativo",
        "Todas as ferramentas básicas",
        "Suporte prioritário"
      ],
      credits: "50 créditos",
      renewal: "Mensal",
      accumulation: "Não cumulativo",
      obs: "Zera e renova a cada mês"
    },
    {
      name: "Pro",
      icon: <Rocket className="w-6 h-6" />,
      price: 99,
      emoji: "🚀",
      description: "Para uso intensivo com acúmulo",
      badge: "MAIS POPULAR",
      color: "purple",
      features: [
        "200 créditos mensais",
        "Renovação: Mensal", 
        "Acúmulo: Cumulativo",
        "Todas as ferramentas premium",
        "Suporte prioritário",
        "Relatórios avançados"
      ],
      credits: "200 créditos",
      renewal: "Mensal",
      accumulation: "Cumulativo",
      obs: "Se o usuário não usar, os créditos acumulam no mês seguinte"
    },
    {
      name: "VIP",
      icon: <Crown className="w-6 h-6" />,
      price: 399,
      emoji: "👑",
      description: "Ideal para uso intensivo da plataforma",
      badge: "ELITE",
      color: "gold",
      features: [
        "500 créditos mensais",
        "Renovação: Mensal",
        "Acúmulo: Cumulativo", 
        "Todas as ferramentas",
        "Suporte 24/7 prioritário",
        "Acesso antecipado",
        "Consultoria exclusiva"
      ],
      credits: "500 créditos",
      renewal: "Mensal",
      accumulation: "Cumulativo",
      obs: "Ideal para uso intensivo da plataforma"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold">QUIKFY</span>
          </Link>
          <Link to="/login">
            <Button variant="outline">Fazer Login</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-purple-100 text-purple-700 border-purple-200">
            <Rocket className="w-4 h-4 mr-2" />
            Transforme seu negócio hoje
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Escolha o plano que vai te fazer 
            <span className="text-purple-600"> milionário</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Cada plano foi desenhado para acelerar seus resultados. 
            Junte-se a mais de 50.000 empreendedores que já faturam milhões com nossas IAs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${
              plan.name === "Pro" 
                ? "ring-2 ring-purple-600 shadow-2xl scale-105" 
                : "hover:shadow-xl"
            } transition-all duration-300`}>
              {plan.badge && (
                <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-sm font-bold text-white ${
                  plan.badge === "MAIS POPULAR" ? "bg-purple-600" : "bg-yellow-600"
                }`}>
                  {plan.badge}
                </div>
              )}
              
              <CardHeader className="text-center pb-6">
                <div className="text-4xl mb-2">{plan.emoji}</div>
                <CardTitle className="text-2xl font-bold">
                  Plano {plan.name}
                </CardTitle>
                
                <div className="mt-6">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-4xl font-bold">
                      {plan.price === 0 ? "Grátis" : `R$ ${plan.price}`}
                    </span>
                  </div>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground">por mês</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Créditos:</span>
                    <span>{plan.credits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Renovação:</span>
                    <span>{plan.renewal}</span>
                  </div>
                  {plan.accumulation && (
                    <div className="flex justify-between">
                      <span className="font-medium">Acúmulo:</span>
                      <span>{plan.accumulation}</span>
                    </div>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  <strong>Observações:</strong> {plan.obs}
                </div>
                
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full py-3 mt-6 ${
                    plan.name === "Pro"
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : plan.name === "VIP"
                      ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                      : plan.name === "Essential"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {plan.name === "Free" ? (
                    <>
                      <Gift className="w-4 h-4 mr-2" />
                      Começar Grátis
                    </>
                  ) : plan.name === "VIP" ? (
                    <>
                      <Crown className="w-4 h-4 mr-2" />
                      Tornar-se VIP
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Assinar {plan.name}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Guarantee Section */}
        <div className="text-center mt-16">
          <div className="bg-muted/50 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Garantia de 30 dias ou seu dinheiro de volta
            </h3>
            <p className="text-muted-foreground">
              Testamos nossa metodologia com milhares de empreendedores. 
              Se em 30 dias você não ver resultados concretos, devolvemos 100% do seu investimento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
