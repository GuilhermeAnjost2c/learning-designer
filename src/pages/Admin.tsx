import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserStore } from "@/store/userStore";
import { useCourseStore } from "@/store/courseStore";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Edit, Trash, Check, X, Eye, UserPlus, Users, BookOpen, CheckSquare } from "lucide-react";

import { UserRole, DepartmentName } from "@/store/userStore";

interface ApprovalRequestWithDetails {
  id: string;
  courseId: string;
  requestDate: Date;
  requestedBy: string;
  approverId: string;
  approvalType: string;
  itemId?: string;
  status: string;
  comments?: string;
  reviewDate?: Date;
}

const Admin = () => {
  const { users, addUser, updateUser, deleteUser, getUsersByDepartment } = useUserStore();
  const { courses, updateCourseStatus } = useCourseStore();
  const [selectedTab, setSelectedTab] = useState("users");
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student" as UserRole,
    department: undefined as DepartmentName | undefined,
  });
  const [courseFormData, setCourseFormData] = useState({
    status: "Rascunho",
  });
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [departmentFilter, setDepartmentFilter] = useState<DepartmentName | "all">("all");
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    if (departmentFilter === "all") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(getUsersByDepartment(departmentFilter));
    }
  }, [users, departmentFilter, getUsersByDepartment]);

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserFormData({
      ...userFormData,
      [name]: value,
    });
  };

  const handleCourseInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseFormData({
      ...courseFormData,
      [name]: value,
    });
  };

  const handleCreateUser = () => {
    addUser({
      name: userFormData.name,
      email: userFormData.email,
      password: userFormData.password,
      role: userFormData.role,
      department: userFormData.department,
    });
    closeUserDialog();
  };

  const handleUpdateUser = () => {
    if (selectedUser) {
      updateUser(selectedUser.id, {
        name: userFormData.name,
        email: userFormData.email,
        role: userFormData.role,
        department: userFormData.department,
      });
      closeUserDialog();
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setDeleteConfirmationOpen(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
      setDeleteConfirmationOpen(false);
      setUserToDelete(null);
    }
  };

  const cancelDeleteUser = () => {
    setDeleteConfirmationOpen(false);
    setUserToDelete(null);
  };

  const handleUpdateCourseStatus = () => {
    if (selectedCourse) {
      updateCourseStatus(selectedCourse.id, courseFormData.status as any);
      closeCourseDialog();
    }
  };

  const openUserDialog = (user = null) => {
    setSelectedUser(user);
    if (user) {
      setUserFormData({
        name: user.name,
        email: user.email,
        password: "", // Don't pre-fill password
        role: user.role,
        department: user.department,
      });
    } else {
      setUserFormData({
        name: "",
        email: "",
        password: "",
        role: "student",
        department: undefined,
      });
    }
    setIsUserDialogOpen(true);
  };

  const closeUserDialog = () => {
    setIsUserDialogOpen(false);
    setSelectedUser(null);
    setUserFormData({
      name: "",
      email: "",
      password: "",
      role: "student",
      department: undefined,
    });
  };

  const openCourseDialog = (course) => {
    setSelectedCourse(course);
    setCourseFormData({
      status: course.status,
    });
    setIsCourseDialogOpen(true);
  };

  const closeCourseDialog = () => {
    setIsCourseDialogOpen(false);
    setSelectedCourse(null);
    setCourseFormData({
      status: "Rascunho",
    });
  };

  const getRequestStatusBadge = (status: string) => {
    if (status === "pendente") {
      return <Badge variant="outline">Pendente</Badge>;
    } else if (status === "aprovado") {
      return <Badge variant="default">Aprovado</Badge>;
    } else {
      return <Badge variant="destructive">Rejeitado</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline">Pendente</Badge>;
      case 'aprovado':
        return <Badge variant="default">Aprovado</Badge>;
      case 'rejeitado':
        return <Badge variant="destructive">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Painel de Administração</CardTitle>
          <CardDescription>Gerencie usuários, cursos e outras configurações do sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={selectedTab} className="space-y-4" onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="users" className="focus:outline-none">Usuários</TabsTrigger>
              <TabsTrigger value="courses" className="focus:outline-none">Cursos</TabsTrigger>
              <TabsTrigger value="approvals" className="focus:outline-none">Aprovações</TabsTrigger>
            </TabsList>
            <TabsContent value="users" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Gerenciar Usuários</h2>
                <Button onClick={() => openUserDialog()} className="focus:outline-none">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Adicionar Usuário
                </Button>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <Label htmlFor="department-filter">Filtrar por Departamento:</Label>
                <Select value={departmentFilter} onValueChange={(value) => setDepartmentFilter(value as DepartmentName | "all")}>
                  <SelectTrigger id="department-filter">
                    <SelectValue placeholder="Todos os Departamentos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Departamentos</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Vendas">Vendas</SelectItem>
                    <SelectItem value="RH">RH</SelectItem>
                    <SelectItem value="TI">TI</SelectItem>
                    <SelectItem value="Operações">Operações</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableCaption>Lista de usuários cadastrados no sistema.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.department || "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openUserDialog(user)}
                          className="focus:outline-none"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="focus:outline-none"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Excluir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="courses" className="space-y-4">
              <h2 className="text-xl font-semibold">Gerenciar Cursos</h2>
              <Table>
                <TableCaption>Lista de cursos cadastrados no sistema.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criador</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>
                        {getStatusBadge(course.status)}
                      </TableCell>
                      <TableCell>{users.find(user => user.id === course.createdBy)?.name || "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openCourseDialog(course)}
                          className="focus:outline-none"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar Status
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="approvals" className="space-y-4">
              <h2 className="text-xl font-semibold">Gerenciar Solicitações de Aprovação</h2>
              <Table>
                <TableCaption>Lista de solicitações de aprovação pendentes.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Curso</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Solicitante</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.flatMap(course => 
                    course.approvalRequests?.map(requestId => {
                      const request = (courses.flatMap(c => 
                        c.approvalRequests?.map(req => {
                          if (typeof req === 'string') return null;
                          return req;
                        })
                      ).filter(Boolean).find(req => req?.id === requestId)) as ApprovalRequestWithDetails | undefined;
                      
                      const requestedBy = users.find(user => user.id === request?.requestedBy);

                      return request ? (
                        <TableRow key={request.id}>
                          <TableCell>{course.name}</TableCell>
                          <TableCell>{request.approvalType}</TableCell>
                          <TableCell>{requestedBy?.name || "N/A"}</TableCell>
                          <TableCell>{getRequestStatusBadge(request.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="focus:outline-none">
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ) : null;
                    }) || []
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedUser ? "Editar Usuário" : "Criar Usuário"}</DialogTitle>
            <DialogDescription>
              {selectedUser
                ? "Atualize as informações do usuário."
                : "Crie um novo usuário para o sistema."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={userFormData.name}
                onChange={handleUserInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={userFormData.email}
                onChange={handleUserInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Senha
              </Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={userFormData.password}
                onChange={handleUserInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select value={userFormData.role} onValueChange={(value) => handleUserInputChange({ target: { name: 'role', value } } as any)}>
                <SelectTrigger id="role" className="col-span-3">
                  <SelectValue placeholder="Selecione um role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="instructor">Instrutor</SelectItem>
                  <SelectItem value="student">Estudante</SelectItem>
                  <SelectItem value="manager">Gerente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Departamento
              </Label>
              <Select 
                value={userFormData.department || "none"} 
                onValueChange={(value) => handleUserInputChange({ 
                  target: { 
                    name: 'department', 
                    value: value === "none" ? undefined : value 
                  } 
                } as any)}
              >
                <SelectTrigger id="department" className="col-span-3">
                  <SelectValue placeholder="Selecione um departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
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
            <Button type="button" variant="secondary" onClick={closeUserDialog}>
              Cancelar
            </Button>
            <Button type="submit" onClick={selectedUser ? handleUpdateUser : handleCreateUser}>
              {selectedUser ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Status do Curso</DialogTitle>
            <DialogDescription>
              Atualize o status do curso selecionado.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={courseFormData.status} onValueChange={(value) => handleCourseInputChange({ target: { name: 'status', value } } as any)}>
                <SelectTrigger id="status" className="col-span-3">
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rascunho">Rascunho</SelectItem>
                  <SelectItem value="Em andamento">Em andamento</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                  <SelectItem value="Em aprovação">Em aprovação</SelectItem>
                  <SelectItem value="Aprovado">Aprovado</SelectItem>
                  <SelectItem value="Revisão solicitada">Revisão solicitada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={closeCourseDialog}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleUpdateCourseStatus}>
              Atualizar Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteConfirmationOpen} onOpenChange={setDeleteConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá excluir o usuário permanentemente. Tem certeza que deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteUser}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;
