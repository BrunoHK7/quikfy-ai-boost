
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StandardHeader } from '@/components/StandardHeader';
import { CourseAccessBadge } from '@/components/CourseAccessBadge';
import { AdminAccessWrapper } from '@/components/AdminAccessWrapper';
import { useCourseAccess } from '@/hooks/useCourseAccess';
import { useSubscription } from '@/hooks/useSubscription';
import { 
  BookOpen, 
  Clock, 
  DollarSign, 
  Search, 
  Filter,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const { createCheckout } = useSubscription();
  
  const handleCourseClick = () => {
    if (hasAccess) {
      navigate(`/course/${course.id}`);
    }
  };

  const handleUpgrade = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await createCheckout(requiredPlan || 'plus');
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
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

  return (
    <Card className={`cursor-pointer transition-all hover:shadow-lg ${!hasAccess ? 'opacity-75' : ''}`}>
      <div onClick={handleCourseClick} className="relative">
        {course.cover_image && (
          <div className="aspect-video relative overflow-hidden rounded-t-lg">
            <img
              src={course.cover_image}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            {!hasAccess && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
        )}
        
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

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Course[];
    }
  });

  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = !selectedLevel || course.level === selectedLevel;
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const categories = [...new Set(courses?.map(course => course.category).filter(Boolean))];
  const levels = [...new Set(courses?.map(course => course.level))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Carregando cursos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <StandardHeader 
          title="Cursos" 
          rightContent={
            <AdminAccessWrapper>
              <Button onClick={() => window.location.href = '/admin'} variant="outline">
                Área Admin
              </Button>
            </AdminAccessWrapper>
          }
        />

        {/* Filtros */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Pesquisar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="">Todos os níveis</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="">Todas as categorias</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid de cursos */}
        {filteredCourses && filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum curso encontrado</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedLevel || selectedCategory
                ? 'Tente ajustar os filtros de busca'
                : 'Ainda não há cursos disponíveis'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
