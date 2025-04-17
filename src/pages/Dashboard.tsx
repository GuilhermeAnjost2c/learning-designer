
import { useEffect, useState } from "react";
import { PlusCircle, Grid3X3, List, Tag, X, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/courses/CourseCard";
import { useCourseStore } from "@/store/courseStore";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { sampleCourses } from "@/utils/sampleData";
import { AddCourseButton } from "@/components/courses/AddCourseButton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const { courses, addCourse } = useCourseStore();
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
