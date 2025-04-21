
import { useState } from "react";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { UserPlus, Users, Building, BookOpen } from "lucide-react";
import { useCourseStore } from "@/store/courseStore";

const Admin = () => {
  const { users, departments } = useUserStore();
  const { courses } = useCourseStore();
  const [activeTab, setActiveTab] = useState("overview");

  // Function to get users grouped by department
  const getUsersByDepartment = () => {
    if (!departments) return [];
    
    const departmentCounts = departments.map(dept => {
      const usersInDept = users.filter(user => user.department === dept.name);
      return {
        name: dept.name,
        count: usersInDept.length,
        color: dept.color || "#0ea5e9"
      };
    });
    
    return departmentCounts;
  };

  // Function to get courses grouped by status
  const getCoursesByStatus = () => {
    const statusCounts: Record<string, number> = {};
    
    courses.forEach(course => {
      if (statusCounts[course.status]) {
        statusCounts[course.status]++;
      } else {
        statusCounts[course.status] = 1;
      }
    });
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      count,
      color: getStatusColor(status)
    }));
  };
  
  // Function to get color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Rascunho": return "#94a3b8";
      case "Em andamento": return "#3b82f6";
      case "Concluído": return "#22c55e";
      case "Em aprovação": return "#eab308";
      case "Aprovado": return "#10b981";
      case "Revisão solicitada": return "#ef4444";
      default: return "#6366f1";
    }
  };

  // Get data for charts
  const departmentData = getUsersByDepartment();
  const statusData = getCoursesByStatus();
  
  // Calculate total users and courses
  const totalUsers = users.length;
  const totalCourses = courses.length;
  const totalDepartments = departments.length;
  
  // Calculate average modules per course
  const avgModules = courses.length > 0 
    ? (courses.reduce((sum, course) => sum + course.modules.length, 0) / courses.length).toFixed(1) 
    : "0";

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Administração</h1>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="courses">Cursos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Usuários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-primary mr-2" />
                  <div className="text-2xl font-bold">{totalUsers}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Cursos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-primary mr-2" />
                  <div className="text-2xl font-bold">{totalCourses}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Departamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Building className="h-5 w-5 text-primary mr-2" />
                  <div className="text-2xl font-bold">{totalDepartments}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Média de Módulos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-primary mr-2" />
                  <div className="text-2xl font-bold">{avgModules}</div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Usuários por Departamento</CardTitle>
                <CardDescription>
                  Distribuição de usuários entre departamentos
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Cursos por Status</CardTitle>
                <CardDescription>
                  Distribuição de cursos por status
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={statusData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Quantidade">
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Gerenciamento de Usuários</h2>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Adicionar Usuário</span>
            </Button>
          </div>
          
          {/* User management content will go here */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Usuários</CardTitle>
              <CardDescription>
                Gerencie todos os usuários da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Funcionalidade em desenvolvimento. Em breve você poderá gerenciar usuários aqui.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="courses" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Gerenciamento de Cursos</h2>
            <Button className="gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Ver Todos os Cursos</span>
            </Button>
          </div>
          
          {/* Course management content will go here */}
          <Card>
            <CardHeader>
              <CardTitle>Aprovações Pendentes</CardTitle>
              <CardDescription>
                Cursos aguardando aprovação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Funcionalidade em desenvolvimento. Em breve você poderá gerenciar aprovações de cursos aqui.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
