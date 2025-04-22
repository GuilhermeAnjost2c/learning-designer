
import { Course } from "@/store/courseStore";
import { ModuleItem } from "./ModuleItem";
import { Button } from "@/components/ui/button";
import { FileEdit, Plus } from "lucide-react";

interface CourseContentProps {
  course: Course;
  onAddModule: () => void;
  onOpenEditor: () => void;
}

export const CourseContent = ({ course, onAddModule, onOpenEditor }: CourseContentProps) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold">Módulos</h2>
        <div className="flex flex-wrap gap-2">
          <Button onClick={onOpenEditor} className="gap-2" variant="outline">
            <FileEdit className="h-4 w-4" />
            <span className="hidden sm:inline">Editor Avançado</span>
            <span className="sm:hidden">Editor</span>
          </Button>
          <Button onClick={onAddModule} className="gap-2">
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
          <Button onClick={onAddModule}>Adicionar Módulo</Button>
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
    </div>
  );
};
