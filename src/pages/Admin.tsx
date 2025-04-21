import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserStore, User, UserRole, DepartmentName } from "@/store/userStore";
import { useCourseStore, ApprovalRequest } from "@/store/courseStore";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { UserPlus, Edit, Trash, Users, BookOpen, CheckCheck, Shield, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const { users, currentUser, addUser, updateUser, deleteUser, assignUserToCourse, removeUserFromCourse, assignUserToManager, removeUserFromManager, getManagedUsers } = useUserStore();
  const { courses, approvalRequests, respondToApprovalRequest, getPendingApprovals, getCourseById } = useCourseStore();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isAssignCourseDialogOpen, setIsAssignCourseDialogOpen] = useState(false);
  const [isAssignManagerDialogOpen, setIsAssignManagerDialogOpen] = useState(false);
  const [isApprovalDetailsDialogOpen, setIsApprovalDetailsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedManagerId, setSelectedManagerId] = useState<string>("");
  const [selectedApprovalRequest, setSelectedApprovalRequest] = useState<ApprovalRequest | null>(null);
  const [approvalResponse, setApprovalResponse] = useState({
    isApproved: true,
    comments: ""
  });
  const navigate = useNavigate();

  // Form state for adding/editing users
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student" as UserRole,
    department: "" as DepartmentName | undefined,
  });

  // If not authenticated or not admin, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Get pending approvals if current user is a manager
  const pendingApprovals = currentUser.role === 'manager' || currentUser.role === 'admin'
    ? getPendingApprovals(currentUser.id)
    : [];

  // Get managed users
  const managedUsersList = currentUser.role === 'manager'
    ? getManagedUsers(currentUser.id)
    : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = () => {
    addUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      department: formData.department || undefined,
    });
    setIsAddUserDialogOpen(false);
    resetForm();
  };

  const handleEditUser = () => {
    if (selectedUser) {
      updateUser(selectedUser.id, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department || undefined,
        ...(formData.password ? { password: formData.password } : {}),
      });
      setIsEditUserDialogOpen(false);
      resetForm();
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser.id) {
      toast.error("Você não pode excluir sua própria conta");
      return;
    }
    deleteUser(userId);
  };

  const handleAssignCourse = () => {
    if (selectedUser && selectedCourseId) {
      assignUserToCourse(selectedUser.id, selectedCourseId);
      setIsAssignCourseDialogOpen(false);
      setSelectedCourseId("");
    }
  };

  const handleRemoveCourse = (userId: string, courseId: string) => {
    removeUserFromCourse(userId, courseId);
  };

  const handleAssignManager = () => {
    if (selectedUser && selectedManagerId) {
      assignUserToManager(selectedUser.id, selectedManagerId);
      setIsAssignManagerDialogOpen(false);
      setSelectedManagerId("");
    }
  };

  const handleRemoveFromManager = (userId: string, managerId: string) => {
    removeUserFromManager(userId, managerId);
  };
  
  const handleApprovalRequestResponse = () => {
    if (!selectedApprovalRequest) return;
    
    respondToApprovalRequest(
      selectedApprovalRequest.id,
      approvalResponse.isApproved,
      approvalResponse.comments
    );
    
    setIsApprovalDetailsDialogOpen(false);
    setApprovalResponse({ isApproved: true, comments: "" });
    toast.success("Resposta enviada com sucesso");
  };

  const openEditUserDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      department: user.department,
    });
    setIsEditUserDialogOpen(true);
  };

  const openAssignCourseDialog = (user: User) => {
    setSelectedUser(user);
    setIsAssignCourseDialogOpen(true);
  };
  
  const openAssignManagerDialog = (user: User) => {
    setSelectedUser(user);
    setIsAssignManagerDialogOpen(true);
  };
  
  const openApprovalDetailsDialog = (approval: ApprovalRequest) => {
    setSelectedApprovalRequest(approval);
    setApprovalResponse({ isApproved: true, comments: "" });
    setIsApprovalDetailsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "student",
      department: undefined,
    });
    setSelectedUser(null);
  };
  
  const getApprovalTypeLabel = (type: string) => {
    switch(type) {
      case 'curso_completo': return 'Curso Completo';
      case 'estrutura': return 'Estrutura do Curso';
      case 'modulo': return 'Módulo Específico';
      case 'aula': return 'Aula Específica';
      default: return type;
    }
  };

  const departmentOptions: DepartmentName[] = ['Marketing', 'Vendas', 'RH', 'TI', 'Operações'];
  const roleOptions: { label: string; value: UserRole }[] = [
    { label: "Administrador", value: "admin" },
    { label: "Gerente", value: "manager" },
    { label: "Instrutor", value: "instructor" },
    { label: "Estudante", value: "student" },
  ];

  const getUserAssignedCourses = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user || !user.assignedCourses) return [];
    
    return user.assignedCourses.map(courseId => {
      const course = courses.find(c => c.id === courseId);
      return course ? { id: courseId, name: course.name } : null;
    }).filter(Boolean);
  };
  
  const getUserManagers = (userId: string) => {
    return users.filter(user => 
      user.managedUsers?.includes(userId)
    );
  };
  
  const getManagersOptions = () => {
    return users.filter(user => user.role === 'manager');
  };

  // Show different content based on the user's role
  const renderContent = () => {
    // Admin sees full administration
    if (currentUser.role === 'admin') {
      return (
        <>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Administração</h1>
              <p className="text-muted-foreground">
                Gerencie usuários, departamentos e atribuições de cursos.
              </p>
            </div>
            <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <UserPlus className="h-5 w-5" />
                  <span>Adicionar Usuário</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                  <DialogDescription>
                    Preencha os dados para criar um novo usuário no sistema.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nome completo"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Senha"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Função</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value as UserRole }))}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Selecione a função" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="department">Departamento</Label>
                    <Select
                      value={formData.department || ""}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value as DepartmentName }))}
                    >
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Selecione o departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Nenhum</SelectItem>
                        {departmentOptions.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddUser}>Adicionar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>

          <Tabs defaultValue="users" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Usuários</span>
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Atribuições de Cursos</span>
              </TabsTrigger>
              <TabsTrigger value="managers" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Gerentes</span>
              </TabsTrigger>
              <TabsTrigger value="approvals" className="flex items-center gap-2">
                <CheckCheck className="h-4 w-4" />
                <span>Aprovações</span>
                {pendingApprovals.length > 0 && (
                  <Badge variant="destructive" className="ml-1">{pendingApprovals.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Usuários do Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Função</TableHead>
                        <TableHead>Departamento</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'admin' ? 'default' : user.role === 'manager' ? 'warning' : user.role === 'instructor' ? 'secondary' : 'outline'}>
                              {
                                user.role === 'admin' 
                                  ? 'Administrador' 
                                  : user.role === 'manager'
                                    ? 'Gerente'
                                    : user.role === 'instructor' 
                                      ? 'Instrutor' 
                                      : 'Estudante'
                              }
                            </Badge>
                          </TableCell>
                          <TableCell>{user.department || "Não atribuído"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditUserDialog(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={user.id === currentUser.id}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="courses">
              <Card>
                <CardHeader>
                  <CardTitle>Atribuições de Cursos</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Departamento</TableHead>
                        <TableHead>Cursos Atribuídos</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.department || "Não atribuído"}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {getUserAssignedCourses(user.id).map((course) => (
                                course && (
                                  <Badge key={course.id} variant="outline" className="flex items-center gap-1">
                                    {course.name}
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-4 w-4 ml-1"
                                      onClick={() => handleRemoveCourse(user.id, course.id)}
                                    >
                                      <Trash className="h-3 w-3" />
                                    </Button>
                                  </Badge>
                                )
                              ))}
                              {(!user.assignedCourses || user.assignedCourses.length === 0) && (
                                <span className="text-muted-foreground text-sm italic">Nenhum curso atribuído</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openAssignCourseDialog(user)}
                            >
                              Atribuir Curso
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="managers">
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciamento de Equipes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Função</TableHead>
                        <TableHead>Departamento</TableHead>
                        <TableHead>Gerentes</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.filter(user => user.role !== 'admin').map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'manager' ? 'warning' : user.role === 'instructor' ? 'secondary' : 'outline'}>
                              {
                                user.role === 'manager'
                                  ? 'Gerente'
                                  : user.role === 'instructor' 
                                    ? 'Instrutor' 
                                    : 'Estudante'
                              }
                            </Badge>
                          </TableCell>
                          <TableCell>{user.department || "Não atribuído"}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {getUserManagers(user.id).map((manager) => (
                                <Badge key={manager.id} variant="outline" className="flex items-center gap-1">
                                  {manager.name}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 ml-1"
                                    onClick={() => handleRemoveFromManager(user.id, manager.id)}
                                  >
                                    <Trash className="h-3 w-3" />
                                  </Button>
                                </Badge>
                              ))}
                              {getUserManagers(user.id).length === 0 && (
                                <span className="text-muted-foreground text-sm italic">Nenhum gerente atribuído</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openAssignManagerDialog(user)}
                            >
                              Atribuir Gerente
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="approvals">
              <Card>
                <CardHeader>
                  <CardTitle>Solicitações de Aprovação</CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingApprovals.length === 0 ? (
                    <div className="text-center p-8">
                      <h3 className="text-lg font-medium mb-2">Nenhuma solicitação pendente</h3>
                      <p className="text-muted-foreground">
                        Não há solicitações de aprovação pendentes para você neste momento.
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Curso</TableHead>
                          <TableHead>Solicitante</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingApprovals.map((approval) => {
                          const course = getCourseById(approval.courseId);
                          const requestedBy = users.find(user => user.id === approval.requestedBy);
                          
                          return (
                            <TableRow key={approval.id}>
                              <TableCell className="font-medium">
                                {course ? course.name : "Curso não encontrado"}
                              </TableCell>
                              <TableCell>
                                {requestedBy ? requestedBy.name : "Usuário desconhecido"}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {getApprovalTypeLabel(approval.approvalType)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(approval.requestDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openApprovalDetailsDialog(approval)}
                                  >
                                    Revisar
                                  </Button>
                                  {course && (
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => navigate(`/courses/${course.id}`)}
                                    >
                                      Ver Curso
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      );
    }
    // Manager sees only their managed users and approvals
    else if (currentUser.role === 'manager') {
      return (
        <>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-bold tracking-tight">Painel do Gerente</h1>
            <p className="text-muted-foreground">
              Gerencie sua equipe e aprove solicitações.
            </p>
          </motion.div>
          
          <Tabs defaultValue={pendingApprovals.length > 0 ? "approvals" : "team"} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="team" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Minha Equipe</span>
              </TabsTrigger>
              <TabsTrigger value="approvals" className="flex items-center gap-2">
                <CheckCheck className="h-4 w-4" />
                <span>Aprovações</span>
                {pendingApprovals.length > 0 && (
                  <Badge variant="destructive" className="ml-1">{pendingApprovals.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <CardTitle>Membros da Equipe</CardTitle>
                </CardHeader>
                <CardContent>
                  {managedUsersList.length === 0 ? (
                    <div className="text-center p-8">
                      <h3 className="text-lg font-medium mb-2">Nenhum membro na equipe</h3>
                      <p className="text-muted-foreground">
                        Você ainda não tem membros atribuídos à sua equipe.
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Função</TableHead>
                          <TableHead>Departamento</TableHead>
                          <TableHead>Cursos Atribuídos</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {managedUsersList.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={user.role === 'instructor' ? 'secondary' : 'outline'}>
                                {user.role === 'instructor' ? 'Instrutor' : 'Estudante'}
                              </Badge>
                            </TableCell>
                            <TableCell>{user.department || "Não atribuído"}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {getUserAssignedCourses(user.id).map((course) => (
                                  course && (
                                    <Badge key={course.id} variant="outline">
                                      {course.name}
                                    </Badge>
                                  )
                                ))}
                                {(!user.assignedCourses || user.assignedCourses.length === 0) && (
                                  <span className="text-muted-foreground text-sm italic">Nenhum curso</span>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="approvals">
              <Card>
                <CardHeader>
                  <CardTitle>Solicitações de Aprovação</CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingApprovals.length === 0 ? (
                    <div className="text-center p-8">
                      <h3 className="text-lg font-medium mb-2">Nenhuma solicitação pendente</h3>
                      <p className="text-muted-foreground">
                        Não há solicitações de aprovação pendentes para você neste momento.
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Curso</TableHead>
                          <TableHead>Solicitante</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingApprovals.map((approval) => {
                          const course = getCourseById(approval.courseId);
                          const requestedBy = users.find(user => user.id === approval.requestedBy);
                          
                          return (
                            <TableRow key={approval.id}>
                              <TableCell className="font-medium">
                                {course ? course.name : "Curso não encontrado"}
                              </TableCell>
                              <TableCell>
                                {requestedBy ? requestedBy.name : "Usuário desconhecido"}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {getApprovalTypeLabel(approval.approvalType)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(approval.requestDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openApprovalDetailsDialog(approval)}
                                  >
                                    Revisar
                                  </Button>
                                  {course && (
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => navigate(`/courses/${course.id}`)}
                                    >
                                      Ver Curso
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      );
    }
    // Other users see limited view
    else {
      return (
        <div className="container mx-auto py-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Limitado</h1>
          <p className="mb-4 text-muted-foreground">
            Você não tem permissão para acessar o painel de administração.
          </p>
          <Button onClick={() => navigate("/")}>Voltar para o Dashboard</Button>
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto py-6">
      {renderContent()}

      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize os dados do usuário.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-password">Nova Senha (deixe em branco para manter a atual)</Label>
              <Input
                id="edit-password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Nova senha"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Função</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value as UserRole }))}
              >
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-department">Departamento</Label>
              <Select
                value={formData.department || ""}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value as DepartmentName || undefined }))}
              >
                <SelectTrigger id="edit-department">
                  <SelectValue placeholder="Selecione o departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  {departmentOptions.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditUser}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Course Dialog */}
      <Dialog open={isAssignCourseDialogOpen} onOpenChange={setIsAssignCourseDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Atribuir Curso</DialogTitle>
            <DialogDescription>
              Selecione um curso para atribuir ao usuário {selectedUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um curso" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignCourseDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAssignCourse} disabled={!selectedCourseId}>
              Atribuir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Assign Manager Dialog */}
      <Dialog open={isAssignManagerDialogOpen} onOpenChange={setIsAssignManagerDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Atribuir Gerente</DialogTitle>
            <DialogDescription>
              Selecione um gerente para o usuário {selectedUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedManagerId} onValueChange={setSelectedManagerId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um gerente" />
              </SelectTrigger>
              <SelectContent>
                {getManagersOptions().map((manager) => (
                  <SelectItem key={manager.id} value={manager.id}>
                    {manager.name} ({manager.department || 'Sem departamento'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignManagerDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAssignManager} disabled={!selectedManagerId}>
              Atribuir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Approval Details Dialog */}
      <Dialog open={isApprovalDetailsDialogOpen} onOpenChange={setIsApprovalDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Revisar Solicitação</DialogTitle>
            <DialogDescription>
              Revise e responda à solicitação de aprovação.
            </DialogDescription>
          </DialogHeader>
          
          {selectedApprovalRequest && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1">Curso</h4>
                  <p>{getCourseById(selectedApprovalRequest.courseId)?.name || "Curso não encontrado"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">Solicitante</h4>
                  <p>{users.find(u => u.id === selectedApprovalRequest.requestedBy)?.name || "Usuário desconhecido"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">Tipo</h4>
                  <p>{getApprovalTypeLabel(selectedApprovalRequest.approvalType)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">Data da Solicitação</h4>
                  <p>{new Date(selectedApprovalRequest.requestDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              {selectedApprovalRequest.comments && (
                <div className="mb-4 p-3 bg-muted rounded-md">
                  <h4 className="text-sm font-semibold mb-1">Comentários do solicitante</h4>
                  <p className="text-sm">{selectedApprovalRequest.comments}</p>
                </div>
              )}
              
              <div className="space-y-4 mt-6">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Sua resposta</h4>
                  
                  <Select 
                    value={approvalResponse.isApproved ? "approve" : "reject"}
                    onValueChange={(value) => setApprovalResponse({...approvalResponse, isApproved: value === "approve"})}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approve">Aprovar</SelectItem>
                      <SelectItem value="reject">Rejeitar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="approval-comments">Comentários (opcional)</Label>
                  <Textarea
                    id="approval-comments"
                    placeholder="Adicione comentários sobre sua decisão"
                    value={approvalResponse.comments}
                    onChange={(e) => setApprovalResponse({...approvalResponse, comments: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApprovalDetailsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleApprovalRequestResponse}
              variant={approvalResponse.isApproved ? "default" : "destructive"}
            >
              {approvalResponse.isApproved ? "Aprovar" : "Rejeitar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
