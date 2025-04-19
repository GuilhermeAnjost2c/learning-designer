
import { useState } from "react";
import { Module, Lesson, useCourseStore } from "@/store/courseStore";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Edit, 
  Trash, 
  Plus, 
  GripVertical, 
  Clock, 
  ChevronDown
} from "lucide-react";
import { LessonItem } from "./LessonItem";
import { ModuleForm } from "./ModuleForm";
import { LessonForm } from "./LessonForm";
import { motion } from "framer-motion";
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

interface ModuleItemProps {
  courseId: string;
  module: Module;
  index: number;
  readOnly?: boolean;
  onDelete?: () => void;
}

export const ModuleItem = ({ courseId, module, index, readOnly, onDelete }: ModuleItemProps) => {
  const { deleteModule } = useCourseStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingLesson, setIsCreatingLesson] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Calculate total module duration
  const totalDuration = module.lessons.reduce((total, lesson) => total + lesson.duration, 0);
  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration % 60;
  const durationText = hours > 0 
    ? `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}` 
    : `${minutes}min`;

  const handleDelete = () => {
    deleteModule(courseId, module.id);
    toast.success("Módulo excluído com sucesso");
    setDeleteDialogOpen(false);
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <Card className="mb-4">
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1" className="border-0">
              <div className="flex items-center px-4 py-2">
                <div className="mr-2 cursor-move">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>
                <AccordionTrigger className="flex-1 py-0 hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="text-left">
                      <h3 className="font-medium text-base">{module.title}</h3>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{durationText}</span>
                        <span className="mx-2">•</span>
                        <span>{module.lessons.length} {module.lessons.length === 1 ? "aula" : "aulas"}</span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <div className="flex items-center gap-2 ml-auto">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <AccordionContent className="px-6 pb-4 pt-2">
                {module.description && (
                  <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                )}
                
                <div className="space-y-4">
                  {module.lessons.map((lesson, idx) => (
                    <LessonItem 
                      key={lesson.id}
                      courseId={courseId}
                      moduleId={module.id}
                      lesson={lesson}
                      index={idx}
                    />
                  ))}
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 gap-2" 
                    onClick={() => setIsCreatingLesson(true)}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Adicionar Aula</span>
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </motion.div>

      {isEditing && (
        <ModuleForm 
          courseId={courseId}
          module={module}
          onClose={() => setIsEditing(false)}
        />
      )}

      {isCreatingLesson && (
        <LessonForm 
          courseId={courseId}
          moduleId={module.id}
          onClose={() => setIsCreatingLesson(false)}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Módulo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este módulo? Esta ação não pode ser desfeita e
              todas as aulas associadas serão excluídas.
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
