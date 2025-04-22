
import { Course } from "@/store/courseStore";
import { Badge } from "@/components/ui/badge";

interface CourseInfoProps {
  course: Course;
}

export const CourseInfo = ({ course }: CourseInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Descrição</h3>
        <p className="whitespace-pre-wrap">{course.description}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Objetivos</h3>
        <p className="whitespace-pre-wrap">{course.objectives}</p>
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
    </div>
  );
};
