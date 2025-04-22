
import { Course, CourseStatus } from "@/store/courseStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash, PenLine, UserPlus, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CourseHeaderProps {
  course: Course;
  onEdit: () => void;
  onDelete: () => void;
  onAddCollaborator: () => void;
  onSubmitApproval: () => void;
  handleStatusChange: (status: CourseStatus) => void;
}

export const CourseHeader = ({
  course,
  onEdit,
  onDelete,
  onAddCollaborator,
  onSubmitApproval,
  handleStatusChange
}: CourseHeaderProps) => {
  const navigate = useNavigate();

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

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="flex items-center mb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/courses")}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold truncate">{course.name}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-4">
        <Badge variant={getStatusVariant(course.status)} className="h-7 px-3 text-sm">
          {course.status}
        </Badge>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 gap-1">
              <PenLine className="h-4 w-4" />
              <span className="hidden sm:inline">Mudar Status</span>
              <span className="sm:hidden">Status</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleStatusChange('Rascunho')}>
              Rascunho
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('Em andamento')}>
              Em andamento
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('Concluído')}>
              Concluído
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 gap-1"
          onClick={onAddCollaborator}
        >
          <UserPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Colaboradores</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 gap-1"
          onClick={onSubmitApproval}
        >
          <Send className="h-4 w-4" />
          <span className="hidden sm:inline">Enviar para Aprovação</span>
          <span className="sm:hidden">Aprovar</span>
        </Button>
        
        <div className="ml-auto flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="gap-1"
          >
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Editar</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="gap-1"
          >
            <Trash className="h-4 w-4" />
            <span className="hidden sm:inline">Excluir</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
