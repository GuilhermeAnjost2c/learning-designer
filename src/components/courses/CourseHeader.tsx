
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CourseStatus } from "@/store/courseStore";
import { useUserStore } from "@/store/userStore";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  MoreVertical,
  Users,
  Trash2,
  ClipboardCheck,
  BookOpen,
  Clock,
  ChevronDown
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CourseHeaderProps {
  course: any;
  onDelete: () => void;
  onEdit: () => void;
  onStatusChange: (status: CourseStatus) => void;
  onAddCollaborators?: () => void;
  onApprovalRequest?: () => void;
  handleDeleteDialogOpen: () => void;
  isOwner?: boolean;
  canEdit?: boolean;
}

export const CourseHeader = ({
  course,
  onDelete,
  onEdit,
  onStatusChange,
  onAddCollaborators,
  onApprovalRequest,
  handleDeleteDialogOpen,
  isOwner = false,
  canEdit = false,
}: CourseHeaderProps) => {
  const { currentUser, users } = useUserStore();
  const creator = users.find((user) => user.id === course.createdBy);
  
  const getStatusColor = (status: CourseStatus) => {
    switch (status) {
      case "Rascunho":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "Em andamento":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Concluído":
        return "bg-green-100 text-green-800 border-green-300";
      case "Arquivado":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{course.name}</h1>
        </div>
        <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
          {creator && <span>Por {creator.name}</span>}
          <span className="text-xs">•</span>
          <span>{format(new Date(course.updatedAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
          <span className="text-xs">•</span>
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{course.estimatedDuration} min</span>
          </div>
          <span className="text-xs">•</span>
          <div className="flex items-center">
            <BookOpen className="h-3.5 w-3.5 mr-1" />
            <span>{course.format || "EAD"}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {canEdit ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={`px-3 py-1 flex items-center gap-1 ${getStatusColor(course.status as CourseStatus)}`}
              >
                {course.status}
                <ChevronDown className="h-3.5 w-3.5 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onStatusChange("Rascunho")}>
                Rascunho
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange("Em andamento")}>
                Em andamento
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange("Concluído")}>
                Concluído
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange("Arquivado")}>
                Arquivado
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Badge
            variant="outline"
            className={`px-2 py-1 ${getStatusColor(course.status as CourseStatus)}`}
          >
            {course.status}
          </Badge>
        )}

        {canEdit && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onAddCollaborators}
              className="flex items-center gap-1"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Colaboradores</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onApprovalRequest}
              className="flex items-center gap-1"
            >
              <ClipboardCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Solicitar Aprovação</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  <span>Editar</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onSelect={handleDeleteDialogOpen}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  <span>Excluir</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </div>
  );
};
