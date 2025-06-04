
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Clock, 
  BookOpen, 
  Users,
  Star,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

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

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  duration: string | null;
  order_number: number;
}

const CourseView = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { subscription } = useSubscription();

  // Verificar acesso - admins têm acesso total, outros usuários precisam de assinatura
  const hasAccess = profile?.role === 'admin' || 
                   profile?.role === 'teste' || 
                   subscription.subscribed;

  console.log('🎓 CourseView - Access check:', {
    userRole: profile?.role,
    subscribed: subscription.subscribed,
    hasAccess
  });

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAccess) {
    return <Navigate to="/pricing" replace />;
  }

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
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

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ['lessons', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_number');

      if (error) throw error;
      return data as Lesson[];
    }
  });

  if (courseLoading || lessonsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando curso...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return <Navigate to="/content-feed" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-4 gap-8 p-6">
          {/* Sidebar com lista de aulas */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Conteúdo do Curso
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {lessons?.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-sm font-medium text-purple-600">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {lesson.title}
                        </p>
                        {lesson.duration && (
                          <p className="text-xs text-gray-500 flex items-center mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            {lesson.duration}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo principal */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header do curso */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {course.thumbnail && (
                    <div className="lg:w-1/3">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
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
                    <p className="text-gray-600 mb-4">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {lessons?.length || 0} aulas
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
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Player de vídeo (primeira aula por padrão) */}
            {lessons && lessons.length > 0 && (
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video bg-gray-900 rounded-t-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">{lessons[0].title}</p>
                      <p className="text-gray-300 mt-2">Clique para assistir</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2">{lessons[0].title}</h2>
                    {lessons[0].description && (
                      <p className="text-gray-600">{lessons[0].description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Seção de progresso */}
            <Card>
              <CardHeader>
                <CardTitle>Seu Progresso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">Progresso do curso</span>
                  <span className="text-sm font-medium">0% concluído</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  0 de {lessons?.length || 0} aulas concluídas
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;
