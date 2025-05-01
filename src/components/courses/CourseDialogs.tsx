
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UserRound, Trash, Check, ChevronsUpDown, X, Loader2 } from "lucide-react";
import { useUserManagement } from "@/hooks/useUserManagement";
import { cn } from "@/lib/utils";

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
  const { searchUsers, isLoading: isSearchingUsers } = useUserManagement();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      const results = await searchUsers(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setCollaboratorEmail(user.email);
    setOpen(false);
  };

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
            <Label>Buscar Colaborador</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {selectedUser ? selectedUser.name : "Selecione um usuário..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput 
                    placeholder="Buscar usuário..." 
                    value={searchQuery} 
                    onValueChange={handleSearch} 
                  />
                  {isSearchingUsers && (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
                  <CommandGroup>
                    <CommandList>
                      {searchResults.map(user => (
                        <CommandItem 
                          key={user.id}
                          value={user.name}
                          onSelect={() => handleSelectUser(user)}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedUser?.id === user.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div>
                            <p>{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandList>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
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
            {/* Removido o seletor de aprovador, será automático */}
            
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
