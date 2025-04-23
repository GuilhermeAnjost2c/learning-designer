
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Course } from "@/store/courseStore";
import { User } from "@/store/userStore";
import { 
  Bookmark, Target, Tag, Clock, BookOpen, Users, 
  FileEdit, UserRound, Trash, UserPlus 
} from "lucide-react";

interface CourseInfoProps {
  course: Course;
  totalModules: number;
  totalLessons: number;
  lessonStatusStats: Record<string, number>;
  getStatusPercentage: (status: string) => number;
  getTotalCompletionPercentage: () => number;
  collaborators: (User | undefined)[];
  onOpenEditor: () => void;
  onRemoveCollaborator: (userId: string) => void;
  onOpenCollaboratorDialog: () => void;
}

export const CourseInfo = ({ 
  course, 
  totalModules, 
  totalLessons, 
  lessonStatusStats,
  getStatusPercentage,
  getTotalCompletionPercentage,
  collaborators,
  onOpenEditor,
  onRemoveCollaborator,
  onOpenCollaboratorDialog
}: CourseInfoProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div className="lg:col-span-2 space-y-6">
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
                <Badge variant="default" className="bg-opacity-90">
                  {course.status}
                </Badge>
              </div>
            </div>
          </div>
          <CardContent className="pt-6 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Progresso Total</h3>
                <span className="text-sm font-bold">{getTotalCompletionPercentage()}%</span>
              </div>
              <Progress value={getTotalCompletionPercentage()} className="h-2" />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Status das Aulas</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 inline-block bg-muted-foreground rounded-full"></span>
                      <span>Fazer</span>
                    </span>
                    <span>{getStatusPercentage('Fazer')}%</span>
                  </div>
                  <Progress value={getStatusPercentage('Fazer')} className="h-1.5 bg-muted" />
                  <p className="text-xs text-muted-foreground mt-1">{lessonStatusStats['Fazer'] || 0} aulas</p>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 inline-block bg-blue-400 rounded-full"></span>
                      <span>Fazendo</span>
                    </span>
                    <span>{getStatusPercentage('Fazendo')}%</span>
                  </div>
                  <Progress value={getStatusPercentage('Fazendo')} className="h-1.5 bg-muted" />
                  <p className="text-xs text-muted-foreground mt-1">{lessonStatusStats['Fazendo'] || 0} aulas</p>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 inline-block bg-green-500 rounded-full"></span>
                      <span>Finalizando</span>
                    </span>
                    <span>{getStatusPercentage('Finalizando')}%</span>
                  </div>
                  <Progress value={getStatusPercentage('Finalizando')} className="h-1.5 bg-muted" />
                  <p className="text-xs text-muted-foreground mt-1">{lessonStatusStats['Finalizando'] || 0} aulas</p>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Colaboradores</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-xs"
                  onClick={onOpenCollaboratorDialog}
                >
                  <UserPlus className="h-3 w-3 mr-1" />
                  <span>Adicionar</span>
                </Button>
              </div>
              <div className="space-y-2">
                {collaborators.length > 0 ? (
                  collaborators.map(collaborator => collaborator && (
                    <div key={collaborator.id} className="flex items-center justify-between border rounded-md p-2">
                      <div className="flex items-center gap-2">
                        <UserRound className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{collaborator.name}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => onRemoveCollaborator(collaborator.id)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">Nenhum colaborador adicionado</p>
                )}
              </div>
            </div>
            
            <Button onClick={onOpenEditor} className="w-full gap-2 mt-4">
              <FileEdit className="h-4 w-4" />
              <span>Editor Avançado</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
