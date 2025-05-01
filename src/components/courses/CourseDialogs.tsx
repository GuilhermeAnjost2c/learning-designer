
import React, { useState, useEffect } from "react";
import { Course } from "@/store/courseStore";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSupabase } from "@/hooks/useSupabase";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, User as UserIcon, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

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
  getCollaborators: () => User[];
  approvalData: {
    approverId: string;
    approvalType: string;
    itemId: string;
    comments: string;
  };
  setApprovalData: (data: any) => void;
  isApprovalDialogOpen: boolean;
  setIsApprovalDialogOpen: (open: boolean) => void;
  handleSubmitForApproval: () => void;
}

export const CourseDialogs: React.FC<CourseDialogsProps> = ({
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
  handleSubmitForApproval,
}) => {
  const { searchUsersByName } = useSupabase();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Load search results when search term changes
  useEffect(() => {
    const fetchUsers = async () => {
      if (debouncedSearchTerm && debouncedSearchTerm.length > 1) {
        setIsSearching(true);
        try {
          const results = await searchUsersByName(debouncedSearchTerm);
          const currentCollaborators = getCollaborators();
          
          // Filter out users who are already collaborators
          const filteredResults = results.filter(
            user => !currentCollaborators.some(collab => collab.id === user.id)
          );
          
          setSearchResults(filteredResults);
        } catch (error) {
          console.error("Error searching users:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    fetchUsers();
  }, [debouncedSearchTerm, getCollaborators, searchUsersByName]);
  
  // Handle user selection for collaborator
  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setCollaboratorEmail(user.email);
  };
  
  // Reset state when dialog closes
  const handleCloseCollaboratorDialog = () => {
    setIsCollaboratorDialogOpen(false);
    setSearchTerm("");
    setSelectedUser(null);
    setCollaboratorEmail("");
  };
  
  // Handle collaborator addition with selected user
  const handleAddSelectedCollaborator = () => {
    if (selectedUser) {
      handleRemoveCollaborator(selectedUser.id);
      handleAddCollaborator();
      handleCloseCollaboratorDialog();
    }
  };

  return (
    <>
      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Curso</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.
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

      {/* Add collaborator dialog */}
      <Dialog open={isCollaboratorDialogOpen} onOpenChange={handleCloseCollaboratorDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Colaborador</DialogTitle>
            <DialogDescription>
              Pesquise usuários pelo nome e adicione-os como colaboradores deste curso.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
            <Command className="rounded-lg border shadow-md">
              <CommandInput 
                placeholder="Pesquisar usuários..." 
                value={searchTerm} 
                onValueChange={setSearchTerm}
              />
              {isSearching && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2">Pesquisando...</span>
                </div>
              )}
              <CommandEmpty>
                {debouncedSearchTerm && debouncedSearchTerm.length > 1
                  ? "Nenhum usuário encontrado."
                  : "Digite pelo menos 2 caracteres para pesquisar."}
              </CommandEmpty>
              <CommandGroup>
                {searchResults.map((user) => (
                  <CommandItem 
                    key={user.id} 
                    value={user.name}
                    onSelect={() => handleUserSelect(user)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-muted w-7 h-7 rounded-full flex items-center justify-center">
                        <UserIcon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                    
                    {selectedUser && selectedUser.id === user.id && (
                      <Check className="h-4 w-4" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
            
            {selectedUser && (
              <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                <Badge variant="outline" className="flex gap-1 items-center">
                  <UserIcon className="h-3 w-3" />
                  <span>{selectedUser.name}</span>
                  <button 
                    onClick={() => setSelectedUser(null)} 
                    className="ml-1 hover:bg-muted rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseCollaboratorDialog}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAddSelectedCollaborator} 
              disabled={!selectedUser}
            >
              Adicionar Colaborador
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval request dialog */}
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar Aprovação do Curso</DialogTitle>
            <DialogDescription>
              Envie este curso para aprovação por um gerente.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
            <div>
              <label htmlFor="comments" className="text-sm font-medium mb-1 block">
                Comentários (opcional)
              </label>
              <Textarea
                id="comments"
                value={approvalData.comments}
                onChange={(e) =>
                  setApprovalData({ ...approvalData, comments: e.target.value })
                }
                placeholder="Informações adicionais para o aprovador..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsApprovalDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmitForApproval}
              disabled={managers.length === 0}
            >
              Enviar para Aprovação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
