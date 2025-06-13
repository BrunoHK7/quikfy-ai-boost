
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CourseAccessBadge } from '@/components/CourseAccessBadge';
import { useCourseAccess } from '@/hooks/useCourseAccess';
import { useProfile } from '@/hooks/useProfile';
import { useSubscription } from '@/hooks/useSubscription';
import { 
  BookOpen, 
  Clock, 
  DollarSign,
  Lock,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

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

const CourseCard = ({ course }: { course: Course }) => {
  const navigate = useNavigate();
  const { hasAccess, requiredPlan } = useCourseAccess(course.access_level);
  
  const handleCourseClick = () => {
    if (hasAccess) {
      navigate(`/course/${course.id}`);
    }
  };

  const handleUpgrade = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/pricing');
  };

  const getPlanLabel = (plan: string) => {
    const labels = {
      plus: 'Plus',
      pro: 'Pro', 
      vip: 'VIP'
    };
    return labels[plan as keyof typeof labels] || plan;
  };

  return (
    <Card className={`cursor-pointer transition-all hover:shadow-lg ${!hasAccess ? 'opacity-75' : ''}`}>
      <div onClick={handleCourseClick} className="relative">
        <div className="aspect-video relative overflow-hidden rounded-t-lg bg-gray-100">
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
          {!hasAccess && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
          )}
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {course.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <CourseAccessBadge accessLevel={course.access_level} />
            {course.category && (
              <Badge variant="secondary" className="text-xs">
                {course.category}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {course.level}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            {course.estimated_duration && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{course.estimated_duration}</span>
              </div>
            )}
            {course.price > 0 && (
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                <span>R$ {course.price.toFixed(2)}</span>
              </div>
            )}
          </div>

          {!hasAccess && requiredPlan ? (
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Lock className="w-4 h-4 mr-2" />
              Fazer upgrade para {getPlanLabel(requiredPlan)}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleCourseClick} className="w-full" variant="outline">
              <BookOpen className="w-4 h-4 mr-2" />
              {hasAccess ? 'Acessar Curso' : 'Ver Curso'}
            </Button>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

export const CoursesSection = () => {
  const { profile } = useProfile();
  const { subscription } = useSubscription();
  
  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses-home'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Course[];
    }
  });

  // Lógica para selecionar os cursos a serem exibidos
  const getCoursesToDisplay = (allCourses: Course[]) => {
    if (!allCourses || allCourses.length === 0) return [];

    // Determinar o plano atual do usuário
    let userPlan = 'free';
    if (profile?.role === 'admin') {
      userPlan = 'vip'; // Admin tem acesso total
    } else if (profile?.role === 'teste') {
      userPlan = 'pro'; // Usuário teste tem acesso Pro
    } else if (subscription.subscribed) {
      userPlan = subscription.subscription_tier?.toLowerCase() || 'free';
    }

    // Hierarquia de planos
    const planHierarchy = {
      free: 0,
      plus: 1,
      pro: 2,
      vip: 3
    };

    const userPlanLevel = planHierarchy[userPlan as keyof typeof planHierarchy] || 0;

    // Separar cursos por acessibilidade
    const accessibleCourses = allCourses.filter(course => {
      const coursePlanLevel = planHierarchy[course.access_level as keyof typeof planHierarchy] || 0;
      return userPlanLevel >= coursePlanLevel;
    });

    const upgradeRequiredCourses = allCourses.filter(course => {
      const coursePlanLevel = planHierarchy[course.access_level as keyof typeof planHierarchy] || 0;
      return userPlanLevel < coursePlanLevel;
    });

    // Lógica condicional: incluir pelo menos 1 curso que requer upgrade (se existir)
    let selectedCourses: Course[] = [];

    if (upgradeRequiredCourses.length > 0 && userPlan !== 'vip') {
      // Adicionar 1 curso que requer upgrade
      selectedCourses.push(upgradeRequiredCourses[0]);
      
      // Completar com cursos acessíveis (máximo 3)
      const remainingSlots = 3;
      selectedCourses.push(...accessibleCourses.slice(0, remainingSlots));
    } else {
      // Se não há cursos que requerem upgrade ou usuário já é VIP, mostrar 4 cursos acessíveis
      selectedCourses = accessibleCourses.slice(0, 4);
    }

    return selectedCourses.slice(0, 4);
  };

  const coursesToDisplay = courses ? getCoursesToDisplay(courses) : [];

  if (isLoading) {
    return (
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Carregando cursos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!coursesToDisplay || coursesToDisplay.length === 0) {
    return null; // Não exibe a seção se não há cursos
  }

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="w-12 h-12 text-purple-600 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Cursos Exclusivos
            </h2>
          </div>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Aprenda com especialistas e domine as habilidades essenciais para o seu sucesso.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {coursesToDisplay.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="text-center">
          <Link to="/courses">
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Ver Mais Cursos
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
