
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
  Diamond
} from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Inicial",
      icon: <Zap className="w-6 h-6" />,
      price: isAnnual ? 144 : 15,
      originalPrice: isAnnual ? 180 : null,
      description: "Para começar a transformar seu negócio",
      badge: null,
      color: "blue",
      features: [
        "3 Ferramentas de IA básicas",
        "2 Cursos de introdução",
        "Acesso à comunidade",
        "Chat comunitário",
        "Suporte básico",
        "Dashboard pessoal"
      ]
    },
    {
      name: "Premium",
      icon: <Star className="w-6 h-6" />,
      price: isAnnual ? 288 : 30,
      originalPrice: isAnnual ? 360 : null,
      description: "Para escalar e multiplicar resultados",
      badge: "MAIS POPULAR",
      color: "purple",
      features: [
        "Todas as ferramentas de IA",
        "Todos os cursos e mentorias",
        "Prioridade no suporte",
        "Análise de concorrentes",
        "Automações avançadas",
        "Comunidade VIP",
        "Relatórios detalhados",
        "Templates exclusivos"
      ]
    },
    {
      name: "VIP",
      icon: <Crown className="w-6 h-6" />,
      price: isAnnual ? 576 : 60,
      originalPrice: isAnnual ? 720 : null,
      description: "Para dominar o mercado completamente",
      badge: "ELITE",
      color: "gold",
      features: [
        "Tudo do Premium +",
        "Consultoria 1:1 mensal",
        "Acesso antecipado a novas IAs",
        "Grupo exclusivo de milionários",
        "Suporte prioritário 24/7",
        "Custom GPTs personalizados",
        "Análises personalizadas",
        "Certificação oficial QUIKFY"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">QUIKFY</span>
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
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Escolha o plano que vai te fazer 
            <span className="text-purple-600"> milionário</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Cada plano foi desenhado para acelerar seus resultados. 
            Junte-se a mais de 50.000 empreendedores que já faturam milhões com nossas IAs.
          </p>

          {/* Toggle Annual/Monthly */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-lg ${!isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Mensal
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg ${isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Anual
            </span>
            {isAnnual && (
              <Badge className="bg-green-100 text-green-700 border-green-200">
                Economize 20%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${
              plan.name === "Premium" 
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
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  plan.color === "blue" ? "bg-blue-100 text-blue-600" :
                  plan.color === "purple" ? "bg-purple-100 text-purple-600" :
                  "bg-yellow-100 text-yellow-600"
                }`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </CardTitle>
                <p className="text-gray-600">{plan.description}</p>
                
                <div className="mt-6">
                  <div className="flex items-center justify-center space-x-2">
                    {plan.originalPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        R$ {plan.originalPrice}
                      </span>
                    )}
                    <span className="text-4xl font-bold text-gray-900">
                      R$ {plan.price}
                    </span>
                  </div>
                  <span className="text-gray-600">
                    /{isAnnual ? "ano" : "mês"}
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full py-3 ${
                    plan.name === "Premium"
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : plan.name === "VIP"
                      ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {plan.name === "VIP" ? (
                    <>
                      <Diamond className="w-4 h-4 mr-2" />
                      Tornar-se VIP
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Começar Agora
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Guarantee Section */}
        <div className="text-center mt-16">
          <div className="bg-gray-50 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Garantia de 30 dias ou seu dinheiro de volta
            </h3>
            <p className="text-gray-600">
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
