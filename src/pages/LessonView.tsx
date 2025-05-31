
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Clock, 
  BookOpen, 
  MessageCircle,
  Star,
  ChevronRight,
  ChevronLeft,
  Send,
  ThumbsUp
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  video_url: string;
  duration: string | null;
  order_number: number;
}

interface Course {
  id: string;
  title: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
  };
}

interface Rating {
  id: string;
  rating: number;
  user_id: string;
}

const LessonView = () => {
  const { courseId, lessonId } = useParams();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { subscription } = useSubscription();
  const queryClient = useQueryClient();

  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);

  // Verificar acesso
  const hasAccess = profile?.role === 'admin' || 
                   profile?.role === 'teste' || 
                   subscription.subscribed;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAccess) {
    return <Navigate to="/pricing" replace />;
  }

  // Buscar dados da aula
  const { data: lesson, isLoading: lessonLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (error) throw error;
      return data as Lesson;
    }
  });

  // Buscar dados do curso
  const { data: course } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title')
        .eq('id', courseId)
        .single();

      if (error) throw error;
      return data as Course;
    }
  });

  // Buscar todas as aulas do curso
  const { data: allLessons } = useQuery({
    queryKey: ['course-lessons', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('id, title, order_number, duration')
        .eq('course_id', courseId)
        .order('order_number');

      if (error) throw error;
      return data;
    }
  });

  // Buscar comentários
  const { data: comments } = useQuery({
    queryKey: ['lesson-comments', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lesson_comments')
        .select(`
          id,
          content,
          created_at,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('lesson_id', lessonId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Comment[];
    }
  });

  // Buscar avaliações
  const { data: ratings } = useQuery({
    queryKey: ['lesson-ratings', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lesson_ratings')
        .select('*')
        .eq('lesson_id', lessonId);

      if (error) throw error;
      return data as Rating[];
    }
  });

  // Buscar avaliação do usuário atual
  const { data: currentUserRating } = useQuery({
    queryKey: ['user-rating', lessonId, user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lesson_ratings')
        .select('*')
        .eq('lesson_id', lessonId)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  });

  // Atualizar estado da avaliação quando carregar
  useEffect(() => {
    if (currentUserRating) {
      setUserRating(currentUserRating.rating);
    }
  }, [currentUserRating]);

  // Mutation para adicionar comentário
  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase
        .from('lesson_comments')
        .insert({
          lesson_id: lessonId,
          user_id: user.id,
          content
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-comments', lessonId] });
      setNewComment('');
      toast.success('Comentário adicionado!');
    },
    onError: () => {
      toast.error('Erro ao adicionar comentário');
    }
  });

  // Mutation para avaliar aula
  const rateLessonMutation = useMutation({
    mutationFn: async (rating: number) => {
      const { error } = await supabase
        .from('lesson_ratings')
        .upsert({
          lesson_id: lessonId,
          user_id: user.id,
          rating
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-ratings', lessonId] });
      queryClient.invalidateQueries({ queryKey: ['user-rating', lessonId, user.id] });
      toast.success('Avaliação salva!');
    },
    onError: () => {
      toast.error('Erro ao salvar avaliação');
    }
  });

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    addCommentMutation.mutate(newComment);
  };

  const handleRating = (rating: number) => {
    setUserRating(rating);
    rateLessonMutation.mutate(rating);
  };

  const averageRating = ratings && ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0;

  if (lessonLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando aula...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return <Navigate to="/content-feed" replace />;
  }

  const currentLessonIndex = allLessons?.findIndex(l => l.id === lessonId) ?? -1;
  const prevLesson = currentLessonIndex > 0 ? allLessons?.[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < (allLessons?.length ?? 0) - 1 ? allLessons?.[currentLessonIndex + 1] : null;

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
                  {course?.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {allLessons?.map((l, index) => (
                    <div
                      key={l.id}
                      className={`flex items-center p-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                        l.id === lessonId ? 'bg-purple-50 border-l-4 border-l-purple-600' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => window.location.href = `/courses/${courseId}/lessons/${l.id}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                        l.id === lessonId ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'
                      }`}>
                        <span className="text-sm font-medium">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          l.id === lessonId ? 'text-purple-900' : 'text-gray-900'
                        }`}>
                          {l.title}
                        </p>
                        {l.duration && (
                          <p className="text-xs text-gray-500 flex items-center mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            {l.duration}
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
            {/* Header da aula */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary">
                    Aula {lesson.order_number}
                  </Badge>
                  {lesson.duration && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {lesson.duration}
                    </div>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {lesson.title}
                </h1>
                {lesson.description && (
                  <p className="text-gray-600">
                    {lesson.description}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Player de vídeo */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-900 rounded-t-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Player de Vídeo</p>
                    <p className="text-gray-300 mt-2">URL: {lesson.video_url}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navegação entre aulas */}
            <div className="flex justify-between">
              {prevLesson ? (
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = `/courses/${courseId}/lessons/${prevLesson.id}`}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Aula Anterior
                </Button>
              ) : <div />}
              
              {nextLesson && (
                <Button 
                  onClick={() => window.location.href = `/courses/${courseId}/lessons/${nextLesson.id}`}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Próxima Aula
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>

            {/* Avaliação */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Avaliação da Aula
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 cursor-pointer ${
                          star <= userRating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                        onClick={() => handleRating(star)}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    Sua avaliação: {userRating}/5
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Média: {averageRating.toFixed(1)}/5</span>
                  <span>•</span>
                  <span>{ratings?.length || 0} avaliações</span>
                </div>
              </CardContent>
            </Card>

            {/* Comentários */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Comentários ({comments?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Adicionar comentário */}
                <div>
                  <Textarea
                    placeholder="Adicione seu comentário sobre esta aula..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                  />
                  <Button 
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || addCommentMutation.isPending}
                    className="mt-3 bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {addCommentMutation.isPending ? 'Enviando...' : 'Comentar'}
                  </Button>
                </div>

                <Separator />

                {/* Lista de comentários */}
                <div className="space-y-4">
                  {comments?.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {comment.profiles.avatar_url ? (
                          <img 
                            src={comment.profiles.avatar_url} 
                            alt="Avatar"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-purple-600 font-medium">
                            {comment.profiles.full_name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {comment.profiles.full_name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {format(new Date(comment.created_at), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  
                  {!comments?.length && (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum comentário ainda</p>
                      <p className="text-sm">Seja o primeiro a comentar sobre esta aula!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonView;
