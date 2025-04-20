
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCourseStore, Course, CourseStatus } from "@/store/courseStore";
import { useUserStore } from "@/store/userStore";
import { ArrowLeft, Edit, Trash, Clock, Users, BookOpen, Plus, PenLine, FileEdit, Bookmark, Target, Tag, Check, UserPlus, CircleAlert } from "lucide-react";
import { CourseForm } from "@/components/courses/CourseForm";
import { ModuleForm } from "@/components/courses/ModuleForm";
import { ModuleItem } from "@/components/courses/ModuleItem";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const { courses, deleteCourse, updateCourseStatus, addCollaborator, removeCollaborator, getCourseProgress } = useCourseStore();
  const { users, currentUser } = useUserStore();
  const [course, setCourse] = useState<Course | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [addCollaboratorOpen, setAddCollaboratorOpen] = useState(false);
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState<string>("");
  
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
  
  // Get progress stats
  const progress = getCourseProgress(course.id);
  
  // Get collaborators
  const collaborators = course.collaborators 
    ? course.collaborators.map(id => users.find(u => u.id === id)).filter(Boolean)
    : [];

  const handleDelete = () => {
    deleteCourse(course.id);
    toast.success("Curso excluído com sucesso");
    navigate("/courses");
  };

  const handleStatusChange = (status: CourseStatus) => {
    updateCourseStatus(course.id, status);
    toast.success(`Status do curso atualizado para "${status}"`);
  };

  const handleAddCollaborator = () => {
    if (selectedCollaboratorId) {
      addCollaborator(course.id, selectedCollaboratorId);
      toast.success("Colaborador adicionado com sucesso");
      setAddCollaboratorOpen(false);
      setSelectedCollaboratorId("");
    }
  };

  const handleRemoveCollaborator = (userId: string) => {
    removeCollaborator(course.id, userId);
    toast.success("Colaborador removido com sucesso");
  };

  const getStatusVariant = (status: CourseStatus) => {
    switch(status) {
      case 'Rascunho': return 'secondary';
      case 'Em andamento': return 'default';
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
              onClick={() => setAddCollaboratorOpen(true)}
              className="gap-1"
            >
              <UserPlus className="h-4 w-4" />
              <span>Colaboradores</span>
            </Button>
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

          {/* Collaborators Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Colaboradores</h3>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setAddCollaboratorOpen(true)}
                  className="gap-1"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Adicionar</span>
                </Button>
              </div>
              
              {collaborators.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {collaborators.map(user => user && (
                    <div key={user.id} className="flex items-center justify-between border rounded-md p-2">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveCollaborator(user.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground p-4 border border-dashed rounded-md">
                  <p>Nenhum colaborador adicionado</p>
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
            <CardContent className="pt-6 space-y-6">
              {/* Course Progress */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Progresso do Curso</h3>
                  <span className="text-sm font-medium">{progress.percentage}%</span>
                </div>
                
                <Progress value={progress.percentage} className="h-2.5 mb-4" />
                
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="border rounded-lg p-2">
                    <div className="flex justify-center text-green-500 mb-1">
                      <Check className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium">Finalizados</p>
                    <p className="text-lg font-bold">{progress.finalizando}</p>
                  </div>
                  
                  <div className="border rounded-lg p-2">
                    <div className="flex justify-center text-amber-500 mb-1">
                      <CircleAlert className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium">Pendentes</p>
                    <p className="text-lg font-bold">{progress.fazer + progress.fazendo}</p>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Detalhes do Curso</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total de Aulas:</span>
                    <span className="font-medium">{totalLessons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total de Módulos:</span>
                    <span className="font-medium">{totalModules}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duração Total:</span>
                    <span className="font-medium">
                      {Math.floor(course.estimatedDuration / 60)}h {course.estimatedDuration % 60}min
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Aulas Finalizadas:</span>
                    <span className="font-medium">{progress.finalizando} ({progress.percentage}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Aulas Em Progresso:</span>
                    <span className="font-medium">{progress.fazendo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Aulas A Fazer:</span>
                    <span className="font-medium">{progress.fazer}</span>
                  </div>
                </div>
              </div>
              
              <Button onClick={openEditor} className="w-full gap-2">
                <FileEdit className="h-4 w-4" />
                <span>Editor Avançado</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

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
      
      {/* Add Collaborator Dialog */}
      <Dialog open={addCollaboratorOpen} onOpenChange={setAddCollaboratorOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Colaborador</DialogTitle>
            <DialogDescription>
              Escolha um usuário para colaborar neste curso.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedCollaboratorId} onValueChange={setSelectedCollaboratorId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um usuário" />
              </SelectTrigger>
              <SelectContent>
                {users
                  .filter(user => 
                    !course.collaborators?.includes(user.id) && 
                    user.id !== currentUser?.id
                  )
                  .map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCollaboratorOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddCollaborator} disabled={!selectedCollaboratorId}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseDetail;
