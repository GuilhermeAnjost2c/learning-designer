
import { useCourseStore } from "@/store/courseStore";
import { CourseCard } from "@/components/courses/CourseCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AddCourseButton } from "@/components/courses/AddCourseButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CoursesList = () => {
  const { courses } = useCourseStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name" | "modules">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleAddCourse = () => {
    navigate("/courses/new");
  };

  const filteredCourses = courses
    .filter((course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      // sort by modules count
      return sortOrder === "asc"
        ? a.modules.length - b.modules.length
        : b.modules.length - a.modules.length;
    });

  return (
    <>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cursos</h1>
            <p className="text-muted-foreground">
              Gerencie todos os seus cursos e treinamentos.
            </p>
          </div>
          <Button onClick={handleAddCourse} size="lg" className="gap-2">
            <PlusCircle className="h-5 w-5" />
            <span>Novo Curso</span>
          </Button>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cursos..."
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                <span>Filtrar</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuCheckboxItem
                checked={sortBy === "date"}
                onCheckedChange={() => setSortBy("date")}
              >
                Ordenar por data
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === "name"}
                onCheckedChange={() => setSortBy("name")}
              >
                Ordenar por nome
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === "modules"}
                onCheckedChange={() => setSortBy("modules")}
              >
                Ordenar por módulos
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortOrder === "asc"}
                onCheckedChange={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                Ordem crescente
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {filteredCourses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-10 bg-muted/40 rounded-lg border border-dashed"
          >
            {courses.length === 0 ? (
              <>
                <h3 className="text-xl font-medium mb-2">Nenhum curso encontrado</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Comece criando seu primeiro curso para organizar seus treinamentos.
                </p>
                <Button onClick={handleAddCourse} className="gap-2">
                  <PlusCircle className="h-5 w-5" />
                  <span>Criar Primeiro Curso</span>
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-medium mb-2">Nenhum resultado encontrado</h3>
                <p className="text-muted-foreground text-center">
                  Tente ajustar os filtros ou buscar por outros termos.
                </p>
              </>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
      <AddCourseButton />
    </>
  );
};

export default CoursesList;
