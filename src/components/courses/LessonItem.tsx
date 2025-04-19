
import { Lesson } from "@/store/courseStore";
import { useUserStore, LessonStatus } from "@/store/userStore";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import { LessonStatusBadge } from "./LessonStatusBadge";

interface LessonItemProps {
  courseId: string;
  moduleId: string;
  lesson: Lesson;
  index: number;
  readOnly?: boolean;
}

export const LessonItem = ({ lesson, index, readOnly }: LessonItemProps) => {
  const { currentUser, updateLessonStatus, getLessonStatus } = useUserStore();
  const status = getLessonStatus(lesson.id);

  const handleStatusClick = () => {
    if (!currentUser.id || readOnly) return;

    const nextStatus: Record<LessonStatus, LessonStatus> = {
      'to-do': 'in-progress',
      'in-progress': 'completed',
      'completed': 'to-do',
    };

    updateLessonStatus(currentUser.id, lesson.id, nextStatus[status]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium">{lesson.title}</h4>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{lesson.duration}min</span>
              </div>
              <div>
                {lesson.activityType}
              </div>
            </div>
            {lesson.description && (
              <p className="mt-2 text-sm text-muted-foreground">{lesson.description}</p>
            )}
          </div>
          
          <div className="ml-4">
            <LessonStatusBadge 
              status={status} 
              onClick={handleStatusClick}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
