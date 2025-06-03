
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StandardHeader } from '@/components/StandardHeader';
import { 
  Users, 
  Instagram, 
  DollarSign, 
  TrendingUp, 
  Plus,
  Video,
  Image,
  BookOpen,
  BarChart3,
  Eye,
  Calendar,
  LogOut,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  carouselsGenerated: number;
  estimatedRevenue: number;
  usersByRole: Record<string, number>;
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string | null;
  level: string;
  price: number;
  estimated_duration: string | null;
  thumbnail: string | null;
  created_at: string;
  created_by: string | null;
  lessons?: { count: number }[];
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { logout: adminLogout } = useAdminAuth();
  const navigate = useNavigate();

  console.log('🏠 AdminDashboard - Component loaded:', {
    user: user ? { id: user.id, email: user.email } : null
  });

  const handleAdminLogout = () => {
    adminLogout();
    toast.success('Logout da área administrativa realizado');
    navigate('/');
  };

  // Buscar cursos disponíveis
  const { data: courses, isLoading: coursesLoading, refetch: refetchCourses } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: async (): Promise<Course[]> => {
      console.log('📚 Buscando cursos...');
      
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
          *,
          lessons(count)
        `)
        .order('created_at', { ascending: false });

      if (coursesError) {
        console.error('❌ Erro ao buscar cursos:', coursesError);
        throw coursesError;
      }

      console.log('✅ Cursos encontrados:', coursesData);
      return coursesData || [];
    }
  });

  // Buscar estatísticas do dashboard
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      // Buscar total de usuários
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('role, created_at');

      if (profilesError) throw profilesError;

      // Buscar carrosséis gerados
      const { data: carousels, error: carouselsError } = await supabase
        .from('carousel_projects')
        .select('created_at');

      if (carouselsError) throw carouselsError;

      // Buscar assinantes
      const { data: subscribers, error: subscribersError } = await supabase
        .from('subscribers')
        .select('subscription_tier, subscribed');

      if (subscribersError) throw subscribersError;

      const totalUsers = profiles?.length || 0;
      const activeUsers = profiles?.filter(p => {
        const createdAt = new Date(p.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return createdAt > thirtyDaysAgo;
      }).length || 0;

      const usersByRole = profiles?.reduce((acc, profile) => {
        acc[profile.role] = (acc[profile.role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Calcular receita estimada baseada nos planos
      const planPrices = {
        plus: 29.99,
        pro: 79.99,
        vip: 199.99
      };

      const estimatedRevenue = subscribers?.filter(s => s.subscribed).reduce((total, sub) => {
        const price = planPrices[sub.subscription_tier as keyof typeof planPrices] || 0;
        return total + price;
      }, 0) || 0;

      return {
        totalUsers,
        activeUsers,
        carouselsGenerated: carousels?.length || 0,
        estimatedRevenue,
        usersByRole
      };
    }
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const deleteCourse = async (courseId: string) => {
    if (!confirm('Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      console.log('🗑️ Deletando curso:', courseId);

      // Primeiro deletar as aulas
      const { error: lessonsError } = await supabase
        .from('lessons')
        .delete()
        .eq('course_id', courseId);

      if (lessonsError) {
        console.error('❌ Erro ao deletar aulas:', lessonsError);
        throw lessonsError;
      }

      // Depois deletar o curso
      const { error: courseError } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (courseError) {
        console.error('❌ Erro ao deletar curso:', courseError);
        throw courseError;
      }

      console.log('✅ Curso deletado com sucesso');
      toast.success('Curso excluído com sucesso!');
      refetchCourses();
    } catch (error: any) {
      console.error('❌ Erro ao deletar curso:', error);
      toast.error(`Erro ao excluir curso: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <StandardHeader 
          title="Painel de Administração" 
          showBackButton={true}
          rightContent={
            <div className="flex items-center space-x-2">
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                Admin
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAdminLogout}
                className="text-red-600 hover:text-red-700"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Sair
              </Button>
            </div>
          }
        />

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? '...' : stats?.totalUsers.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isLoading ? '...' : `${stats?.activeUsers} ativos nos últimos 30 dias`}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Carrosséis Gerados</CardTitle>
                  <Instagram className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? '...' : stats?.carouselsGenerated.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total de carrosséis criados
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita Estimada</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? '...' : formatCurrency(stats?.estimatedRevenue || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Receita mensal estimada
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cursos</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {coursesLoading ? '...' : courses?.length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total de cursos criados
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Distribuição por Planos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Planos</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div>Carregando...</div>
                  ) : (
                    <div className="space-y-3">
                      {Object.entries(stats?.usersByRole || {}).map(([role, count]) => (
                        <div key={role} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant={role === 'admin' ? 'default' : 'secondary'}>
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </Badge>
                          </div>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/admin/create-course">
                    <Button className="w-full justify-start">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Novo Curso
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Relatórios Detalhados
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="w-4 h-4 mr-2" />
                    Monitorar Atividade
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="w-5 h-5 mr-2" />
                    Vídeos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Gerencie vídeos e video-aulas da plataforma
                  </p>
                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Vídeo
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Image className="w-5 h-5 mr-2" />
                    Imagens
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload e organização de imagens
                  </p>
                  <Button className="w-full" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Imagem
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Cursos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Crie e gerencie cursos completos
                  </p>
                  <Link to="/admin/create-course">
                    <Button className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Curso
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Cursos Existentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Cursos Disponíveis</span>
                  <Badge variant="outline">{courses?.length || 0} cursos</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {coursesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Carregando cursos...</p>
                  </div>
                ) : courses && courses.length > 0 ? (
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{course.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                {course.category && (
                                  <Badge variant="outline" className="text-xs">
                                    {course.category}
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {course.level}
                                </Badge>
                                {course.price > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    {formatCurrency(course.price)}
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {course.lessons?.[0]?.count || 0} aulas
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  Criado em {formatDate(course.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Visualizar
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => deleteCourse(course.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum curso criado ainda</p>
                    <p className="text-sm">Clique em "Criar Curso" para começar</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
