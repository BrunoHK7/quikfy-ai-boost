import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Calendar, 
  Clock, 
  Play, 
  Users, 
  Podcast as PodcastIcon,
  Radio,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";

const Podcasts = () => {
  const podcasts = [
    {
      title: "Podcast Skynet",
      description: "O futuro da IA nos negócios digitais",
      image: "🤖",
      episodes: 45,
      duration: "45min",
      frequency: "Toda Terça",
      lastEpisode: "IA que Fatura: Como Automatizar Vendas",
      status: "latest"
    },
    {
      title: "PodCast Be a Man",
      description: "Desenvolvimento pessoal e empreendedorismo masculino",
      image: "💪",
      episodes: 32,
      duration: "60min",
      frequency: "Toda Quinta",
      lastEpisode: "Mindset Milionário: Os 7 Pilares do Sucesso",
      status: "popular"
    }
  ];

  const liveStreams = [
    {
      title: "Live do Períclão",
      description: "Lives semanais com estratégias de marketing digital",
      image: "🔥",
      nextLive: "Quinta, 20h",
      viewers: "2.5K",
      topic: "Como Escalar de 0 a 100K com IA",
      status: "scheduled"
    }
  ];

  const recentEpisodes = [
    {
      title: "IA que Fatura: Automação Total de Vendas",
      podcast: "Podcast Skynet",
      duration: "42min",
      date: "Há 2 dias",
      plays: "15.2K"
    },
    {
      title: "Mindset Milionário: Transformação Mental",
      podcast: "PodCast Be a Man", 
      duration: "58min",
      date: "Há 3 dias",
      plays: "23.1K"
    },
    {
      title: "Estratégias Secretas dos Top 1%",
      podcast: "Live do Períclão",
      duration: "1h 15min",
      date: "Há 1 semana",
      plays: "41.7K"
    }
  ];

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
              🎙️ Conteúdo Premium
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Podcasts & <span className="text-purple-600">Lives</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Conteúdo exclusivo dos maiores especialistas em marketing digital e IA
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Podcasts */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Nossos Podcasts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {podcasts.map((podcast, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">{podcast.image}</div>
                        <Badge variant={podcast.status === "latest" ? "default" : "secondary"}>
                          {podcast.status === "latest" ? "Novo" : "Popular"}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{podcast.title}</CardTitle>
                      <p className="text-muted-foreground">{podcast.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div className="text-center">
                            <div className="font-medium text-foreground">{podcast.episodes}</div>
                            <div>Episódios</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-foreground">{podcast.duration}</div>
                            <div>Duração</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-foreground">{podcast.frequency}</div>
                            <div>Frequência</div>
                          </div>
                        </div>
                        <div className="border-t pt-4">
                          <p className="text-sm text-muted-foreground mb-3">Último episódio:</p>
                          <p className="font-medium mb-4">{podcast.lastEpisode}</p>
                          <Button className="w-full bg-purple-600 hover:bg-purple-700">
                            <Play className="w-4 h-4 mr-2" />
                            Ouvir Agora
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Lives */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Lives Semanais</h2>
              {liveStreams.map((live, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-4xl">{live.image}</div>
                      <Badge className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300">
                        <Radio className="w-3 h-3 mr-1" />
                        Ao Vivo
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{live.title}</CardTitle>
                    <p className="text-muted-foreground">{live.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium">{live.nextLive}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium">{live.viewers} inscritos</span>
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <p className="text-sm text-muted-foreground mb-2">Próximo tópico:</p>
                        <p className="font-medium mb-4">{live.topic}</p>
                        <Button className="w-full bg-red-600 hover:bg-red-700">
                          <PodcastIcon className="w-4 h-4 mr-2" />
                          Participar da Live
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar - Recent Episodes */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-purple-600" />
                  Episódios Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentEpisodes.map((episode, index) => (
                    <div key={index} className="border-b border-border pb-4 last:border-b-0">
                      <h4 className="font-medium mb-2">{episode.title}</h4>
                      <p className="text-sm text-purple-600 mb-2">{episode.podcast}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{episode.duration}</span>
                        <span>{episode.date}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{episode.plays} reproduções</span>
                        <Button size="sm" variant="ghost" className="text-purple-600 hover:text-purple-700">
                          <Play className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Podcasts;
