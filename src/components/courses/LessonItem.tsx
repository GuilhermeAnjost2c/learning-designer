
import { useState } from "react";
import { Lesson, useCourseStore, LessonStatus } from "@/store/courseStore";
import { LessonForm } from "./LessonForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash, GripVertical, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface LessonItemProps {
  courseId: string;
  moduleId: string;
  lesson: Lesson;
  index: number;
}

export const LessonItem = ({ courseId, moduleId, lesson, index }: LessonItemProps) => {
  const { deleteLesson, updateLessonStatus } = useCourseStore();
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const activityTypeColors: Record<string, string> = {
    'Exposição': 'bg-blue-100 text-blue-800',
    'Dinâmica': 'bg-green-100 text-green-800',
    'Prática': 'bg-orange-100 text-orange-800',
    'Avaliação': 'bg-purple-100 text-purple-800',
  };

  const statusVariant: Record<LessonStatus, "outline" | "secondary" | "default"> = {
    'Fazer': 'outline',
    'Fazendo': 'secondary',
    'Finalizando': 'default'
  };

  const handleStatusChange = (status: LessonStatus) => {
    updateLessonStatus(courseId, moduleId, lesson.id, status);
    toast.success(`Status da aula atualizado para "${status}"`);
  };

  const handleDelete = () => {
    deleteLesson(courseId, moduleId, lesson.id);
    toast.success("Aula excluída com sucesso");
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Card className="border-dashed">
        <CardContent className="flex items-center p-4 justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="cursor-move">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{lesson.title}</h4>
                <div className={`px-2 py-0.5 rounded text-xs font-medium ${activityTypeColors[lesson.activityType] || 'bg-gray-100 text-gray-800'}`}>
                  {lesson.activityType}
                </div>
                
                <Badge variant={statusVariant[lesson.status]}>
                  {lesson.status}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                <Clock className="h-3 w-3" />
                <span>{lesson.duration} min</span>
              </div>
              {lesson.description && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {lesson.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <span>Status</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusChange('Fazer')}>
                  Fazer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('Fazendo')}>
                  Fazendo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('Finalizando')}>
                  Finalizando
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {isEditing && (
        <LessonForm 
          courseId={courseId}
          moduleId={moduleId}
          lesson={lesson}
          onClose={() => setIsEditing(false)}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Aula</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta aula? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
