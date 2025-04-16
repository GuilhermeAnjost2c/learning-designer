
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourseStore, Course } from "@/store/courseStore";
import { Button } from "@/components/ui/button";
import { ModuleItem } from "@/components/courses/ModuleItem";
import { ModuleForm } from "@/components/courses/ModuleForm";
import { CourseForm } from "@/components/courses/CourseForm";
import { 
  ArrowLeft, 
  Edit, 
  Plus, 
  Trash, 
  Clock, 
  Calendar, 
  Users, 
  Target,
  GraduationCap
} from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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
import { toast } from "sonner";

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses, deleteCourse } = useCourseStore();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"designer" | "presentation">("designer");

  useEffect(() => {
    if (courseId) {
      const foundCourse = courses.find((c) => c.id === courseId);
      if (foundCourse) {
        setCourse(foundCourse);
      } else {
        navigate("/courses");
        toast.error("Curso não encontrado");
      }
    }
  }, [courseId, courses, navigate]);

  const handleDeleteCourse = () => {
    if (courseId) {
      deleteCourse(courseId);
      toast.success("Curso excluído com sucesso");
      navigate("/courses");
    }
  };

  const handleBack = () => {
    navigate("/courses");
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">Curso não encontrado</h2>
          <p className="text-muted-foreground mb-4">
            O curso que você está procurando não existe ou foi removido.
          </p>
          <Button onClick={handleBack}>Voltar para Cursos</Button>
        </div>
      </div>
    );
  }

  // Format the created date
  const formattedDate = format(
    new Date(course.createdAt), 
    "dd 'de' MMMM 'de' yyyy", 
    { locale: ptBR }
  );

  // Calculate total duration
  const totalMinutes = course.modules.reduce((total, module) => {
    return total + module.lessons.reduce((moduleTotal, lesson) => {
      return moduleTotal + lesson.duration;
    }, 0);
  }, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const durationText = hours > 0 
    ? `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}` 
    : `${minutes}min`;

  // Count lessons
  const totalLessons = course.modules.reduce((count, module) => {
    return count + module.lessons.length;
  }, 0);

  return (
    <>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Button
            variant="ghost"
            className="gap-2 mb-4"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Cursos</span>
          </Button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{course.name}</h1>
              <p className="text-muted-foreground">
                Criado em {formattedDate}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => setIsEditingCourse(true)}
              >
                <Edit className="h-4 w-4" />
                <span>Editar</span>
              </Button>
              <Button 
                variant="destructive" 
                className="gap-2"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash className="h-4 w-4" />
                <span>Excluir</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3 p-4 rounded-lg bg-white shadow-sm border"
            >
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duração Total</p>
                <p className="font-medium">{durationText}</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 p-4 rounded-lg bg-white shadow-sm border"
            >
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estrutura</p>
                <p className="font-medium">{course.modules.length} módulos, {totalLessons} aulas</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 p-4 rounded-lg bg-white shadow-sm border"
            >
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Público-Alvo</p>
                <p className="font-medium line-clamp-1">{course.targetAudience}</p>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-xl font-semibold mb-2">Descrição</h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {course.description}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold mb-2">Objetivos de Aprendizagem</h2>
                <div className="flex gap-3">
                  <Target className="h-5 w-5 text-primary mt-1" />
                  <p className="text-muted-foreground whitespace-pre-line">
                    {course.objectives}
                  </p>
                </div>
              </motion.div>
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg overflow-hidden border shadow-sm"
              >
                {course.thumbnail ? (
                  <img 
                    src={course.thumbnail} 
                    alt={course.name} 
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-r from-primary/60 to-primary flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {course.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-medium mb-1">Informações Adicionais</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Duração Estimada: {durationText}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Atualizado em: {
                        format(
                          new Date(course.updatedAt), 
                          "dd/MM/yyyy", 
                          { locale: ptBR }
                        )
                      }</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Estrutura do Curso</h2>
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as "designer" | "presentation")}
              className="w-auto"
            >
              <TabsList>
                <TabsTrigger value="designer">Designer</TabsTrigger>
                <TabsTrigger value="presentation">Apresentação</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Tabs value={activeTab} className="w-full">
            <TabsContent value="designer" className="mt-0 space-y-4">
              {course.modules.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center p-10 bg-muted/40 rounded-lg border border-dashed"
                >
                  <h3 className="text-xl font-medium mb-2">Nenhum módulo encontrado</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    Comece adicionando módulos ao seu curso.
                  </p>
                  <Button onClick={() => setIsAddingModule(true)} className="gap-2">
                    <Plus className="h-5 w-5" />
                    <span>Adicionar Primeiro Módulo</span>
                  </Button>
                </motion.div>
              ) : (
                <>
                  <div className="space-y-4">
                    {course.modules.map((module, index) => (
                      <ModuleItem 
                        key={module.id}
                        courseId={course.id}
                        module={module}
                        index={index}
                      />
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 gap-2" 
                    onClick={() => setIsAddingModule(true)}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Adicionar Módulo</span>
                  </Button>
                </>
              )}
            </TabsContent>
            <TabsContent value="presentation" className="mt-0">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-center">{course.name}</h2>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-2">Descrição</h3>
                  <p className="text-gray-600 whitespace-pre-line">{course.description}</p>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-2">Objetivos de Aprendizagem</h3>
                  <p className="text-gray-600 whitespace-pre-line">{course.objectives}</p>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-2">Público-Alvo</h3>
                  <p className="text-gray-600">{course.targetAudience}</p>
                </div>
                
                <div className="mb-10">
                  <h3 className="text-lg font-semibold mb-4">Estrutura do Curso</h3>
                  <ol className="space-y-6">
                    {course.modules.map((module, index) => (
                      <li key={module.id} className="border-l-2 border-primary pl-4 pb-2">
                        <h4 className="text-md font-semibold text-primary">
                          Módulo {index + 1}: {module.title}
                        </h4>
                        {module.description && (
                          <p className="text-sm text-gray-500 mt-1 mb-3">{module.description}</p>
                        )}
                        <ol className="space-y-3 mt-3">
                          {module.lessons.map((lesson, idx) => (
                            <li key={lesson.id} className="flex items-start">
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded mr-2 mt-1">
                                {lesson.duration} min
                              </span>
                              <div>
                                <h5 className="text-sm font-medium">
                                  {idx + 1}. {lesson.title}
                                </h5>
                                {lesson.description && (
                                  <p className="text-xs text-gray-500 mt-1">{lesson.description}</p>
                                )}
                              </div>
                            </li>
                          ))}
                        </ol>
                      </li>
                    ))}
                  </ol>
                </div>
                
                <div className="text-center text-sm text-gray-500">
                  <p>Duração total: {durationText}</p>
                  <p>Atualizado em {format(new Date(course.updatedAt), "dd/MM/yyyy", { locale: ptBR })}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {isAddingModule && (
        <ModuleForm 
          courseId={course.id}
          onClose={() => setIsAddingModule(false)}
        />
      )}

      {isEditingCourse && (
        <CourseForm 
          course={course}
          onClose={() => setIsEditingCourse(false)}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Curso</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita e
              todos os módulos e aulas associados serão excluídos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCourse}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CourseDetail;
