
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StandardHeader } from '@/components/StandardHeader';
import { CourseAccessBadge } from '@/components/CourseAccessBadge';
import { useCourseAccess } from '@/hooks/useCourseAccess';
import { 
  BookOpen, 
  Clock, 
  DollarSign, 
  Users,
  Star,
  Play,
  Lock,
  ArrowRight
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string | null;
  level: string;
  price: number;
  estimated_duration: string | null;
  cover_image: string | null;
  access_level: string;
  created_at: string;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  cover_image: string | null;
  order_number: number;
  lessons?: { count: number }[];
}

const ModuleCard = ({ module, courseId, hasAccess }: { 
  module: Module; 
  courseId: string; 
  hasAccess: boolean; 
}) => {
  const navigate = useNavigate();

  const handleModuleClick = () => {
    if (hasAccess) {
      // Navegar para a primeira aula do módulo ou página do módulo
      navigate(`/course/${courseId}/module/${module.id}`);
    }
  };

  return (
    <Card className={`cursor-pointer transition-all hover:shadow-lg ${!hasAccess ? 'opacity-75' : ''}`}>
      <div onClick={handleModuleClick} className="relative">
        <div className="aspect-video relative overflow-hidden rounded-t-lg bg-gray-100">
          {module.cover_image ? (
            <img
              src={module.cover_image}
              alt={module.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
              <BookOpen className="w-12 h-12 text-purple-400" />
            </div>
          )}
          {!hasAccess && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
          )}
          <div className="absolute top-2 left-2">
            <Badge className="bg-black/50 text-white">
              Módulo {module.order_number}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{module.title}</h3>
          {module.description && (
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
              {module.description}
            </p>
          )}
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Play className="w-4 h-4 mr-1" />
              <span>{module.lessons?.[0]?.count || 0} aulas</span>
            </div>
            {hasAccess && (
              <div className="flex items-center text-purple-600">
                <span className="mr-1">Acessar</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

const CourseOverview = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course-overview', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) throw error;
      return data as Course;
    }
  });

  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: ['course-modules', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select(`
          *,
          lessons(count)
        `)
        .eq('course_id', courseId)
        .order('order_number');

      if (error) throw error;
      return data as Module[];
    }
  });

  const { hasAccess, requiredPlan } = useCourseAccess(course?.access_level || 'free');

  const handleStartCourse = () => {
    if (hasAccess) {
      navigate(`/course/${courseId}`);
    } else {
      navigate('/pricing');
    }
  };

  const getPlanLabel = (plan: string) => {
    const labels = {
      plus: 'Plus',
      pro: 'Pro', 
      vip: 'VIP'
    };
    return labels[plan as keyof typeof labels] || plan;
  };

  if (courseLoading || modulesLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Carregando curso...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold mb-2">Curso não encontrado</h1>
            <p className="text-muted-foreground">O curso que você está procurando não existe.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <StandardHeader title={course.title} showBackButton={true} />

        {/* Header do curso */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Imagem do curso */}
              <div className="lg:col-span-1">
                <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-100">
                  {course.cover_image ? (
                    <img
                      src={course.cover_image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
                      <BookOpen className="w-16 h-16 text-purple-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Informações do curso */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <CourseAccessBadge accessLevel={course.access_level} />
                  {course.category && (
                    <Badge variant="secondary">{course.category}</Badge>
                  )}
                  {course.level && (
                    <Badge variant="outline">{course.level}</Badge>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {course.title}
                </h1>

                <p className="text-gray-600 mb-6">
                  {course.description}
                </p>

                <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {modules?.length || 0} módulos
                  </div>
                  {course.estimated_duration && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.estimated_duration}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-400" />
                    4.8 (124 avaliações)
                  </div>
                  {course.price > 0 && (
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      R$ {course.price.toFixed(2)}
                    </div>
                  )}
                </div>

                {!hasAccess && requiredPlan ? (
                  <Button 
                    onClick={handleStartCourse}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Lock className="w-5 h-5 mr-2" />
                    Fazer upgrade para {getPlanLabel(requiredPlan)}
                  </Button>
                ) : (
                  <Button onClick={handleStartCourse} size="lg">
                    <Play className="w-5 h-5 mr-2" />
                    {hasAccess ? 'Iniciar Curso' : 'Ver Curso'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Módulos do curso */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Módulos do Curso</span>
              <Badge variant="outline">{modules?.length || 0} módulos</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {modules && modules.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module) => (
                  <ModuleCard 
                    key={module.id} 
                    module={module} 
                    courseId={courseId!}
                    hasAccess={hasAccess}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Este curso ainda não possui módulos</p>
                <p className="text-sm">Os módulos serão adicionados em breve</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseOverview;
