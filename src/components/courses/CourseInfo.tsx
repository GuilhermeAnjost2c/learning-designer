
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Course, Module, Lesson } from "@/store/courseStore";
import { User, useUserStore } from "@/store/userStore";
import { Clock, Calendar, Tag, UserRound, Edit2, Users, BookOpen } from "lucide-react";

interface CourseInfoProps {
  course: Course;
  totalModules: number;
  totalLessons: number;
  collaborators: (User | undefined)[];
  onOpenEditor: () => void;
  onRemoveCollaborator: (userId: string) => void;
  onOpenCollaboratorDialog: () => void;
}

export const CourseInfo = ({
  course,
  totalModules,
  totalLessons,
  collaborators,
  onOpenEditor,
  onRemoveCollaborator,
  onOpenCollaboratorDialog,
}: CourseInfoProps) => {
  const { currentUser } = useUserStore();
  const canEdit =
    currentUser?.role === "admin" ||
    course.createdBy === currentUser?.id ||
    (Array.isArray(course.collaborators) && course.collaborators.includes(currentUser?.id || ""));

  const formatCourseDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {/* Main course info card */}
      <Card className="md:col-span-2 h-full">
        <CardHeader>
          <CardTitle>Informações Gerais</CardTitle>
          <CardDescription>Detalhes e estatísticas do curso</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {course.objectives && (
            <div>
              <h3 className="font-medium mb-1">Objetivos de Aprendizagem</h3>
              <p className="text-muted-foreground text-sm">{course.objectives}</p>
            </div>
          )}
          
          {course.targetAudience && (
            <div>
              <h3 className="font-medium mb-1">Público-Alvo</h3>
              <p className="text-muted-foreground text-sm">{course.targetAudience}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1.5">
              <span className="text-xs text-muted-foreground">Criado em</span>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {formatCourseDate(course.createdAt)}
                </span>
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <span className="text-xs text-muted-foreground">Duração Total</span>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {course.estimatedDuration} minutos
                </span>
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <span className="text-xs text-muted-foreground">Formato</span>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {course.format || "EAD"}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1.5">
              <span className="text-xs text-muted-foreground">Total de Módulos</span>
              <div className="text-sm font-medium">
                {totalModules} módulo{totalModules !== 1 ? 's' : ''}
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <span className="text-xs text-muted-foreground">Total de Aulas</span>
              <div className="text-sm font-medium">
                {totalLessons} aula{totalLessons !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
          
          {course.tags && course.tags.length > 0 && (
            <div className="mt-2 space-y-1.5">
              <span className="text-xs text-muted-foreground">Tags</span>
              <div className="flex flex-wrap gap-1">
                {course.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        {canEdit && (
          <CardFooter>
            <Button variant="outline" size="sm" onClick={onOpenEditor} className="gap-1.5">
              <Edit2 className="h-3.5 w-3.5" />
              Editar Conteúdo
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Collaborators card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Colaboradores</span>
            {canEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenCollaboratorDialog}
                className="h-8 px-2 text-xs"
              >
                Adicionar
              </Button>
            )}
          </CardTitle>
          <CardDescription>
            Equipe com acesso a este curso
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-3">
            {collaborators.length > 0 ? (
              collaborators.map((collaborator) => (
                collaborator && (
                  <div key={collaborator.id} className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                        <UserRound className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium line-clamp-1">
                          {collaborator.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {collaborator.role}
                        </p>
                      </div>
                    </div>
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
                        onClick={() => onRemoveCollaborator(collaborator.id)}
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                )
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <Users className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground text-center">
                  Nenhum colaborador adicionado
                </p>
                {canEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={onOpenCollaboratorDialog}
                  >
                    Adicionar Colaborador
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
