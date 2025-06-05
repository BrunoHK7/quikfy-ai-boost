
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StandardHeader } from '@/components/StandardHeader';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/ImageUpload';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Save,
  Eye,
  LogOut,
  Layers
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Module {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  order: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  coverImage: string;
  order: number;
  moduleId?: string;
}

const CreateCourse = () => {
  const { user } = useAuth();
  const { logout: adminLogout } = useAdminAuth();
  const navigate = useNavigate();

  console.log('📚 CreateCourse - Component loaded:', {
    user: user ? { id: user.id, email: user.email } : null
  });

  const handleAdminLogout = () => {
    adminLogout();
    toast.success('Logout da área administrativa realizado');
    navigate('/');
  };

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    coverImage: '',
    category: '',
    level: 'iniciante',
    price: '',
    estimatedDuration: ''
  });

  const [modules, setModules] = useState<Module[]>([]);
  const [currentModule, setCurrentModule] = useState<Partial<Module>>({
    title: '',
    description: '',
    coverImage: ''
  });

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Partial<Lesson>>({
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
    coverImage: '',
    moduleId: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleCourseChange = (field: string, value: string) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
  };

  const handleModuleChange = (field: string, value: string) => {
    setCurrentModule(prev => ({ ...prev, [field]: value }));
  };

  const handleLessonChange = (field: string, value: string) => {
    setCurrentLesson(prev => ({ ...prev, [field]: value }));
  };

  const addModule = () => {
    if (!currentModule.title) {
      toast.error('Título do módulo é obrigatório');
      return;
    }

    const newModule: Module = {
      id: Math.random().toString(36).substr(2, 9),
      title: currentModule.title || '',
      description: currentModule.description || '',
      coverImage: currentModule.coverImage || '',
      order: modules.length + 1
    };

    setModules(prev => [...prev, newModule]);
    setCurrentModule({
      title: '',
      description: '',
      coverImage: ''
    });
    
    toast.success('Módulo adicionado com sucesso!');
  };

  const removeModule = (id: string) => {
    setModules(prev => prev.filter(module => module.id !== id));
    // Remover aulas associadas ao módulo
    setLessons(prev => prev.filter(lesson => lesson.moduleId !== id));
    toast.success('Módulo removido');
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
      coverImage: currentLesson.coverImage || '',
      order: lessons.length + 1,
      moduleId: currentLesson.moduleId || undefined
    };

    setLessons(prev => [...prev, newLesson]);
    setCurrentLesson({
      title: '',
      description: '',
      videoUrl: '',
      duration: '',
      coverImage: '',
      moduleId: ''
    });
    
    toast.success('Aula adicionada com sucesso!');
  };

  const removeLesson = (id: string) => {
    setLessons(prev => prev.filter(lesson => lesson.id !== id));
    toast.success('Aula removida');
  };

  const saveCourse = async () => {
    if (!courseData.title || !courseData.description) {
      toast.error('Preencha todos os campos obrigatórios do curso');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('💾 Criando curso:', {
        courseData,
        modulesCount: modules.length,
        lessonsCount: lessons.length,
        userId: user?.id
      });

      // Criar o curso
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert({
          title: courseData.title,
          description: courseData.description,
          thumbnail: courseData.thumbnail || null,
          cover_image: courseData.coverImage || null,
          category: courseData.category || null,
          level: courseData.level,
          price: courseData.price ? parseFloat(courseData.price) : 0,
          estimated_duration: courseData.estimatedDuration || null,
          created_by: user?.id
        })
        .select()
        .single();

      if (courseError) {
        console.error('❌ Erro ao criar curso:', courseError);
        throw courseError;
      }

      console.log('✅ Curso criado:', course);

      // Criar os módulos se existirem
      if (modules.length > 0) {
        const modulesToInsert = modules.map(module => ({
          course_id: course.id,
          title: module.title,
          description: module.description || null,
          cover_image: module.coverImage || null,
          order_number: module.order
        }));

        console.log('💾 Inserindo módulos:', modulesToInsert);

        const { data: insertedModules, error: modulesError } = await supabase
          .from('modules')
          .insert(modulesToInsert)
          .select();

        if (modulesError) {
          console.error('❌ Erro ao criar módulos:', modulesError);
          throw modulesError;
        }

        console.log('✅ Módulos criados:', insertedModules);

        // Mapear IDs dos módulos temporários para os reais
        const moduleIdMap: { [key: string]: string } = {};
        modules.forEach((tempModule, index) => {
          if (insertedModules[index]) {
            moduleIdMap[tempModule.id] = insertedModules[index].id;
          }
        });

        // Atualizar moduleId das aulas
        const updatedLessons = lessons.map(lesson => ({
          ...lesson,
          moduleId: lesson.moduleId ? moduleIdMap[lesson.moduleId] : undefined
        }));

        // Criar as aulas
        if (updatedLessons.length > 0) {
          const lessonsToInsert = updatedLessons.map(lesson => ({
            course_id: course.id,
            module_id: lesson.moduleId || null,
            title: lesson.title,
            description: lesson.description || null,
            video_url: lesson.videoUrl,
            duration: lesson.duration || null,
            cover_image: lesson.coverImage || null,
            order_number: lesson.order
          }));

          console.log('💾 Inserindo aulas:', lessonsToInsert);

          const { data: insertedLessons, error: lessonsError } = await supabase
            .from('lessons')
            .insert(lessonsToInsert)
            .select();

          if (lessonsError) {
            console.error('❌ Erro ao criar aulas:', lessonsError);
            throw lessonsError;
          }

          console.log('✅ Aulas criadas:', insertedLessons);
        }
      } else if (lessons.length > 0) {
        // Criar aulas sem módulos
        const lessonsToInsert = lessons.map(lesson => ({
          course_id: course.id,
          title: lesson.title,
          description: lesson.description || null,
          video_url: lesson.videoUrl,
          duration: lesson.duration || null,
          cover_image: lesson.coverImage || null,
          order_number: lesson.order
        }));

        console.log('💾 Inserindo aulas:', lessonsToInsert);

        const { data: insertedLessons, error: lessonsError } = await supabase
          .from('lessons')
          .insert(lessonsToInsert)
          .select();

        if (lessonsError) {
          console.error('❌ Erro ao criar aulas:', lessonsError);
          throw lessonsError;
        }

        console.log('✅ Aulas criadas:', insertedLessons);
      }
      
      toast.success('Curso criado com sucesso!');
      
      // Limpar formulário
      setCourseData({
        title: '',
        description: '',
        thumbnail: '',
        coverImage: '',
        category: '',
        level: 'iniciante',
        price: '',
        estimatedDuration: ''
      });
      setModules([]);
      setLessons([]);
      
    } catch (error: any) {
      console.error('❌ Erro geral ao criar curso:', error);
      toast.error(`Erro ao criar curso: ${error.message || 'Erro desconhecido'}`);
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="thumbnail">URL da Thumbnail</Label>
                  <Input
                    id="thumbnail"
                    value={courseData.thumbnail}
                    onChange={(e) => handleCourseChange('thumbnail', e.target.value)}
                    placeholder="https://exemplo.com/thumbnail.jpg"
                  />
                </div>
                <ImageUpload
                  label="Imagem de Capa do Curso"
                  value={courseData.coverImage}
                  onChange={(url) => handleCourseChange('coverImage', url)}
                  expectedDimensions={{ width: 1080, height: 1350 }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Adicionar Módulos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layers className="w-5 h-5 mr-2" />
                Adicionar Módulo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="moduleTitle">Título do Módulo *</Label>
                  <Input
                    id="moduleTitle"
                    value={currentModule.title}
                    onChange={(e) => handleModuleChange('title', e.target.value)}
                    placeholder="Ex: Fundamentos do Marketing"
                  />
                </div>
                <ImageUpload
                  label="Imagem de Capa do Módulo"
                  value={currentModule.coverImage || ''}
                  onChange={(url) => handleModuleChange('coverImage', url)}
                  expectedDimensions={{ width: 1080, height: 1350 }}
                />
              </div>

              <div>
                <Label htmlFor="moduleDescription">Descrição do Módulo</Label>
                <Textarea
                  id="moduleDescription"
                  value={currentModule.description}
                  onChange={(e) => handleModuleChange('description', e.target.value)}
                  placeholder="Descrição do que será abordado no módulo..."
                  rows={3}
                />
              </div>

              <Button onClick={addModule} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Módulo
              </Button>
            </CardContent>
          </Card>

          {/* Lista de Módulos */}
          {modules.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Módulos do Curso ({modules.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {modules.map((module, index) => (
                    <div key={module.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4 flex-1">
                        {module.coverImage && (
                          <img
                            src={module.coverImage}
                            alt={module.title}
                            className="w-16 h-20 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">Módulo {index + 1}</Badge>
                            <h4 className="font-medium">{module.title}</h4>
                          </div>
                          {module.description && (
                            <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeModule(module.id)}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="moduleSelect">Módulo (opcional)</Label>
                  <select
                    id="moduleSelect"
                    value={currentLesson.moduleId}
                    onChange={(e) => handleLessonChange('moduleId', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Sem módulo</option>
                    {modules.map((module) => (
                      <option key={module.id} value={module.id}>
                        {module.title}
                      </option>
                    ))}
                  </select>
                </div>
                <ImageUpload
                  label="Imagem de Capa da Aula"
                  value={currentLesson.coverImage || ''}
                  onChange={(url) => handleLessonChange('coverImage', url)}
                  expectedDimensions={{ width: 1920, height: 1080 }}
                />
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
                      <div className="flex items-center space-x-4 flex-1">
                        {lesson.coverImage && (
                          <img
                            src={lesson.coverImage}
                            alt={lesson.title}
                            className="w-20 h-11 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">Aula {index + 1}</Badge>
                            <h4 className="font-medium">{lesson.title}</h4>
                            {lesson.duration && (
                              <span className="text-sm text-muted-foreground">({lesson.duration})</span>
                            )}
                            {lesson.moduleId && (
                              <Badge variant="secondary" className="text-xs">
                                {modules.find(m => m.id === lesson.moduleId)?.title || 'Módulo'}
                              </Badge>
                            )}
                          </div>
                          {lesson.description && (
                            <p className="text-sm text-muted-foreground mt-1">{lesson.description}</p>
                          )}
                        </div>
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
