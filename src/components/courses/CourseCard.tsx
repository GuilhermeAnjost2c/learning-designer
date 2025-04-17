
import { Clock, GraduationCap, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Course } from "@/store/courseStore";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
  course: Course;
  className?: string;
}

export const CourseCard = ({ course, className }: CourseCardProps) => {
  const navigate = useNavigate();

  const totalMinutes = course.modules.reduce((total, module) => {
    return total + module.lessons.reduce((moduleTotal, lesson) => {
      return moduleTotal + lesson.duration;
    }, 0);
  }, 0);
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const durationText = hours > 0 
    ? `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}` 
    : `${minutes}min`;

  const totalLessons = course.modules.reduce((count, module) => {
    return count + module.lessons.length;
  }, 0);

  const handleCardClick = () => {
    navigate(`/courses/${course.id}`);
  };

  return (
    <Card
      className={cn(
        "overflow-hidden border hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer h-80 flex flex-col",
        className
      )}
      onClick={handleCardClick}
    >
      <div className="relative">
        {course.thumbnail ? (
          <img 
            src={course.thumbnail} 
            alt={course.name} 
            className={cn(
              "w-full object-cover",
              className?.includes("!flex-row") ? "h-32" : "h-40"
            )}
          />
        ) : (
          <div 
            className={cn(
              "w-full bg-gradient-to-r from-primary/60 to-primary flex items-center justify-center",
              className?.includes("!flex-row") ? "h-32" : "h-40"
            )}
          >
            <span className="text-white font-semibold text-lg">
              {course.name.substring(0, 2).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 flex flex-col">
        <h3 className="font-medium line-clamp-1 mb-1">{course.name}</h3>
        
        {/* Display tags if available */}
        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {course.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs py-0 px-1.5">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <p className={cn(
          "text-sm text-muted-foreground line-clamp-2 mb-auto",
          className?.includes("!flex-row") ? "line-clamp-1" : ""
        )}>
          {course.description}
        </p>
        
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{durationText}</span>
          </div>
          <div className="flex items-center gap-1">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>{course.modules.length} módulos</span>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground mt-2">
          Atualizado em {format(new Date(course.updatedAt), "dd/MM/yyyy", { locale: ptBR })}
        </div>
      </div>
    </Card>
  );
};
