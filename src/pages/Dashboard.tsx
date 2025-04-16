
import { useEffect, useState } from "react";
import { PlusCircle, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/courses/CourseCard";
import { useCourseStore } from "@/store/courseStore";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { sampleCourses } from "@/utils/sampleData";
import { AddCourseButton } from "@/components/courses/AddCourseButton";

const Dashboard = () => {
  const { courses, addCourse } = useCourseStore();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Add sample courses if there are none (for demo purposes)
  useEffect(() => {
    if (courses.length === 0) {
      // Adicionar cursos de demonstração
      sampleCourses.forEach(course => {
        addCourse({
          name: course.name,
          description: course.description,
          objectives: course.objectives,
          targetAudience: course.targetAudience,
          estimatedDuration: course.estimatedDuration,
          thumbnail: course.thumbnail,
          modules: course.modules,
        });
      });
    }
  }, [courses.length, addCourse]);

  const handleAddCourse = () => {
    navigate("/courses/new");
  };

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

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Seus Cursos</h2>
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

        {courses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-10 bg-muted/40 rounded-lg border border-dashed"
          >
            <h3 className="text-xl font-medium mb-2">Nenhum curso encontrado</h3>
            <p className="text-muted-foreground text-center mb-6">
              Comece criando seu primeiro curso para organizar seus treinamentos.
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
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {courses.map((course) => (
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
