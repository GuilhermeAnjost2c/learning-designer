
import { Badge } from "@/components/ui/badge";
import { LessonStatus } from "@/store/userStore";

const statusConfig = {
  'to-do': {
    label: 'Fazer',
    className: 'bg-secondary hover:bg-secondary/80',
  },
  'in-progress': {
    label: 'Fazendo',
    className: 'bg-warning hover:bg-warning/80',
  },
  'completed': {
    label: 'Finalizado',
    className: 'bg-success hover:bg-success/80',
  },
} as const;

interface LessonStatusBadgeProps {
  status: LessonStatus;
  onClick?: () => void;
}

export const LessonStatusBadge = ({ status, onClick }: LessonStatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge 
      className={config.className}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {config.label}
    </Badge>
  );
};
