import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Brain, 
  Heart, 
  MessageCircle, 
  Share2, 
  Play, 
  Clock,
  TrendingUp,
  Crown,
  ArrowLeft,
  Bookmark,
  MoreHorizontal
} from "lucide-react";
import { Link } from "react-router-dom";

const ContentFeed = () => {
  const [filter, setFilter] = useState("all");

  const adminContent = [
    {
      id: 1,
      author: "Carlos Mendes",
      role: "CEO & Founder",
      avatar: "CM",
      verified: true,
      content: "🚀 RESULTADO INSANO! Cliente saiu de R$ 15K para R$ 180K/mês em 90 dias usando apenas nossas IAs. O segredo? Automação total do funil de vendas com carrosséis que convertem a 23%! \n\n👇 Thread completa nos comentários",
      image: "/placeholder.svg",
      likes: 1247,
      comments: 89,
      shares: 156,
      time: "2h",
      type: "post",
      category: "resultado"
    },
    {
      id: 2,
      author: "Marina Silva",
      role: "Head of Marketing",
      avatar: "MS",
      verified: true,
      content: "🎥 AULA EXCLUSIVA: Como criar carrosséis que vendem milhões",
      videoTitle: "Estratégia dos Carrosséis Milionários",
      videoDuration: "18:32",
      likes: 2156,
      comments: 234,
      shares: 445,
      time: "4h",
      type: "video",
      category: "educativo"
    },
    {
      id: 3,
      author: "Bruno Tech",
      role: "CTO",
      avatar: "BT",
      verified: true,
      content: "⚡ NOVA FEATURE LIBERADA! \n\nAcabamos de lançar a IA de análise de concorrentes. Agora você pode descobrir exatamente o que seus competidores estão fazendo e superar eles em 30 dias.\n\n✅ Análise automática de posts\n✅ Identificação de estratégias\n✅ Sugestões de melhoria\n✅ Relatórios completos\n\nDisponível para usuários Premium!",
      likes: 892,
      comments: 156,
      shares: 203,
      time: "6h",
      type: "post",
      category: "novidade"
    },
    {
      id: 4,
      author: "Ana Costa",
      role: "Success Manager",
      avatar: "AC",
      verified: true,
      content: "🎯 MASTERCLASS AO VIVO: Automação Completa de Vendas",
      videoTitle: "Do Zero aos Primeiros 100K com IA",
      videoDuration: "45:21",
      likes: 3421,
      comments: 567,
      shares: 789,
      time: "1d",
      type: "video",
      category: "educativo"
    },
    {
      id: 5,
      author: "Pedro Santos",
      role: "Growth Hacker",
      avatar: "PS",
      verified: true,
      content: "💰 CASE STUDY COMPLETO\n\nComo transformamos um negócio local em império digital:\n\n📊 Antes: R$ 8K/mês\n📈 Depois: R$ 350K/mês\n⏱️ Tempo: 6 meses\n🤖 Ferramentas: 100% QUIKFY\n\nTodas as estratégias detalhadas no post 👇",
      image: "/placeholder.svg",
      likes: 1876,
      comments: 298,
      shares: 412,
      time: "1d",
      type: "post",
      category: "resultado"
    }
  ];

  const categories = [
    { id: "all", label: "Todos", count: adminContent.length },
    { id: "resultado", label: "Resultados", count: adminContent.filter(c => c.category === "resultado").length },
    { id: "educativo", label: "Educativo", count: adminContent.filter(c => c.category === "educativo").length },
    { id: "novidade", label: "Novidades", count: adminContent.filter(c => c.category === "novidade").length }
  ];

  const filteredContent = filter === "all" 
    ? adminContent 
    : adminContent.filter(content => content.category === filter);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold">QUIKFY</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/profile">
              <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950">
                Perfil
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Badge className="mb-6 bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700">
              👑 Conteúdo Exclusivo
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Feed dos <span className="text-purple-600">Especialistas</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Conteúdo premium criado pelos nossos administradores e especialistas
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={filter === category.id ? "default" : "outline"}
                onClick={() => setFilter(category.id)}
                className={filter === category.id 
                  ? "bg-purple-600 hover:bg-purple-700" 
                  : "border-purple-200 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950"
                }
              >
                {category.label}
                <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Content Feed */}
          <div className="space-y-6">
            {filteredContent.map((content) => (
              <Card key={content.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-purple-100 text-purple-600 font-bold dark:bg-purple-900/50 dark:text-purple-300">
                          {content.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold">{content.author}</span>
                          {content.verified && <Crown className="w-4 h-4 text-yellow-500" />}
                        </div>
                        <p className="text-sm text-purple-600">{content.role}</p>
                        <p className="text-xs text-muted-foreground">{content.time}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="whitespace-pre-line">{content.content}</p>
                    
                    {content.type === "video" && (
                      <div className="relative bg-muted rounded-lg p-6 text-center">
                        <Play className="w-16 h-16 mx-auto text-purple-600 mb-4" />
                        <h4 className="font-bold mb-2">{content.videoTitle}</h4>
                        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{content.videoDuration}</span>
                        </div>
                      </div>
                    )}

                    {content.image && content.type === "post" && (
                      <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
                        <span className="text-muted-foreground">Imagem de resultado</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-6">
                        <button className="flex items-center space-x-2 text-muted-foreground hover:text-red-500 transition-colors">
                          <Heart className="w-5 h-5" />
                          <span className="text-sm font-medium">{content.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-muted-foreground hover:text-purple-600 transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">{content.comments}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-muted-foreground hover:text-blue-600 transition-colors">
                          <Share2 className="w-5 h-5" />
                          <span className="text-sm font-medium">{content.shares}</span>
                        </button>
                      </div>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-purple-600">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950">
              <TrendingUp className="w-4 h-4 mr-2" />
              Carregar Mais Conteúdo
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContentFeed;
