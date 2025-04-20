
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserStore, User, UserRole, DepartmentName } from "@/store/userStore";
import { useCourseStore, Course } from "@/store/courseStore";
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
import { Progress } from "@/components/ui/progress";
import { UserPlus, Edit, Trash, Users, BookOpen, Plus, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Admin = () => {
  const { users, currentUser, addUser, updateUser, deleteUser, assignUserToCourse, removeUserFromCourse } = useUserStore();
  const { courses, addCollaborator, removeCollaborator } = useCourseStore();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isAssignCourseDialogOpen, setIsAssignCourseDialogOpen] = useState(false);
  const [isCollaboratorDialogOpen, setIsCollaboratorDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState<string>("");

  // Form state for adding/editing users
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student" as UserRole,
    department: "" as DepartmentName | undefined,
  });

  // If not authenticated or not admin, redirect to login
  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = () => {
    try {
      addUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        department: formData.department || undefined,
      });
      setIsAddUserDialogOpen(false);
      toast.success("Usuário adicionado com sucesso");
      resetForm();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao adicionar usuário");
      }
    }
  };

  const handleEditUser = () => {
    if (selectedUser) {
      try {
        updateUser(selectedUser.id, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          department: formData.department || undefined,
          ...(formData.password ? { password: formData.password } : {}),
        });
        setIsEditUserDialogOpen(false);
        toast.success("Usuário atualizado com sucesso");
        resetForm();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Erro ao atualizar usuário");
        }
      }
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser.id) {
      toast.error("Você não pode excluir sua própria conta");
      return;
    }
    deleteUser(userId);
    toast.success("Usuário excluído com sucesso");
  };

  const handleAssignCourse = () => {
    if (selectedUser && selectedCourseId) {
      assignUserToCourse(selectedUser.id, selectedCourseId);
      setIsAssignCourseDialogOpen(false);
      toast.success("Curso atribuído com sucesso");
      setSelectedCourseId("");
    }
  };

  const handleRemoveCourse = (userId: string, courseId: string) => {
    removeUserFromCourse(userId, courseId);
    toast.success("Curso removido com sucesso");
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

  const openCollaboratorDialog = (course: Course) => {
    setSelectedCourse(course);
    setIsCollaboratorDialogOpen(true);
  };

  const handleAddCollaborator = () => {
    if (selectedCourse && selectedCollaboratorId) {
      addCollaborator(selectedCourse.id, selectedCollaboratorId);
      toast.success("Colaborador adicionado com sucesso");
      setSelectedCollaboratorId("");
    }
  };

  const handleRemoveCollaborator = (courseId: string, userId: string) => {
    removeCollaborator(courseId, userId);
    toast.success("Colaborador removido com sucesso");
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

  const departmentOptions: DepartmentName[] = ['Marketing', 'Vendas', 'RH', 'TI', 'Operações'];
  const roleOptions: { label: string; value: UserRole }[] = [
    { label: "Administrador", value: "admin" },
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

  const getCourseCollaborators = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course || !course.collaborators) return [];
    
    return course.collaborators.map(userId => {
      const user = users.find(u => u.id === userId);
      return user ? { id: userId, name: user.name, email: user.email } : null;
    }).filter(Boolean);
  };

  return (
    <div className="container mx-auto py-6">
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
          <TabsTrigger value="collaborators" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span>Colaboradores</span>
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
                        <Badge variant={user.role === 'admin' ? 'default' : user.role === 'instructor' ? 'secondary' : 'outline'}>
                          {
                            user.role === 'admin' 
                              ? 'Administrador' 
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
        
        <TabsContent value="collaborators">
          <Card>
            <CardHeader>
              <CardTitle>Colaboradores de Cursos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Curso</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Colaboradores</TableHead>
                    <TableHead>Progresso</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => {
                    const progress = useCourseStore.getState().getCourseProgress(course.id);
                    
                    return (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.name}</TableCell>
                        <TableCell>
                          {course.departmentId || "Não atribuído"}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {getCourseCollaborators(course.id).map((user) => (
                              user && (
                                <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
                                  {user.name}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 ml-1"
                                    onClick={() => handleRemoveCollaborator(course.id, user.id)}
                                  >
                                    <Trash className="h-3 w-3" />
                                  </Button>
                                </Badge>
                              )
                            ))}
                            {(!course.collaborators || course.collaborators.length === 0) && (
                              <span className="text-muted-foreground text-sm italic">Nenhum colaborador</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span>Progresso:</span>
                              <span>{progress.percentage}%</span>
                            </div>
                            <Progress value={progress.percentage} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openCollaboratorDialog(course)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Adicionar
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
      
      {/* Add Collaborator Dialog */}
      <Dialog open={isCollaboratorDialogOpen} onOpenChange={setIsCollaboratorDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Colaborador</DialogTitle>
            <DialogDescription>
              Selecione um usuário para adicionar como colaborador ao curso {selectedCourse?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedCollaboratorId} onValueChange={setSelectedCollaboratorId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um usuário" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCollaboratorDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddCollaborator} disabled={!selectedCollaboratorId}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
