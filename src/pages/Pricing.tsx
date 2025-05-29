
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
  Briefcase,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

const Pricing = () => {
  const { user } = useAuth();
  const { createCheckout, subscription } = useSubscription();
  const { profile } = useProfile();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planName: string) => {
    if (!user) {
      toast.error("Você precisa fazer login para assinar um plano");
      return;
    }

    if (planName === "Free") {
      toast.info("Você já está no plano gratuito!");
      return;
    }

    setLoadingPlan(planName);
    try {
      await createCheckout(planName);
      toast.success("Redirecionando para o checkout...");
    } catch (error) {
      toast.error("Erro ao criar checkout. Tente novamente.");
      console.error("Checkout error:", error);
    } finally {
      setLoadingPlan(null);
    }
  };

  const plans = [
    {
      name: "Free",
      icon: <Gift className="w-6 h-6" />,
      price: 0,
      emoji: "🎁",
      description: "Ideal para testar a plataforma",
      badge: null,
      color: "green",
      features: [
        "Acesso básico às ferramentas",
        "Suporte por email",
        "Projetos ilimitados",
        "Todas as funcionalidades básicas"
      ],
      obs: "Perfeito para começar e explorar as ferramentas"
    },
    {
      name: "Plus",
      icon: <Briefcase className="w-6 h-6" />,
      price: 15,
      emoji: "💼",
      description: "Para uso profissional básico",
      badge: null,
      color: "blue",
      features: [
        "Todas as ferramentas disponíveis",
        "Suporte prioritário",
        "Projetos ilimitados",
        "Recursos avançados",
        "Sem limitações"
      ],
      obs: "Ideal para profissionais que precisam de acesso completo"
    },
    {
      name: "Pro",
      icon: <Rocket className="w-6 h-6" />,
      price: 99,
      emoji: "🚀",
      description: "Para uso intensivo profissional",
      badge: "MAIS POPULAR",
      color: "purple",
      features: [
        "Todas as ferramentas premium",
        "Suporte prioritário 24/7",
        "Projetos ilimitados",
        "Recursos exclusivos",
        "Acesso antecipado a novidades",
        "Relatórios avançados"
      ],
      obs: "Perfeito para equipes e uso intensivo da plataforma"
    },
    {
      name: "VIP",
      icon: <Crown className="w-6 h-6" />,
      price: 399,
      emoji: "👑",
      description: "Para empresas e uso empresarial",
      badge: "ELITE",
      color: "gold",
      features: [
        "Acesso completo ilimitado",
        "Suporte dedicado 24/7",
        "Projetos ilimitados",
        "Recursos exclusivos VIP",
        "Consultoria personalizada",
        "Acesso beta a novos recursos",
        "Integração personalizada"
      ],
      obs: "Solução completa para empresas e uso empresarial"
    }
  ];

  const getCurrentPlan = () => {
    if (!profile) return 'Free';
    
    if (profile.role === 'admin') return 'Admin';
    if (profile.role === 'teste') return 'Pro (Teste)';
    
    if (subscription.subscribed && subscription.subscription_tier) {
      return subscription.subscription_tier;
    }
    
    return 'Free';
  };

  const isCurrentPlan = (planName: string) => {
    const currentPlan = getCurrentPlan();
    
    if (planName === "Free") {
      return currentPlan === 'Free';
    }
    
    return currentPlan === planName || 
           (currentPlan === 'Pro (Teste)' && planName === 'Pro') ||
           (currentPlan === 'Admin');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-foreground">QUIKFY</span>
          </Link>
          {user ? (
            <Link to="/profile">
              <Button variant="outline">Ir para Perfil</Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="outline">Fazer Login</Button>
            </Link>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700">
            <Rocket className="w-4 h-4 mr-2" />
            Transforme seu negócio hoje
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Escolha o plano ideal para 
            <span className="text-purple-600"> seu sucesso</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Todos os planos incluem acesso completo às ferramentas. 
            Escolha o que melhor se adapta ao seu perfil de uso.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${
              plan.name === "Pro" 
                ? "ring-2 ring-purple-600 shadow-2xl scale-105" 
                : "hover:shadow-xl"
            } transition-all duration-300 ${
              isCurrentPlan(plan.name) ? "ring-2 ring-green-500" : ""
            } dark:bg-[#1a1a1a] dark:border-gray-700`}>
              {plan.badge && (
                <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-sm font-bold text-white ${
                  plan.badge === "MAIS POPULAR" ? "bg-purple-600" : "bg-yellow-600"
                }`}>
                  {plan.badge}
                </div>
              )}

              {isCurrentPlan(plan.name) && (
                <div className="absolute -top-4 right-4 px-3 py-1 bg-green-500 text-white text-sm rounded-full font-medium">
                  Plano Atual
                </div>
              )}
              
              <CardHeader className="text-center pb-6">
                <div className="text-4xl mb-4">{plan.emoji}</div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Plano {plan.name}
                </CardTitle>
                
                <div className="mt-6">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-4xl font-bold text-foreground">
                      {plan.price === 0 ? "Grátis" : `R$ ${plan.price}`}
                    </span>
                  </div>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground text-lg">por mês</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="text-sm text-muted-foreground leading-relaxed text-center">
                  <strong className="text-foreground">Descrição:</strong> {plan.description}
                </div>
                
                <ul className="space-y-3 text-sm">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Observações:</strong> {plan.obs}
                </div>
                
                <Button 
                  className={`w-full py-3 mt-6 font-semibold ${
                    plan.name === "Pro"
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : plan.name === "VIP"
                      ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                      : plan.name === "Plus"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                  onClick={() => handleSubscribe(plan.name)}
                  disabled={loadingPlan === plan.name || isCurrentPlan(plan.name)}
                >
                  {loadingPlan === plan.name ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : isCurrentPlan(plan.name) ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Plano Atual
                    </>
                  ) : plan.name === "Free" ? (
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
          <div className="bg-muted/50 dark:bg-[#1a1a1a] rounded-2xl p-8 max-w-3xl mx-auto border dark:border-gray-700">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Garantia de 30 dias ou seu dinheiro de volta
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Todos os planos oferecem acesso completo às ferramentas. 
              Se em 30 dias você não estiver satisfeito, devolvemos 100% do seu investimento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
