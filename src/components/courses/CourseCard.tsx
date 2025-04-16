
import { Clock, BookOpen, Calendar, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Course } from "@/store/courseStore";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CourseCardProps {
  course: Course;
  className?: string;
}

export const CourseCard = ({ course, className }: CourseCardProps) => {
  // Format the created date
  const formattedDate = format(
    new Date(course.createdAt), 
    "dd 'de' MMMM 'de' yyyy", 
    { locale: ptBR }
  );

  // Calculate total modules and lessons
  const moduleCount = course.modules.length;
  const lessonCount = course.modules.reduce(
    (acc, module) => acc + module.lessons.length, 
    0
  );

  // Calculate total duration in hours and minutes
  const totalMinutes = course.estimatedDuration;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const durationText = hours > 0 
    ? `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}` 
    : `${minutes}min`;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("overflow-hidden h-full flex flex-col", className)}>
        <div 
          className="h-32 bg-gradient-to-r from-primary/60 to-primary bg-cover bg-center"
          style={course.thumbnail ? { backgroundImage: `url(${course.thumbnail})` } : {}}
        />
        <CardHeader className="p-4">
          <CardTitle className="line-clamp-2 text-lg">{course.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {course.description || "Sem descrição"}
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>{moduleCount} {moduleCount === 1 ? 'módulo' : 'módulos'}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{durationText}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground col-span-2">
              <Calendar className="h-4 w-4" />
              <span>Criado em {formattedDate}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button asChild variant="default" className="w-full gap-1">
            <Link to={`/courses/${course.id}`}>
              <span>Ver Detalhes</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
