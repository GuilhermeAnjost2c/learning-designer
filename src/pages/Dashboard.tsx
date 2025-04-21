
import { useEffect, useState } from "react";
import { PlusCircle, Grid3X3, List, Tag, X, Folder, Users, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/courses/CourseCard";
import { useCourseStore, CourseStatus, LessonStatus } from "@/store/courseStore";
import { useUserStore, UserRole } from "@/store/userStore";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { sampleCourses } from "@/utils/sampleData";
import { AddCourseButton } from "@/components/courses/AddCourseButton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const Dashboard = () => {
  const { courses, addCourse } = useCourseStore();
  const { users, currentUser } = useUserStore();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Add sample courses if there are none (for demo purposes)
  useEffect(() => {
    if (courses.length === 0) {
      // Adicionar cursos de demonstração com tags padrão
      sampleCourses.forEach((course, index) => {
        const defaultTags = [];
        if (index % 2 === 0) defaultTags.push("Desenvolvimento");
        if (index % 3 === 0) defaultTags.push("Liderança");
        if (index % 4 === 0) defaultTags.push("Marketing");
        
        addCourse({
          name: course.name,
          description: course.description,
          objectives: course.objectives,
          targetAudience: course.targetAudience,
          estimatedDuration: course.estimatedDuration,
          thumbnail: course.thumbnail,
          modules: course.modules,
          tags: defaultTags,
        });
      });
    }
  }, [courses.length, addCourse]);

  const handleAddCourse = () => {
    navigate("/courses/new");
  };

  // Get all unique tags across all courses
  const allTags = courses.reduce((acc, course) => {
    if (course.tags) {
      course.tags.forEach(tag => {
        if (!acc.includes(tag)) {
          acc.push(tag);
        }
      });
    }
    return acc;
  }, [] as string[]);

  // Filter courses by selected tag
  const filteredCourses = selectedTag 
    ? courses.filter(course => course.tags && course.tags.includes(selectedTag))
    : courses;

  // Calculate course status statistics
  const courseStatusStats = courses.reduce((acc, course) => {
    acc[course.status] = (acc[course.status] || 0) + 1;
    return acc;
  }, {} as Record<CourseStatus, number>);

  const courseStatusData = Object.entries(courseStatusStats).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  // Calculate lesson status statistics across all courses
  const lessonStatusStats = courses.reduce((acc, course) => {
    course.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        acc[lesson.status] = (acc[lesson.status] || 0) + 1;
      });
    });
    return acc;
  }, {} as Record<LessonStatus, number>);

  const lessonStatusData = Object.entries(lessonStatusStats).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  // User statistics
  const userRoleStats = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<UserRole, number>);

  const userRoleData = Object.entries(userRoleStats).map(([role, count]) => ({
    name: role === 'admin' 
      ? 'Administrador' 
      : role === 'instructor' 
        ? 'Instrutor' 
        : 'Estudante',
    value: count,
  }));

  // Department statistics
  const departmentStats = users.reduce((acc, user) => {
    if (user.department) {
      acc[user.department] = (acc[user.department] || 0) + 1;
    } else {
      acc['Sem departamento'] = (acc['Sem departamento'] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const departmentData = Object.entries(departmentStats).map(([dept, count]) => ({
    name: dept,
    count: count,
  }));

  // Define chart colors
  const CHART_COLORS = ['#9b87f5', '#7E69AB', '#D6BCFA', '#33C3F0', '#ea384c'];
  
  const COURSE_STATUS_COLORS: Record<CourseStatus, string> = {
    'Rascunho': '#8E9196',
    'Em andamento': '#9b87f5',
    'Concluído': '#33C3F0',
  };
  
  const LESSON_STATUS_COLORS: Record<LessonStatus, string> = {
    'Fazer': '#8E9196',
    'Fazendo': '#9b87f5',
    'Finalizando': '#33C3F0',
  };

  // Calculate total counts
  const totalCourses = courses.length;
  const totalLessons = courses.reduce((acc, course) => 
    acc + course.modules.reduce((macc, module) => 
      macc + module.lessons.length, 0), 0);
  const totalUsers = users.length;

  return (
    <>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Gerencie seus cursos, workshops e trilhas de aprendizagem.
            </p>
          </div>
          <Button 
            onClick={handleAddCourse} 
            size="lg" 
            className="gap-2"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Novo Curso</span>
          </Button>
        </motion.div>

        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Cursos
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCourses}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {courseStatusStats['Concluído'] || 0} cursos concluídos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Aulas
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLessons}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {lessonStatusStats['Finalizando'] || 0} aulas finalizadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Usuários
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {userRoleStats['instructor'] || 0} instrutores
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Status dos Cursos</CardTitle>
              <CardDescription>
                Distribuição de cursos por status
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={courseStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {courseStatusData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COURSE_STATUS_COLORS[entry.name as CourseStatus] || CHART_COLORS[index % CHART_COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status das Aulas</CardTitle>
              <CardDescription>
                Distribuição de aulas por status
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={lessonStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {lessonStatusData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={LESSON_STATUS_COLORS[entry.name as LessonStatus] || CHART_COLORS[index % CHART_COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usuários por Função</CardTitle>
              <CardDescription>
                Distribuição de usuários por função
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userRoleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {userRoleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usuários por Departamento</CardTitle>
              <CardDescription>
                Distribuição de usuários por departamento
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#9b87f5" name="Usuários" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tags/Folders Section */}
        {allTags.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Folder className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Pastas</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <Badge 
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer py-1 px-3 text-sm", 
                    selectedTag === tag ? "bg-primary" : "hover:bg-secondary"
                  )}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                >
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" />
                    <span>{tag}</span>
                    {selectedTag === tag && (
                      <X className="h-3.5 w-3.5 ml-1" />
                    )}
                  </div>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {selectedTag ? `Cursos em "${selectedTag}"` : "Seus Cursos"}
          </h2>
          <Tabs defaultValue={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "list")}>
            <TabsList>
              <TabsTrigger value="grid" className="flex items-center gap-1">
                <Grid3X3 className="h-4 w-4" />
                <span className="hidden sm:inline">Grade</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-1">
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">Lista</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {filteredCourses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-10 bg-muted/40 rounded-lg border border-dashed"
          >
            <h3 className="text-xl font-medium mb-2">
              {selectedTag ? `Nenhum curso encontrado na pasta "${selectedTag}"` : "Nenhum curso encontrado"}
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              {selectedTag 
                ? `Você pode criar um novo curso e adicioná-lo à pasta "${selectedTag}".`
                : "Comece criando seu primeiro curso para organizar seus treinamentos."}
            </p>
            <Button onClick={handleAddCourse} className="gap-2">
              <PlusCircle className="h-5 w-5" />
              <span>Criar Primeiro Curso</span>
            </Button>
          </motion.div>
        ) : (
          <div>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} className="!flex-row !h-32" />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <AddCourseButton />
    </>
  );
};

export default Dashboard;
