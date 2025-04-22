
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCourseStore, Course, CourseStatus, ApprovalItemType } from "@/store/courseStore";
import { useUserStore } from "@/store/userStore";
import { ArrowLeft, Edit, Trash, Clock, Users, BookOpen, Plus, PenLine, FileEdit, Bookmark, Target, Tag, UserCheck, Send, UserRound, UserPlus } from "lucide-react";
import { CourseForm } from "@/components/courses/CourseForm";
import { ModuleForm } from "@/components/courses/ModuleForm";
import { ModuleItem } from "@/components/courses/ModuleItem";
import { Badge } from "@/components/ui/badge";
import { CourseProgressPanel } from "@/components/courses/CourseProgressPanel";
import { CourseSummaryCard } from "@/components/courses/CourseSummaryCard";
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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CourseEditor } from "@/components/courses/CourseEditor";

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courses, deleteCourse, updateCourseStatus, addCollaborator, removeCollaborator, submitForApproval } = useCourseStore();
  const { users, currentUser } = useUserStore();
  const [course, setCourse] = useState<Course | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [isCollaboratorDialogOpen, setIsCollaboratorDialogOpen] = useState(false);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [approvalData, setApprovalData] = useState({
    approvalType: "curso_completo" as ApprovalItemType,
    itemId: "",
    comments: ""
  });

  const admins = users.filter(user => user.role === 'admin');

  useEffect(() => {
    if (courseId) {
      const foundCourse = courses.find(c => c.id === courseId);
      setCourse(foundCourse || null);
    }
  }, [courseId, courses]);

  const canViewCourse = () => {
    if (!currentUser || !course) return false;
    
    return (
      currentUser.role === 'admin' ||
      course.createdBy === currentUser.id ||
      (currentUser.department && course.department === currentUser.department) ||
      (course.collaborators && course.collaborators.includes(currentUser.id))
    );
  };

  if (!course) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Curso não encontrado</h1>
        <Button onClick={() => navigate("/courses")}>Voltar para Cursos</Button>
      </div>
    );
  }
  
  if (!canViewCourse()) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Você não tem permissão para visualizar este curso</h1>
        <p className="mb-4 text-muted-foreground">Este curso está em outro departamento ou você não é um colaborador.</p>
        <Button onClick={() => navigate("/courses")}>Voltar para Cursos</Button>
      </div>
    );
  }

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
      case 'Em aprovação': return 'default';
      case 'Aprovado': return 'default';
      case 'Revisão solicitada': return 'destructive';
      default: return 'outline';
    }
  };

  const openEditor = () => {
    setEditorOpen(true);
  };

  const handleAddCollaborator = () => {
    if (!collaboratorEmail) {
      toast.error("Informe o email do colaborador");
      return;
    }
    
    const collaborator = users.find(user => user.email === collaboratorEmail);
    if (!collaborator) {
      toast.error("Usuário não encontrado");
      return;
    }
    
    if (course.collaborators.includes(collaborator.id)) {
      toast.error("Este usuário já é um colaborador");
      return;
    }
    
    addCollaborator(course.id, collaborator.id);
    toast.success(`${collaborator.name} adicionado como colaborador`);
    setCollaboratorEmail("");
    setIsCollaboratorDialogOpen(false);
  };

  const handleRemoveCollaborator = (userId: string) => {
    removeCollaborator(course.id, userId);
    toast.success("Colaborador removido com sucesso");
  };

  const getCollaborators = () => {
    return course.collaborators
      .map(userId => users.find(user => user.id === userId))
      .filter(Boolean);
  };

  const handleSubmitForApproval = () => {
    const adminId = admins.length > 0 ? admins[0].id : "admin";
    
    submitForApproval(
      course.id,
      currentUser!.id,
      approvalData.approvalType,
      approvalData.approvalType !== 'curso_completo' ? approvalData.itemId : undefined,
      approvalData.comments
    );
    
    toast.success("Curso enviado para aprovação");
    setIsApprovalDialogOpen(false);
  };

  return (
    <div className="container px-0 md:px-4 w-full max-w-7xl mx-auto">
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
          <h1 className="text-3xl font-bold truncate">{course.name}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-4">
          <Badge variant={getStatusVariant(course.status)} className="h-7 px-3 text-sm">
            {course.status}
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1">
                <PenLine className="h-4 w-4" />
                <span className="hidden sm:inline">Mudar Status</span>
                <span className="sm:hidden">Status</span>
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
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 gap-1"
            onClick={() => setIsCollaboratorDialogOpen(true)}
          >
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Colaboradores</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 gap-1"
            onClick={() => setIsApprovalDialogOpen(true)}
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Enviar para Aprovação</span>
            <span className="sm:hidden">Aprovar</span>
          </Button>
          
          <div className="ml-auto flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="gap-1"
            >
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Editar</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              className="gap-1"
            >
              <Trash className="h-4 w-4" />
              <span className="hidden sm:inline">Excluir</span>
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-8 space-y-6">
          <Card className="overflow-hidden">
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
                    <p className="text-2xl font-bold">{course.modules.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Aulas</p>
                    <p className="text-2xl font-bold">
                      {course.modules.reduce((acc, module) => acc + module.lessons.length, 0)}
                    </p>
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

        <div className="lg:col-span-4 space-y-6">
          <CourseSummaryCard course={course} />
          
          <CourseProgressPanel course={course} />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                <span>Colaboradores</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {getCollaborators().length > 0 ? (
                  getCollaborators().map(collaborator => collaborator && (
                    <div key={collaborator.id} className="flex items-center justify-between border rounded-md p-2">
                      <div className="flex items-center gap-2">
                        <UserRound className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate">{collaborator.name}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => handleRemoveCollaborator(collaborator.id)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">Nenhum colaborador adicionado</p>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-3"
                onClick={() => setIsCollaboratorDialogOpen(true)}
              >
                <UserPlus className="h-3 w-3 mr-1" />
                <span>Adicionar Colaborador</span>
              </Button>
            </CardContent>
          </Card>
          
          <Button onClick={openEditor} className="w-full gap-2">
            <FileEdit className="h-4 w-4" />
            <span>Editor Avançado</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="mt-6">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="info">Informações</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold">Módulos</h2>
            <div className="flex flex-wrap gap-2">
              <Button onClick={openEditor} className="gap-2" variant="outline">
                <FileEdit className="h-4 w-4" />
                <span className="hidden sm:inline">Editor Avançado</span>
                <span className="sm:hidden">Editor</span>
              </Button>
              <Button onClick={() => setIsAddingModule(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Adicionar Módulo</span>
                <span className="sm:hidden">Módulo</span>
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

      <Dialog open={isCollaboratorDialogOpen} onOpenChange={setIsCollaboratorDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Colaborador</DialogTitle>
            <DialogDescription>
              Adicione membros da equipe como colaboradores deste curso.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Label htmlFor="collaborator-email">Email do Colaborador</Label>
            <Input
              id="collaborator-email"
              placeholder="email@exemplo.com"
              value={collaboratorEmail}
              onChange={(e) => setCollaboratorEmail(e.target.value)}
            />
          </div>
          
          {getCollaborators().length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Colaboradores Atuais</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {getCollaborators().map(collaborator => collaborator && (
                  <div key={collaborator.id} className="flex items-center justify-between border rounded-md p-2">
                    <div className="flex items-center gap-2">
                      <UserRound className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{collaborator.name}</p>
                        <p className="text-xs text-muted-foreground">{collaborator.email}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => handleRemoveCollaborator(collaborator.id)}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCollaboratorDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddCollaborator}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Enviar para Aprovação</DialogTitle>
            <DialogDescription>
              Solicite a aprovação do curso ou de elementos específicos. O curso será enviado para análise pelos administradores.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="approval-type">O que deseja aprovar?</Label>
              <Select 
                value={approvalData.approvalType}
                onValueChange={(value) => setApprovalData({...approvalData, approvalType: value as ApprovalItemType})}
              >
                <SelectTrigger id="approval-type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="curso_completo">Curso Completo</SelectItem>
                  <SelectItem value="estrutura">Estrutura do Curso</SelectItem>
                  <SelectItem value="modulo">Módulo Específico</SelectItem>
                  <SelectItem value="aula">Aula Específica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {(approvalData.approvalType === 'modulo' || approvalData.approvalType === 'aula') && (
              <div>
                <Label htmlFor="item-id">
                  {approvalData.approvalType === 'modulo' ? 'Selecione o Módulo' : 'Selecione a Aula'}
                </Label>
                <Select 
                  value={approvalData.itemId}
                  onValueChange={(value) => setApprovalData({...approvalData, itemId: value})}
                >
                  <SelectTrigger id="item-id">
                    <SelectValue placeholder="Selecione o item" />
                  </SelectTrigger>
                  <SelectContent>
                    {approvalData.approvalType === 'modulo' 
                      ? course.modules.map(module => (
                          <SelectItem key={module.id} value={module.id}>
                            {module.title}
                          </SelectItem>
                        ))
                      : course.modules.flatMap(module => 
                          module.lessons.map(lesson => (
                            <SelectItem key={lesson.id} value={lesson.id}>
                              {module.title} - {lesson.title}
                            </SelectItem>
                          ))
                        )
                    }
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div>
              <Label htmlFor="comments">Comentários (opcional)</Label>
              <Textarea
                id="comments"
                placeholder="Informe detalhes adicionais se necessário"
                value={approvalData.comments}
                onChange={(e) => setApprovalData({...approvalData, comments: e.target.value})}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApprovalDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitForApproval}>
              Enviar para Aprovação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
