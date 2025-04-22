
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Course, LessonStatus } from "@/store/courseStore";

interface CourseProgressPanelProps {
  course: Course;
}

export const CourseProgressPanel = ({ course }: CourseProgressPanelProps) => {
  const totalLessons = course.modules.reduce(
    (acc, module) => acc + module.lessons.length, 
    0
  );
  
  const lessonStatusStats = course.modules.reduce((acc, module) => {
    module.lessons.forEach(lesson => {
      acc[lesson.status] = (acc[lesson.status] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
  
  const getStatusPercentage = (status: string) => {
    if (totalLessons === 0) return 0;
    return Math.round((lessonStatusStats[status] || 0) / totalLessons * 100);
  };
  
  const getTotalCompletionPercentage = () => {
    if (totalLessons === 0) return 0;
    const finalizandoCount = lessonStatusStats['Finalizando'] || 0;
    return Math.round((finalizandoCount / totalLessons) * 100);
  };

  return (
    <Card className="shadow-sm">
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
      </CardContent>
    </Card>
  );
};
