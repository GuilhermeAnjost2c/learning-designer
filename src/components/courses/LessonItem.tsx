
import { useState } from "react";
import { Lesson, useCourseStore } from "@/store/courseStore";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Edit, 
  Trash, 
  GripVertical, 
  Clock,
  LayoutList,
  BookOpen,
  Users,
  Presentation,
  Gauge
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { LessonForm } from "./LessonForm";
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
import { toast } from "sonner";

interface LessonItemProps {
  courseId: string;
  moduleId: string;
  lesson: Lesson;
  index: number;
}

export const LessonItem = ({ courseId, moduleId, lesson, index }: LessonItemProps) => {
  const { deleteLesson } = useCourseStore();
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const activityTypeIcons = {
    "Exposição": Presentation,
    "Dinâmica": Users,
    "Prática": LayoutList,
    "Avaliação": Gauge
  };

  const ActivityIcon = activityTypeIcons[lesson.activityType];

  const handleDelete = () => {
    deleteLesson(courseId, moduleId, lesson.id);
    toast.success("Aula excluída com sucesso");
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: index * 0.05 }}
      >
        <Card className="border border-muted">
          <CardHeader className="p-3 pb-0 flex flex-row items-start">
            <div className="mr-2 mt-1 cursor-move">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <CardTitle className="text-sm font-medium">{lesson.title}</CardTitle>
                <div className="flex items-center gap-1 ml-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-2">
            {lesson.description && (
              <p className="text-xs text-muted-foreground mb-2">{lesson.description}</p>
            )}
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className="flex items-center gap-1 px-2 py-0 h-5 text-xs"
                >
                  {ActivityIcon && <ActivityIcon className="h-3 w-3" />}
                  <span>{lesson.activityType}</span>
                </Badge>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{lesson.duration} min</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

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
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
