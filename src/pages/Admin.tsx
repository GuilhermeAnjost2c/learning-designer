
import { useState, useEffect } from "react";
import { useUserStore, User, UserRole, DepartmentName } from "@/store/userStore";
import { useCourseStore, ApprovalRequest } from "@/store/courseStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UserPlus, Edit, Trash, RefreshCw, CheckCircle, XCircle,
  Eye, AlertCircle, Clock, CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

const Admin = () => {
  const { users, fetchUsers, addUser, updateUser, deleteUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    role: "student" as UserRole,
    department: "TI" as DepartmentName
  });
  
  // Approval requests management
  const { courses } = useCourseStore();
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([]);
  
  useEffect(() => {
    const loadData = async () => {
      await fetchUsers();
      
      // Collect all approval requests from courses
      const allRequests: ApprovalRequest[] = [];
      courses.forEach(course => {
        if (course.approvalRequests && Array.isArray(course.approvalRequests)) {
          course.approvalRequests.forEach(request => {
            allRequests.push({
              ...request,
              courseId: course.id
            } as unknown as ApprovalRequest);
          });
        }
      });
      
      setApprovalRequests(allRequests);
      setIsLoading(false);
    };
    
    loadData();
  }, [fetchUsers, courses]);
  
  const handleAddUser = async () => {
    // Validate fields
    if (!newUserData.name || !newUserData.email) {
      toast.error("Nome e e-mail são obrigatórios");
      return;
    }
    
    try {
      // In a real app, we would create the user in Supabase
      await addUser(newUserData);
      toast.success("Usuário adicionado com sucesso!");
      setAddUserDialogOpen(false);
      setNewUserData({
        name: "",
        email: "",
        role: "student",
        department: "TI"
      });
    } catch (error) {
      toast.error("Erro ao adicionar usuário");
    }
  };
  
  const handleEditUser = async () => {
    if (!userToEdit || !userToEdit.name || !userToEdit.email) {
      toast.error("Nome e e-mail são obrigatórios");
      return;
    }
    
    try {
      await updateUser(userToEdit.id, userToEdit);
      toast.success("Usuário atualizado com sucesso!");
      setEditUserDialogOpen(false);
      setUserToEdit(null);
    } catch (error) {
      toast.error("Erro ao atualizar usuário");
    }
  };
  
  const handleDeleteUser = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await deleteUser(id);
        toast.success("Usuário excluído com sucesso!");
      } catch (error) {
        toast.error("Erro ao excluir usuário");
      }
    }
  };
  
  const openEditDialog = (user: User) => {
    setUserToEdit({...user});
    setEditUserDialogOpen(true);
  };
  
  const renderRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return "Administrador";
      case 'instructor':
        return "Instrutor";
      case 'student':
        return "Aluno";
      case 'manager':
        return "Gerente";
      default:
        return role;
    }
  };
  
  const handleApproveRequest = (requestId: string) => {
    // Implementation would update the approval status
    toast.success("Aprovação concluída!");
  };
  
  const handleRejectRequest = (requestId: string) => {
    // Implementation would update the approval status
    toast.success("Solicitação rejeitada");
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Pendente':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800"><Clock className="mr-1 h-3 w-3" /> Pendente</span>;
      case 'Aprovado':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800"><CheckCircle2 className="mr-1 h-3 w-3" /> Aprovado</span>;
      case 'Rejeitado':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-red-100 text-red-800"><XCircle className="mr-1 h-3 w-3" /> Rejeitado</span>;
      default:
        return <span>{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>
      
      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="approvals">Aprovações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Gerenciamento de Usuários</h2>
            <Button onClick={() => setAddUserDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{renderRoleLabel(user.role)}</TableCell>
                      <TableCell>{user.department || '-'}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="approvals">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Solicitações de Aprovação</h2>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Curso</TableHead>
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvalRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      Nenhuma solicitação de aprovação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  approvalRequests.map((request) => {
                    const course = courses.find(c => c.id === request.courseId);
                    return (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{course?.name || 'Curso desconhecido'}</TableCell>
                        <TableCell>
                          {users.find(u => u.id === request.requestedBy)?.name || 'Usuário desconhecido'}
                        </TableCell>
                        <TableCell>
                          {request.approval_type === 'curso_completo' ? 'Curso completo' : 
                           request.approval_type === 'estrutura' ? 'Estrutura' :
                           request.approval_type === 'modulo' ? 'Módulo' : 'Aula'}
                        </TableCell>
                        <TableCell>
                          {new Date(request.request_date).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(request.status)}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          {request.status === 'Pendente' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-green-500 text-green-500 hover:bg-green-50"
                                onClick={() => handleApproveRequest(request.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Aprovar
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-red-500 text-red-500 hover:bg-red-50"
                                onClick={() => handleRejectRequest(request.id)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Rejeitar
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Add User Dialog */}
      <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input 
                id="name" 
                value={newUserData.name} 
                onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={newUserData.email} 
                onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Cargo</Label>
              <Select 
                value={newUserData.role} 
                onValueChange={(value) => setNewUserData({...newUserData, role: value as UserRole})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="manager">Gerente</SelectItem>
                  <SelectItem value="instructor">Instrutor</SelectItem>
                  <SelectItem value="student">Aluno</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Departamento</Label>
              <Select 
                value={newUserData.department} 
                onValueChange={(value) => setNewUserData({...newUserData, department: value as DepartmentName})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Vendas">Vendas</SelectItem>
                  <SelectItem value="RH">RH</SelectItem>
                  <SelectItem value="TI">TI</SelectItem>
                  <SelectItem value="Operações">Operações</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddUser}>
              Adicionar Usuário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={editUserDialogOpen} onOpenChange={setEditUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          {userToEdit && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nome</Label>
                <Input 
                  id="edit-name" 
                  value={userToEdit.name} 
                  onChange={(e) => setUserToEdit({...userToEdit, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  value={userToEdit.email} 
                  onChange={(e) => setUserToEdit({...userToEdit, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Cargo</Label>
                <Select 
                  value={userToEdit.role} 
                  onValueChange={(value) => setUserToEdit({...userToEdit, role: value as UserRole})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="manager">Gerente</SelectItem>
                    <SelectItem value="instructor">Instrutor</SelectItem>
                    <SelectItem value="student">Aluno</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-department">Departamento</Label>
                <Select 
                  value={userToEdit.department || ""} 
                  onValueChange={(value) => setUserToEdit({...userToEdit, department: value as DepartmentName})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Vendas">Vendas</SelectItem>
                    <SelectItem value="RH">RH</SelectItem>
                    <SelectItem value="TI">TI</SelectItem>
                    <SelectItem value="Operações">Operações</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUserDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditUser}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
