
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StandardHeader } from '@/components/StandardHeader';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Save,
  Eye
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  order: number;
}

const CreateCourse = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  console.log('📚 CreateCourse - Component loaded:', {
    user: user ? { id: user.id, email: user.email } : null,
    profile: profile ? { role: profile.role } : null
  });

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    category: '',
    level: 'iniciante',
    price: '',
    estimatedDuration: ''
  });

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Partial<Lesson>>({
    title: '',
    description: '',
    videoUrl: '',
    duration: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleCourseChange = (field: string, value: string) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
  };

  const handleLessonChange = (field: string, value: string) => {
    setCurrentLesson(prev => ({ ...prev, [field]: value }));
  };

  const addLesson = () => {
    if (!currentLesson.title || !currentLesson.videoUrl) {
      toast.error('Título e URL do vídeo são obrigatórios');
      return;
    }

    const newLesson: Lesson = {
      id: Math.random().toString(36).substr(2, 9),
      title: currentLesson.title || '',
      description: currentLesson.description || '',
      videoUrl: currentLesson.videoUrl || '',
      duration: currentLesson.duration || '',
      order: lessons.length + 1
    };

    setLessons(prev => [...prev, newLesson]);
    setCurrentLesson({
      title: '',
      description: '',
      videoUrl: '',
      duration: ''
    });
    
    toast.success('Aula adicionada com sucesso!');
  };

  const removeLesson = (id: string) => {
    setLessons(prev => prev.filter(lesson => lesson.id !== id));
    toast.success('Aula removida');
  };

  const saveCourse = async () => {
    if (!courseData.title || !courseData.description || lessons.length === 0) {
      toast.error('Preencha todos os campos obrigatórios e adicione pelo menos uma aula');
      return;
    }

    setIsLoading(true);
    
    try {
      // Criar o curso
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert({
          title: courseData.title,
          description: courseData.description,
          thumbnail: courseData.thumbnail || null,
          category: courseData.category || null,
          level: courseData.level,
          price: courseData.price ? parseFloat(courseData.price) : 0,
          estimated_duration: courseData.estimatedDuration || null,
          created_by: user.id
        })
        .select()
        .single();

      if (courseError) throw courseError;

      // Criar as aulas
      const lessonsToInsert = lessons.map(lesson => ({
        course_id: course.id,
        title: lesson.title,
        description: lesson.description || null,
        video_url: lesson.videoUrl,
        duration: lesson.duration || null,
        order_number: lesson.order
      }));

      const { error: lessonsError } = await supabase
        .from('lessons')
        .insert(lessonsToInsert);

      if (lessonsError) throw lessonsError;
      
      toast.success('Curso criado com sucesso!');
      navigate('/admin');
    } catch (error) {
      console.error('Erro ao criar curso:', error);
      toast.error('Erro ao criar curso');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <StandardHeader 
          title="Criar Novo Curso" 
          backTo="/admin"
          rightContent={
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              Admin
            </Badge>
          }
        />

        <div className="space-y-8">
          {/* Informações do Curso */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Informações do Curso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título do Curso *</Label>
                  <Input
                    id="title"
                    value={courseData.title}
                    onChange={(e) => handleCourseChange('title', e.target.value)}
                    placeholder="Ex: Marketing Digital Avançado"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={courseData.category}
                    onChange={(e) => handleCourseChange('category', e.target.value)}
                    placeholder="Ex: Marketing, Design, IA"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={courseData.description}
                  onChange={(e) => handleCourseChange('description', e.target.value)}
                  placeholder="Descrição detalhada do curso..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="level">Nível</Label>
                  <select
                    id="level"
                    value={courseData.level}
                    onChange={(e) => handleCourseChange('level', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="iniciante">Iniciante</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={courseData.price}
                    onChange={(e) => handleCourseChange('price', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duração Estimada</Label>
                  <Input
                    id="duration"
                    value={courseData.estimatedDuration}
                    onChange={(e) => handleCourseChange('estimatedDuration', e.target.value)}
                    placeholder="Ex: 8 horas"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="thumbnail">URL da Thumbnail</Label>
                <Input
                  id="thumbnail"
                  value={courseData.thumbnail}
                  onChange={(e) => handleCourseChange('thumbnail', e.target.value)}
                  placeholder="https://exemplo.com/thumbnail.jpg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Adicionar Aulas */}
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Aula</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lessonTitle">Título da Aula *</Label>
                  <Input
                    id="lessonTitle"
                    value={currentLesson.title}
                    onChange={(e) => handleLessonChange('title', e.target.value)}
                    placeholder="Ex: Introdução ao Marketing Digital"
                  />
                </div>
                <div>
                  <Label htmlFor="lessonDuration">Duração</Label>
                  <Input
                    id="lessonDuration"
                    value={currentLesson.duration}
                    onChange={(e) => handleLessonChange('duration', e.target.value)}
                    placeholder="Ex: 15 min"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="lessonDescription">Descrição da Aula</Label>
                <Textarea
                  id="lessonDescription"
                  value={currentLesson.description}
                  onChange={(e) => handleLessonChange('description', e.target.value)}
                  placeholder="Descrição do que será abordado na aula..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="videoUrl">URL do Vídeo *</Label>
                <Input
                  id="videoUrl"
                  value={currentLesson.videoUrl}
                  onChange={(e) => handleLessonChange('videoUrl', e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <Button onClick={addLesson} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Aula
              </Button>
            </CardContent>
          </Card>

          {/* Lista de Aulas */}
          {lessons.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Aulas do Curso ({lessons.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">Aula {index + 1}</Badge>
                          <h4 className="font-medium">{lesson.title}</h4>
                          {lesson.duration && (
                            <span className="text-sm text-muted-foreground">({lesson.duration})</span>
                          )}
                        </div>
                        {lesson.description && (
                          <p className="text-sm text-muted-foreground mt-1">{lesson.description}</p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeLesson(lesson.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={saveCourse} 
              disabled={isLoading} 
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? (
                <>Salvando...</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Curso
                </>
              )}
            </Button>
            <Button variant="outline" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              Visualizar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
