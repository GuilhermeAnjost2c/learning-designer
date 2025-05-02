
import { useState } from 'react';
import { Course, ApprovalItemType } from "@/store/courseStore";
import { User } from "@/store/userStore";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UserRound, Trash } from "lucide-react";

interface CourseDialogsProps {
  course: Course;
  managers: User[];
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  handleDelete: () => void;
  collaboratorEmail: string;
  setCollaboratorEmail: (email: string) => void;
  isCollaboratorDialogOpen: boolean;
  setIsCollaboratorDialogOpen: (open: boolean) => void;
  handleAddCollaborator: () => void;
  handleRemoveCollaborator: (userId: string) => void;
  getCollaborators: () => (User | undefined)[];
  approvalData: {
    approverId: string;
    approvalType: ApprovalItemType;
    itemId: string;
    comments: string;
  };
  setApprovalData: (data: {
    approverId: string;
    approvalType: ApprovalItemType;
    itemId: string;
    comments: string;
  }) => void;
  isApprovalDialogOpen: boolean;
  setIsApprovalDialogOpen: (open: boolean) => void;
  handleSubmitForApproval: () => void;
}

export const CourseDialogs = ({
  course,
  managers,
  deleteDialogOpen,
  setDeleteDialogOpen,
  handleDelete,
  collaboratorEmail,
  setCollaboratorEmail,
  isCollaboratorDialogOpen,
  setIsCollaboratorDialogOpen,
  handleAddCollaborator,
  handleRemoveCollaborator,
  getCollaborators,
  approvalData,
  setApprovalData,
  isApprovalDialogOpen,
  setIsApprovalDialogOpen,
  handleSubmitForApproval
}: CourseDialogsProps) => {
  return (
    <>
      <Dialog open={isCollaboratorDialogOpen} onOpenChange={setIsCollaboratorDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Colaborador</DialogTitle>
            <DialogDescription>
              Adicione membros da equipe como colaboradores deste curso.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Label htmlFor="collaborator-email">Email do Colaborador</Label>
            <Input
              id="collaborator-email"
              placeholder="email@exemplo.com"
              value={collaboratorEmail}
              onChange={(e) => setCollaboratorEmail(e.target.value)}
            />
          </div>
          
          {getCollaborators().length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Colaboradores Atuais</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {getCollaborators().map(collaborator => collaborator && (
                  <div key={collaborator.id} className="flex items-center justify-between border rounded-md p-2">
                    <div className="flex items-center gap-2">
                      <UserRound className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{collaborator.name}</p>
                        <p className="text-xs text-muted-foreground">{collaborator.email}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => handleRemoveCollaborator(collaborator.id)}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCollaboratorDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddCollaborator}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Enviar para Aprovação</DialogTitle>
            <DialogDescription>
              Solicite a aprovação do curso ou de elementos específicos.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="approver">Aprovador</Label>
              <Select 
                value={approvalData.approverId} 
                onValueChange={(value) => setApprovalData({...approvalData, approverId: value})}
              >
                <SelectTrigger id="approver">
                  <SelectValue placeholder="Selecione o aprovador" />
                </SelectTrigger>
                <SelectContent>
                  {managers.map(manager => (
                    <SelectItem key={manager.id} value={manager.id}>
                      {manager.name} ({manager.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="approval-type">O que deseja aprovar?</Label>
              <Select 
                value={approvalData.approvalType}
                onValueChange={(value) => setApprovalData({...approvalData, approvalType: value as ApprovalItemType})}
              >
                <SelectTrigger id="approval-type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="curso_completo">Curso Completo</SelectItem>
                  <SelectItem value="estrutura">Estrutura do Curso</SelectItem>
                  <SelectItem value="modulo">Módulo Específico</SelectItem>
                  <SelectItem value="aula">Aula Específica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {(approvalData.approvalType === 'modulo' || approvalData.approvalType === 'aula') && (
              <div>
                <Label htmlFor="item-id">
                  {approvalData.approvalType === 'modulo' ? 'Selecione o Módulo' : 'Selecione a Aula'}
                </Label>
                <Select 
                  value={approvalData.itemId}
                  onValueChange={(value) => setApprovalData({...approvalData, itemId: value})}
                >
                  <SelectTrigger id="item-id">
                    <SelectValue placeholder="Selecione o item" />
                  </SelectTrigger>
                  <SelectContent>
                    {approvalData.approvalType === 'modulo' 
                      ? course.modules.map(module => (
                          <SelectItem key={module.id} value={module.id}>
                            {module.title}
                          </SelectItem>
                        ))
                      : course.modules.flatMap(module => 
                          module.lessons.map(lesson => (
                            <SelectItem key={lesson.id} value={lesson.id}>
                              {module.title} - {lesson.title}
                            </SelectItem>
                          ))
                        )
                    }
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div>
              <Label htmlFor="comments">Comentários (opcional)</Label>
              <Textarea
                id="comments"
                placeholder="Informe detalhes adicionais se necessário"
                value={approvalData.comments}
                onChange={(e) => setApprovalData({...approvalData, comments: e.target.value})}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApprovalDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitForApproval}>
              Enviar para Aprovação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Curso</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita e
              todos os módulos e aulas serão excluídos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
