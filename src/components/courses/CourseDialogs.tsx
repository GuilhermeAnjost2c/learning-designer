
import { useState, useEffect } from 'react';
import { Course, ApprovalItemType } from "@/store/courseStore";
import { User, useUserStore } from "@/store/userStore";
import { useSupabase } from "@/hooks/useSupabase";
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
import { UserRound, Trash, Search } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  const { searchUsers } = useSupabase();
  const { getAllManagers } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [userResults, setUserResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  
  const allManagers = getAllManagers();

  useEffect(() => {
    // Auto-select the first manager as approver
    if (allManagers.length > 0 && !approvalData.approverId) {
      setApprovalData({
        ...approvalData,
        approverId: allManagers[0].id,
        approvalType: 'curso_completo'
      });
    }
  }, [allManagers, approvalData, setApprovalData]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchQuery.length > 2) {
        const results = await searchUsers(searchQuery);
        setUserResults(results as User[]);
      }
    };
    
    fetchUsers();
  }, [searchQuery, searchUsers]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setCollaboratorEmail(user.email);
    setOpen(false);
  };

  const handleApprovalSubmit = () => {
    // Always use curso_completo as the type
    handleSubmitForApproval();
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
                  {selectedUser ? selectedUser.name : "Selecione um colaborador..."}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Buscar por nome..."
                    className="h-9"
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
                  <CommandGroup>
                    {userResults.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={user.id}
                        onSelect={() => handleUserSelect(user)}
                      >
                        <UserRound className="mr-2 h-4 w-4" />
                        <div className="flex flex-col">
                          <span>{user.name}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </CommandItem>
                    ))}
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
              Solicite a aprovação do curso completo.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
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
            <Button onClick={handleApprovalSubmit}>
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
