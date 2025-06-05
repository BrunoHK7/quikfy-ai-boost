<think>

</think>

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StandardHeader } from '@/components/StandardHeader';
import { ImageUpload } from '@/components/ImageUpload';
import { AccessLevelSelector } from '@/components/AccessLevelSelector';
import { CourseAccessBadge } from '@/components/CourseAccessBadge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  BookOpen, 
  Video,
  FolderOpen,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string | null;
  level: string;
  price: number;
  estimated_duration: string | null;
  cover_image: string | null;
  access_level: 'free' | 'plus' | 'pro' | 'vip';
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  cover_image: string | null;
  order_number: number;
  course_id: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  cover_image: string | null;
  duration: string | null;
  order_number: number;
  course_id: string;
  module_id: string | null;
}

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [courseData, setCourseData] = useState<Course>({
    id: '',
    title: '',
    description: '',
    category: '',
    level: 'Iniciante',
    price: 0,
    estimated_duration: '',
    cover_image: '',
    access_level: 'free'
  });

  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [newModule, setNewModule] = useState({ title: '', description: '', cover_image: '' });
  const [newLesson, setNewLesson] = useState({ 
    title: '', 
    description: '', 
    video_url: '', 
    cover_image: '', 
    duration: '', 
    module_id: 'none' 
  });
  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);

  // Buscar dados do curso
  const { data: course, isLoading: loadingCourse } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!courseId
  });

  // Buscar módulos do curso
  const { data: courseModules, isLoading: loadingModules } = useQuery({
    queryKey: ['course-modules', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_number');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!courseId
  });

  // Buscar aulas do curso
  const { data: courseLessons, isLoading: loadingLessons } = useQuery({
    queryKey: ['course-lessons', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_number');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!courseId
  });

  useEffect(() => {
    if (course) {
      setCourseData(course);
    }
  }, [course]);

  useEffect(() => {
    if (courseModules) {
      setModules(courseModules);
    }
  }, [courseModules]);

  useEffect(() => {
    if (courseLessons) {
      setLessons(courseLessons);
    }
  }, [courseLessons]);

  // Mutação para atualizar curso
  const updateCourseMutation = useMutation({
    mutationFn: async (data: Partial<Course>) => {
      const { error } = await supabase
        .from('courses')
        .update(data)
        .eq('id', courseId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Curso atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar curso: ${error.message}`);
    }
  });

  // Mutação para criar módulo
  const createModuleMutation = useMutation({
    mutationFn: async (moduleData: any) => {
      const { error } = await supabase
        .from('modules')
        .insert({
          ...moduleData,
          course_id: courseId,
          order_number: modules.length + 1
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Módulo criado com sucesso!');
      setNewModule({ title: '', description: '', cover_image: '' });
      queryClient.invalidateQueries({ queryKey: ['course-modules', courseId] });
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar módulo: ${error.message}`);
    }
  });

  // Mutação para criar aula
  const createLessonMutation = useMutation({
    mutationFn: async (lessonData: any) => {
      const lessonToInsert = {
        ...lessonData,
        course_id: courseId,
        order_number: lessons.length + 1,
        module_id: lessonData.module_id === 'none' ? null : lessonData.module_id
      };

      const { error } = await supabase
        .from('lessons')
        .insert(lessonToInsert);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Aula criada com sucesso!');
      setNewLesson({ 
        title: '', 
        description: '', 
        video_url: '', 
        cover_image: '', 
        duration: '', 
        module_id: 'none' 
      });
      queryClient.invalidateQueries({ queryKey: ['course-lessons', courseId] });
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar aula: ${error.message}`);
    }
  });

  // Mutação para atualizar módulo
  const updateModuleMutation = useMutation({
    mutationFn: async ({ moduleId, data }: { moduleId: string, data: any }) => {
      const { error } = await supabase
        .from('modules')
        .update(data)
        .eq('id', moduleId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Módulo atualizado com sucesso!');
      setEditingModule(null);
      queryClient.invalidateQueries({ queryKey: ['course-modules', courseId] });
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar módulo: ${error.message}`);
    }
  });

  // Mutação para atualizar aula
  const updateLessonMutation = useMutation({
    mutationFn: async ({ lessonId, data }: { lessonId: string, data: any }) => {
      const lessonToUpdate = {
        ...data,
        module_id: data.module_id === 'none' ? null : data.module_id
      };

      const { error } = await supabase
        .from('lessons')
        .update(lessonToUpdate)
        .eq('id', lessonId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Aula atualizada com sucesso!');
      setEditingLesson(null);
      queryClient.invalidateQueries({ queryKey: ['course-lessons', courseId] });
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar aula: ${error.message}`);
    }
  });

  // Mutação para deletar módulo
  const deleteModuleMutation = useMutation({
    mutationFn: async (moduleId: string) => {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', moduleId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Módulo excluído com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['course-modules', courseId] });
    },
    onError: (error: any) => {
      toast.error(`Erro ao excluir módulo: ${error.message}`);
    }
  });

  // Mutação para deletar aula
  const deleteLessonMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Aula excluída com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['course-lessons', courseId] });
    },
    onError: (error: any) => {
      toast.error(`Erro ao excluir aula: ${error.message}`);
    }
  });

  const handleSaveCourse = () => {
    updateCourseMutation.mutate(courseData);
  };

  const handleCreateModule = () => {
    if (!newModule.title.trim()) {
      toast.error('Título do módulo é obrigatório');
      return;
    }
    createModuleMutation.mutate(newModule);
  };

  const handleCreateLesson = () => {
    if (!newLesson.title.trim() || !newLesson.video_url.trim()) {
      toast.error('Título e URL do vídeo são obrigatórios');
      return;
    }
    createLessonMutation.mutate(newLesson);
  };

  const handleUpdateModule = (module: Module) => {
    updateModuleMutation.mutate({ moduleId: module.id, data: module });
  };

  const handleUpdateLesson = (lesson: Lesson) => {
    updateLessonMutation.mutate({ lessonId: lesson.id, data: lesson });
  };

  const handleDeleteModule = (moduleId: string) => {
    if (confirm('Tem certeza que deseja excluir este módulo? Esta ação não pode ser desfeita.')) {
      deleteModuleMutation.mutate(moduleId);
    }
  };

  const handleDeleteLesson = (lessonId: string) => {
    if (confirm('Tem certeza que deseja excluir esta aula? Esta ação não pode ser desfeita.')) {
      deleteLessonMutation.mutate(lessonId);
    }
  };

  if (loadingCourse || loadingModules || loadingLessons) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Carregando curso...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <StandardHeader 
          title={`Editar Curso: ${courseData.title}`}
          showBackButton={true}
          rightContent={
            courseData.access_level && (
              <CourseAccessBadge accessLevel={courseData.access_level} size="md" />
            )
          }
        />

        <Tabs defaultValue="course" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="course">Informações do Curso</TabsTrigger>
            <TabsTrigger value="modules">Módulos</TabsTrigger>
            <TabsTrigger value="lessons">Aulas</TabsTrigger>
          </TabsList>

          {/* Aba de Informações do Curso */}
          <TabsContent value="course">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Informações do Curso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Título do Curso</Label>
                    <Input
                      id="title"
                      value={courseData.title}
                      onChange={(e) => setCourseData({...courseData, title: e.target.value})}
                      placeholder="Digite o título do curso"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Input
                      id="category"
                      value={courseData.category || ''}
                      onChange={(e) => setCourseData({...courseData, category: e.target.value})}
                      placeholder="Ex: Marketing Digital"
                    />
                  </div>

                  <div>
                    <Label htmlFor="level">Nível</Label>
                    <Select value={courseData.level} onValueChange={(value) => setCourseData({...courseData, level: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Iniciante">Iniciante</SelectItem>
                        <SelectItem value="Intermediário">Intermediário</SelectItem>
                        <SelectItem value="Avançado">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={courseData.price}
                      onChange={(e) => setCourseData({...courseData, price: parseFloat(e.target.value) || 0})}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Duração Estimada</Label>
                    <Input
                      id="duration"
                      value={courseData.estimated_duration || ''}
                      onChange={(e) => setCourseData({...courseData, estimated_duration: e.target.value})}
                      placeholder="Ex: 4 horas"
                    />
                  </div>

                  <AccessLevelSelector
                    value={courseData.access_level}
                    onChange={(value) => setCourseData({...courseData, access_level: value})}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={courseData.description}
                    onChange={(e) => setCourseData({...courseData, description: e.target.value})}
                    placeholder="Descreva o curso..."
                    rows={4}
                  />
                </div>

                <ImageUpload
                  label="Imagem de Capa do Curso"
                  value={courseData.cover_image || ''}
                  onChange={(url) => setCourseData({...courseData, cover_image: url})}
                  expectedDimensions={{ width: 1080, height: 1350 }}
                />

                <Button onClick={handleSaveCourse} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações do Curso
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Módulos */}
          <TabsContent value="modules">
            <div className="space-y-6">
              {/* Adicionar Novo Módulo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Adicionar Novo Módulo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="module-title">Título do Módulo</Label>
                    <Input
                      id="module-title"
                      value={newModule.title}
                      onChange={(e) => setNewModule({...newModule, title: e.target.value})}
                      placeholder="Digite o título do módulo"
                    />
                  </div>

                  <div>
                    <Label htmlFor="module-description">Descrição</Label>
                    <Textarea
                      id="module-description"
                      value={newModule.description}
                      onChange={(e) => setNewModule({...newModule, description: e.target.value})}
                      placeholder="Descreva o módulo..."
                      rows={3}
                    />
                  </div>

                  <ImageUpload
                    label="Imagem de Capa do Módulo"
                    value={newModule.cover_image}
                    onChange={(url) => setNewModule({...newModule, cover_image: url})}
                    expectedDimensions={{ width: 1080, height: 1350 }}
                  />

                  <Button onClick={handleCreateModule} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Módulo
                  </Button>
                </CardContent>
              </Card>

              {/* Lista de Módulos Existentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <FolderOpen className="w-5 h-5 mr-2" />
                      Módulos do Curso
                    </span>
                    <Badge variant="outline">{modules.length} módulos</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {modules.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum módulo criado ainda</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {modules.map((module) => (
                        <div key={module.id} className="border rounded-lg p-4">
                          {editingModule === module.id ? (
                            <div className="space-y-4">
                              <Input
                                value={module.title}
                                onChange={(e) => setModules(modules.map(m => 
                                  m.id === module.id ? {...m, title: e.target.value} : m
                                ))}
                                placeholder="Título do módulo"
                              />
                              <Textarea
                                value={module.description || ''}
                                onChange={(e) => setModules(modules.map(m => 
                                  m.id === module.id ? {...m, description: e.target.value} : m
                                ))}
                                placeholder="Descrição do módulo"
                                rows={3}
                              />
                              <ImageUpload
                                label="Imagem de Capa do Módulo"
                                value={module.cover_image || ''}
                                onChange={(url) => setModules(modules.map(m => 
                                  m.id === module.id ? {...m, cover_image: url} : m
                                ))}
                                expectedDimensions={{ width: 1080, height: 1350 }}
                              />
                              <div className="flex space-x-2">
                                <Button onClick={() => handleUpdateModule(module)} size="sm">
                                  <Save className="w-4 h-4 mr-1" />
                                  Salvar
                                </Button>
                                <Button onClick={() => setEditingModule(null)} variant="outline" size="sm">
                                  Cancelar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold">{module.title}</h3>
                                {module.description && (
                                  <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                                )}
                                <div className="flex items-center space-x-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    Ordem: {module.order_number}
                                  </Badge>
                                  {module.cover_image && (
                                    <Badge variant="outline" className="text-xs">
                                      Com imagem
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button 
                                  onClick={() => setEditingModule(module.id)} 
                                  variant="outline" 
                                  size="sm"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  onClick={() => handleDeleteModule(module.id)} 
                                  variant="outline" 
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba de Aulas */}
          <TabsContent value="lessons">
            <div className="space-y-6">
              {/* Adicionar Nova Aula */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Adicionar Nova Aula
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lesson-title">Título da Aula</Label>
                      <Input
                        id="lesson-title"
                        value={newLesson.title}
                        onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                        placeholder="Digite o título da aula"
                      />
                    </div>

                    <div>
                      <Label htmlFor="lesson-duration">Duração</Label>
                      <Input
                        id="lesson-duration"
                        value={newLesson.duration}
                        onChange={(e) => setNewLesson({...newLesson, duration: e.target.value})}
                        placeholder="Ex: 15 min"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="lesson-video">URL do Vídeo</Label>
                    <Input
                      id="lesson-video"
                      value={newLesson.video_url}
                      onChange={(e) => setNewLesson({...newLesson, video_url: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="lesson-module">Módulo (Opcional)</Label>
                    <Select value={newLesson.module_id} onValueChange={(value) => setNewLesson({...newLesson, module_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um módulo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sem módulo</SelectItem>
                        {modules.map((module) => (
                          <SelectItem key={module.id} value={module.id}>
                            {module.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="lesson-description">Descrição</Label>
                    <Textarea
                      id="lesson-description"
                      value={newLesson.description}
                      onChange={(e) => setNewLesson({...newLesson, description: e.target.value})}
                      placeholder="Descreva a aula..."
                      rows={3}
                    />
                  </div>

                  <ImageUpload
                    label="Imagem de Capa da Aula"
                    value={newLesson.cover_image}
                    onChange={(url) => setNewLesson({...newLesson, cover_image: url})}
                    expectedDimensions={{ width: 1920, height: 1080 }}
                  />

                  <Button onClick={handleCreateLesson} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Aula
                  </Button>
                </CardContent>
              </Card>

              {/* Lista de Aulas Existentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Video className="w-5 h-5 mr-2" />
                      Aulas do Curso
                    </span>
                    <Badge variant="outline">{lessons.length} aulas</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {lessons.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhuma aula criada ainda</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {lessons.map((lesson) => (
                        <div key={lesson.id} className="border rounded-lg p-4">
                          {editingLesson === lesson.id ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                  value={lesson.title}
                                  onChange={(e) => setLessons(lessons.map(l => 
                                    l.id === lesson.id ? {...l, title: e.target.value} : l
                                  ))}
                                  placeholder="Título da aula"
                                />
                                <Input
                                  value={lesson.duration || ''}
                                  onChange={(e) => setLessons(lessons.map(l => 
                                    l.id === lesson.id ? {...l, duration: e.target.value} : l
                                  ))}
                                  placeholder="Duração"
                                />
                              </div>
                              <Input
                                value={lesson.video_url}
                                onChange={(e) => setLessons(lessons.map(l => 
                                  l.id === lesson.id ? {...l, video_url: e.target.value} : l
                                ))}
                                placeholder="URL do vídeo"
                              />
                              <Select 
                                value={lesson.module_id || 'none'} 
                                onValueChange={(value) => setLessons(lessons.map(l => 
                                  l.id === lesson.id ? {...l, module_id: value === 'none' ? null : value} : l
                                ))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um módulo" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">Sem módulo</SelectItem>
                                  {modules.map((module) => (
                                    <SelectItem key={module.id} value={module.id}>
                                      {module.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Textarea
                                value={lesson.description || ''}
                                onChange={(e) => setLessons(lessons.map(l => 
                                  l.id === lesson.id ? {...l, description: e.target.value} : l
                                ))}
                                placeholder="Descrição da aula"
                                rows={3}
                              />
                              <ImageUpload
                                label="Imagem de Capa da Aula"
                                value={lesson.cover_image || ''}
                                onChange={(url) => setLessons(lessons.map(l => 
                                  l.id === lesson.id ? {...l, cover_image: url} : l
                                ))}
                                expectedDimensions={{ width: 1920, height: 1080 }}
                              />
                              <div className="flex space-x-2">
                                <Button onClick={() => handleUpdateLesson(lesson)} size="sm">
                                  <Save className="w-4 h-4 mr-1" />
                                  Salvar
                                </Button>
                                <Button onClick={() => setEditingLesson(null)} variant="outline" size="sm">
                                  Cancelar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold">{lesson.title}</h3>
                                {lesson.description && (
                                  <p className="text-sm text-muted-foreground mt-1">{lesson.description}</p>
                                )}
                                <div className="flex items-center space-x-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    Ordem: {lesson.order_number}
                                  </Badge>
                                  {lesson.duration && (
                                    <Badge variant="outline" className="text-xs">
                                      {lesson.duration}
                                    </Badge>
                                  )}
                                  {lesson.module_id && (
                                    <Badge variant="outline" className="text-xs">
                                      {modules.find(m => m.id === lesson.module_id)?.title || 'Módulo'}
                                    </Badge>
                                  )}
                                  {lesson.cover_image && (
                                    <Badge variant="outline" className="text-xs">
                                      Com imagem
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button 
                                  onClick={() => setEditingLesson(lesson.id)} 
                                  variant="outline" 
                                  size="sm"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  onClick={() => handleDeleteLesson(lesson.id)} 
                                  variant="outline" 
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EditCourse;
