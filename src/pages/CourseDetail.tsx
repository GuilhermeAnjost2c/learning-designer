
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCourseStore, Course, CourseStatus } from "@/store/courseStore";
import { ArrowLeft, Edit, Trash, Clock, Users, BookOpen, Plus, PenLine, FileEdit, Bookmark, Target, Tag } from "lucide-react";
import { CourseForm } from "@/components/courses/CourseForm";
import { ModuleForm } from "@/components/courses/ModuleForm";
import { ModuleItem } from "@/components/courses/ModuleItem";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CourseEditor } from "@/components/courses/CourseEditor";

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courses, deleteCourse, updateCourseStatus } = useCourseStore();
  const [course, setCourse] = useState<Course | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  
  useEffect(() => {
    if (courseId) {
      const foundCourse = courses.find(c => c.id === courseId);
      setCourse(foundCourse || null);
    }
  }, [courseId, courses]);

  if (!course) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Curso não encontrado</h1>
        <Button onClick={() => navigate("/courses")}>Voltar para Cursos</Button>
      </div>
    );
  }

  // Calculate course metrics
  const totalModules = course.modules.length;
  const totalLessons = course.modules.reduce(
    (acc, module) => acc + module.lessons.length, 
    0
  );
  
  // Calculate lesson status statistics
  const lessonStatusStats = course.modules.reduce((acc, module) => {
    module.lessons.forEach(lesson => {
      acc[lesson.status] = (acc[lesson.status] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
  
  const getStatusPercentage = (status: string) => {
    if (totalLessons === 0) return 0;
    return Math.round((lessonStatusStats[status] || 0) / totalLessons * 100);
  };

  const handleDelete = () => {
    deleteCourse(course.id);
    toast.success("Curso excluído com sucesso");
    navigate("/courses");
  };

  const handleStatusChange = (status: CourseStatus) => {
    updateCourseStatus(course.id, status);
    toast.success(`Status do curso atualizado para "${status}"`);
  };

  const getStatusVariant = (status: CourseStatus) => {
    switch(status) {
      case 'Rascunho': return 'outline';
      case 'Em andamento': return 'secondary';
      case 'Concluído': return 'default';
      default: return 'outline';
    }
  };

  const openEditor = () => {
    setEditorOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/courses")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">{course.name}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-4">
          <Badge variant={getStatusVariant(course.status)} className="h-7 px-3 text-sm">
            {course.status}
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1">
                <PenLine className="h-4 w-4" />
                <span>Mudar Status</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleStatusChange('Rascunho')}>
                Rascunho
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('Em andamento')}>
                Em andamento
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('Concluído')}>
                Concluído
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="ml-auto flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="gap-1"
            >
              <Edit className="h-4 w-4" />
              <span>Editar</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              className="gap-1"
            >
              <Trash className="h-4 w-4" />
              <span>Excluir</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Course Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Course Description */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Bookmark className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Descrição do Curso</h3>
              </div>
              <p className="text-muted-foreground whitespace-pre-wrap">{course.description}</p>
              
              <div className="mt-6 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Objetivos de Aprendizagem</h3>
              </div>
              <p className="text-muted-foreground whitespace-pre-wrap">{course.objectives}</p>
              
              {course.tags && course.tags.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Tags</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metrics Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Estrutura</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Módulos</p>
                    <p className="text-2xl font-bold">{totalModules}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Aulas</p>
                    <p className="text-2xl font-bold">{totalLessons}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Duração</h3>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tempo Estimado</p>
                  <p className="text-2xl font-bold">
                    {Math.floor(course.estimatedDuration / 60)}h {course.estimatedDuration % 60}min
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Público</h3>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Público-alvo</p>
                  <p className="text-lg font-medium truncate">{course.targetAudience}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Image and Info Card */}
        <div className="lg:order-1">
          <Card className="overflow-hidden h-full">
            <div className="relative h-48 lg:h-64">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${course.thumbnail || '/placeholder.svg'})`,
                }} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-white text-xl font-bold mb-1">{course.name}</h2>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusVariant(course.status)} className="bg-opacity-90">
                    {course.status}
                  </Badge>
                </div>
              </div>
            </div>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Estatísticas do Curso</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="border rounded-md p-2">
                    <p className="text-xs text-muted-foreground">Total de Aulas</p>
                    <p className="text-lg font-bold">{totalLessons}</p>
                  </div>
                  <div className="border rounded-md p-2">
                    <p className="text-xs text-muted-foreground">Total Módulos</p>
                    <p className="text-lg font-bold">{totalModules}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Progresso das Aulas</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Fazer</span>
                    <span>{lessonStatusStats['Fazer'] || 0} aulas</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-muted-foreground rounded-full" 
                      style={{ width: `${getStatusPercentage('Fazer')}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span>Fazendo</span>
                    <span>{lessonStatusStats['Fazendo'] || 0} aulas</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-400 rounded-full" 
                      style={{ width: `${getStatusPercentage('Fazendo')}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span>Finalizando</span>
                    <span>{lessonStatusStats['Finalizando'] || 0} aulas</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${getStatusPercentage('Finalizando')}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <Button onClick={openEditor} className="w-full gap-2 mt-4">
                <FileEdit className="h-4 w-4" />
                <span>Editor Avançado</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Progress overview */}
      {totalLessons > 0 && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-4">Progresso do Curso</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Fazer</span>
                  <span className="text-sm text-muted-foreground">{getStatusPercentage('Fazer')}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-muted-foreground rounded-full" 
                    style={{ width: `${getStatusPercentage('Fazer')}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">{lessonStatusStats['Fazer'] || 0} aulas</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Fazendo</span>
                  <span className="text-sm text-muted-foreground">{getStatusPercentage('Fazendo')}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-400 rounded-full" 
                    style={{ width: `${getStatusPercentage('Fazendo')}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">{lessonStatusStats['Fazendo'] || 0} aulas</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Finalizando</span>
                  <span className="text-sm text-muted-foreground">{getStatusPercentage('Finalizando')}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ width: `${getStatusPercentage('Finalizando')}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">{lessonStatusStats['Finalizando'] || 0} aulas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="content" className="mt-6">
        <TabsList>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="info">Informações</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Módulos</h2>
            <div className="flex gap-2">
              <Button onClick={openEditor} className="gap-2" variant="outline">
                <FileEdit className="h-4 w-4" />
                <span>Editor Avançado</span>
              </Button>
              <Button onClick={() => setIsAddingModule(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Adicionar Módulo</span>
              </Button>
            </div>
          </div>

          {course.modules.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <h3 className="font-medium text-lg mb-2">Nenhum módulo adicionado</h3>
              <p className="text-muted-foreground mb-4">
                Comece adicionando um módulo ao seu curso.
              </p>
              <Button onClick={() => setIsAddingModule(true)}>Adicionar Módulo</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {course.modules.map((module, index) => (
                <ModuleItem
                  key={module.id}
                  courseId={course.id}
                  module={module}
                  index={index}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="info">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Descrição</h3>
              <p className="whitespace-pre-wrap">{course.description}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Objetivos</h3>
              <p className="whitespace-pre-wrap">{course.objectives}</p>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {course.tags && course.tags.length > 0 ? (
                course.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))
              ) : (
                <p className="text-muted-foreground">Nenhuma tag adicionada</p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {isEditing && (
        <CourseForm
          course={course}
          onClose={() => setIsEditing(false)}
        />
      )}

      {isAddingModule && (
        <ModuleForm
          courseId={course.id}
          onClose={() => setIsAddingModule(false)}
        />
      )}

      {editorOpen && (
        <CourseEditor 
          courseId={course.id} 
          onClose={() => setEditorOpen(false)} 
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Curso</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita e
              todos os módulos e aulas serão excluídos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CourseDetail;
