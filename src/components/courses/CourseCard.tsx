
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Course, CourseStatus } from "@/store/courseStore";
import { useNavigate } from "react-router-dom";
import { Clock, BookOpen, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CourseCardProps {
  course: Course;
  className?: string;
}

export const CourseCard = ({ course, className }: CourseCardProps) => {
  const navigate = useNavigate();
  
  // Calculate course metrics
  const totalModules = course.modules.length;
  const totalLessons = course.modules.reduce(
    (acc, module) => acc + module.lessons.length, 
    0
  );
  
  // Format the estimated duration
  const hours = Math.floor(course.estimatedDuration / 60);
  const minutes = course.estimatedDuration % 60;
  const durationText = hours > 0 
    ? `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}` 
    : `${minutes}min`;
  
  const handleClick = () => {
    navigate(`/courses/${course.id}`);
  };
  
  const getStatusVariant = (status: CourseStatus) => {
    switch(status) {
      case 'Rascunho': return 'outline';
      case 'Em andamento': return 'secondary';
      case 'Concluído': return 'default';
      default: return 'outline';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className={cn(
          "h-full overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer",
          className
        )}
        onClick={handleClick}
      >
        <div className={cn(
          "relative bg-cover bg-center h-40",
          className?.includes("!flex-row") ? "!h-full w-32" : ""
        )}>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${course.thumbnail || '/placeholder.svg'})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute bottom-2 left-2">
            <Badge variant={getStatusVariant(course.status)}>
              {course.status}
            </Badge>
          </div>
        </div>
        
        <CardContent className={cn(
          "p-4",
          className?.includes("!flex-row") ? "flex-1" : ""
        )}>
          <h3 className="font-bold mb-2 line-clamp-1">{course.name}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
            {course.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-auto">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{durationText}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <BookOpen className="h-3 w-3" />
              <span>{totalModules} {totalModules === 1 ? "módulo" : "módulos"}</span>
              <span>•</span>
              <span>{totalLessons} {totalLessons === 1 ? "aula" : "aulas"}</span>
            </div>
          </div>
        </CardContent>
        
        {!className?.includes("!flex-row") && (
          <CardFooter className="px-4 py-2 bg-muted/30 flex-wrap gap-1">
            {course.tags && course.tags.length > 0 ? (
              course.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  <span>{tag}</span>
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">Sem tags</span>
            )}
            {course.tags && course.tags.length > 2 && (
              <span className="text-xs text-muted-foreground">+{course.tags.length - 2}</span>
            )}
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};
