
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Course, CourseStatus } from "@/store/courseStore";
import { useUserStore } from "@/store/userStore";
import { User, Clock, BookOpen, Users } from "lucide-react";

interface CourseSummaryCardProps {
  course: Course;
}

export const CourseSummaryCard = ({ course }: CourseSummaryCardProps) => {
  const { users } = useUserStore();
  
  const creator = users.find(user => user.id === course.createdBy);
  const collaboratorsCount = course.collaborators.length;
  
  const getStatusVariant = (status: CourseStatus) => {
    switch(status) {
      case 'Rascunho': return 'outline';
      case 'Em andamento': return 'secondary';
      case 'Concluído': return 'default';
      case 'Em aprovação': return 'default';
      case 'Aprovado': return 'default';
      case 'Revisão solicitada': return 'destructive';
      default: return 'outline';
    }
  };

  const totalModules = course.modules.length;
  const totalLessons = course.modules.reduce(
    (acc, module) => acc + module.lessons.length, 
    0
  );

  return (
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
            <Badge variant={getStatusVariant(course.status)} className="bg-opacity-90">
              {course.status}
            </Badge>
          </div>
        </div>
      </div>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          <div>
            <p className="text-sm font-medium">Responsável</p>
            <p className="text-xs text-muted-foreground">{creator?.name || 'Não definido'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <div>
            <p className="text-sm font-medium">Duração Estimada</p>
            <p className="text-xs text-muted-foreground">
              {Math.floor(course.estimatedDuration / 60)}h {course.estimatedDuration % 60}min
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <div>
            <p className="text-sm font-medium">Estrutura</p>
            <p className="text-xs text-muted-foreground">
              {totalModules} módulos • {totalLessons} aulas
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <div>
            <p className="text-sm font-medium">Colaboradores</p>
            <p className="text-xs text-muted-foreground">
              {collaboratorsCount > 0 
                ? `${collaboratorsCount} colaborador${collaboratorsCount > 1 ? 'es' : ''}` 
                : 'Nenhum colaborador'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
