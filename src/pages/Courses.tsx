
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Clock, 
  BookOpen, 
  Star,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  category: string | null;
  level: string | null;
  price: number | null;
  estimated_duration: string | null;
  created_at: string;
}

const Courses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const handleCourseClick = (courseId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/courses/${courseId}`);
  };

  const getLevelColor = (level: string | null) => {
    switch (level?.toLowerCase()) {
      case 'iniciante':
        return 'bg-green-100 text-green-800';
      case 'intermediário':
        return 'bg-yellow-100 text-yellow-800';
      case 'avançado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando cursos...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Nossos Cursos
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Aprenda com especialistas e acelere seu crescimento profissional com nossos cursos práticos e atualizados.
            </p>
          </div>

          {/* Courses Grid */}
          {courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
                  <div onClick={() => handleCourseClick(course.id)}>
                    {/* Course Thumbnail */}
                    <div className="aspect-video bg-gradient-to-br from-purple-500 to-purple-700 relative overflow-hidden">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="w-16 h-16 text-white opacity-70" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                    </div>

                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {course.category && (
                            <Badge variant="secondary">{course.category}</Badge>
                          )}
                          {course.level && (
                            <Badge className={getLevelColor(course.level)}>
                              {course.level}
                            </Badge>
                          )}
                        </div>
                        {course.price === 0 || course.price === null ? (
                          <Badge className="bg-green-100 text-green-800">Gratuito</Badge>
                        ) : (
                          <span className="text-lg font-bold text-purple-600">
                            R$ {course.price?.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                        {course.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {course.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-4">
                          {course.estimated_duration && (
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {course.estimated_duration}
                            </div>
                          )}
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            124 alunos
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-400" />
                          4.8
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCourseClick(course.id);
                        }}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Acessar Curso
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhum curso disponível
              </h3>
              <p className="text-gray-500">
                Novos cursos serão adicionados em breve. Fique atento!
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Courses;
