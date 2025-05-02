
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Course, ApprovalItemType } from "@/store/courseStore";
import { User } from "@/store/userStore";
import { Search, UserRound } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import { toast } from "sonner";

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
  handleSubmitForApproval,
}: CourseDialogsProps) => {
  const { searchUsers } = useSupabase();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Search users when query changes with debounce
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery && searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchUsers(searchQuery);
          if (Array.isArray(results)) {
            setSearchResults(results);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          toast.error("Erro ao buscar usuários");
          console.error(error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchUsers]);

  return (
    <>
      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir este curso? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Collaborator Dialog */}
      <Dialog open={isCollaboratorDialogOpen} onOpenChange={setIsCollaboratorDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Colaborador</DialogTitle>
            <DialogDescription>
              Adicione colaboradores para trabalhar neste curso.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Buscar usuário</Label>
              <div className="relative">
                <Input
                  placeholder="Digite um nome para buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
              
              {/* Search results */}
              {isSearching ? (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  Buscando...
                </div>
              ) : (
                searchResults.length > 0 && (
                  <div className="border rounded-md max-h-60 overflow-y-auto">
                    <div className="p-2 text-xs text-muted-foreground border-b">
                      Selecione um usuário
                    </div>
                    {searchResults.map((user) => (
                      <button 
                        key={user.id} 
                        className="flex items-center gap-2 p-2 hover:bg-muted w-full text-left"
                        onClick={() => {
                          setCollaboratorEmail(user.email);
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                      >
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserRound className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )
              )}
              
              {searchResults.length === 0 && searchQuery.length >= 2 && !isSearching && (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  Nenhum usuário encontrado. Tente outro termo de busca.
                </div>
              )}
              
              <div className="mt-2">
                <Label htmlFor="email">Email do colaborador selecionado</Label>
                <Input
                  id="email"
                  value={collaboratorEmail}
                  onChange={(e) => setCollaboratorEmail(e.target.value)}
                  placeholder="Digite o email do colaborador"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsCollaboratorDialogOpen(false)} variant="outline">
              Cancelar
            </Button>
            <Button onClick={handleAddCollaborator}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Solicitar Aprovação</DialogTitle>
            <DialogDescription>
              Envie este curso para aprovação.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="comments">Comentários (opcional)</Label>
              <Textarea
                id="comments"
                placeholder="Adicione comentários ou instruções para o aprovador"
                value={approvalData.comments}
                onChange={(e) =>
                  setApprovalData({ ...approvalData, comments: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsApprovalDialogOpen(false)} variant="outline">
              Cancelar
            </Button>
            <Button onClick={handleSubmitForApproval}>Enviar para Aprovação</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
