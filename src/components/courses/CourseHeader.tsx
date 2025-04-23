
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Course, CourseStatus } from "@/store/courseStore";
import { 
  Edit, Trash, PenLine, UserPlus, Send, ArrowLeft 
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface CourseHeaderProps {
  course: Course;
  onDelete: () => void;
  onEdit: () => void;
  onStatusChange: (status: CourseStatus) => void;
  onAddCollaborators: () => void;
  onApprovalRequest: () => void;
  handleDeleteDialogOpen: () => void;
}

export const CourseHeader = ({
  course,
  onDelete,
  onEdit,
  onStatusChange,
  onAddCollaborators,
  onApprovalRequest,
  handleDeleteDialogOpen
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
        <h1 className="text-3xl font-bold">{course.name}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-4">
        <Badge variant={getStatusVariant(course.status)} className="h-7 px-3 text-sm">
          {course.status}
        </Badge>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 gap-1">
              <PenLine className="h-4 w-4" />
              <span>Mudar Status</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onStatusChange('Rascunho')}>
              Rascunho
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange('Em andamento')}>
              Em andamento
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange('Concluído')}>
              Concluído
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 gap-1"
          onClick={onAddCollaborators}
        >
          <UserPlus className="h-4 w-4" />
          <span>Colaboradores</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 gap-1"
          onClick={onApprovalRequest}
        >
          <Send className="h-4 w-4" />
          <span>Enviar para Aprovação</span>
        </Button>
        
        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="gap-1"
          >
            <Edit className="h-4 w-4" />
            <span>Editar</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteDialogOpen}
            className="gap-1"
          >
            <Trash className="h-4 w-4" />
            <span>Excluir</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
