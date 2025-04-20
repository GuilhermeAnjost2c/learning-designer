
import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCourseStore, Module, Lesson, LessonStatus } from "@/store/courseStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronRight, Plus, X, Save, Book, FileText, Menu, ArrowLeft, MoreHorizontal, CheckCircle2, Circle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ReactMarkdown from 'react-markdown';

interface CourseEditorProps {
  courseId: string;
  onClose: () => void;
}

export const CourseEditor = ({ courseId, onClose }: CourseEditorProps) => {
  const { courses, updateModule, updateLesson, addModule, addLesson, updateLessonStatus } = useCourseStore();
  const [course, setCourse] = useState(() => courses.find(c => c.id === courseId));
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [lessonContent, setLessonContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  // Initialize expanded modules
  useEffect(() => {
    if (course) {
      const expanded: Record<string, boolean> = {};
      course.modules.forEach(module => {
        expanded[module.id] = true;
      });
      setExpandedModules(expanded);
      
      // Select first module and lesson by default if available
      if (course.modules.length > 0) {
        setSelectedModuleId(course.modules[0].id);
        
        if (course.modules[0].lessons.length > 0) {
          setSelectedLessonId(course.modules[0].lessons[0].id);
        }
      }
    }
  }, [course]);

  // Update course when store changes
  useEffect(() => {
    const updatedCourse = courses.find(c => c.id === courseId);
    if (updatedCourse) {
      setCourse(updatedCourse);
    }
  }, [courses, courseId]);

  // Update lesson content when selecting a different lesson
  useEffect(() => {
    if (course && selectedModuleId && selectedLessonId) {
      const module = course.modules.find(m => m.id === selectedModuleId);
      if (module) {
        const lesson = module.lessons.find(l => l.id === selectedLessonId);
        if (lesson) {
          setLessonContent(lesson.description || "");
        }
      }
    }
  }, [course, selectedModuleId, selectedLessonId]);

  const toggleExpanded = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const selectLesson = (moduleId: string, lessonId: string) => {
    if (selectedLessonId && selectedLessonId !== lessonId) {
      // Save current content before switching
      saveCurrentContent();
    }
    setSelectedModuleId(moduleId);
    setSelectedLessonId(lessonId);
  };

  const saveCurrentContent = useCallback(() => {
    if (course && selectedModuleId && selectedLessonId && lessonContent !== undefined) {
      const moduleIndex = course.modules.findIndex(m => m.id === selectedModuleId);
      if (moduleIndex >= 0) {
        const lessonIndex = course.modules[moduleIndex].lessons.findIndex(l => l.id === selectedLessonId);
        if (lessonIndex >= 0) {
          const lesson = course.modules[moduleIndex].lessons[lessonIndex];
          if (lesson.description !== lessonContent) {
            updateLesson(courseId, selectedModuleId, selectedLessonId, {
              description: lessonContent
            });
            toast.success("Conteúdo salvo com sucesso!");
          }
        }
      }
    }
  }, [course, courseId, lessonContent, selectedLessonId, selectedModuleId, updateLesson]);

  const handleAddModule = () => {
    addModule(courseId, {
      title: "Novo Módulo",
      description: "Descrição do novo módulo"
    });
    toast.success("Módulo adicionado com sucesso!");
  };

  const handleAddLesson = (moduleId: string) => {
    addLesson(courseId, moduleId, {
      title: "Nova Aula",
      description: "Descrição da nova aula",
      duration: 60,
      activityType: "Exposição"
    });
    toast.success("Aula adicionada com sucesso!");
  };

  const handleLessonStatusChange = (moduleId: string, lessonId: string, status: LessonStatus) => {
    updateLessonStatus(courseId, moduleId, lessonId, status);
    toast.success(`Status atualizado para "${status}"`);
  };

  const getStatusIcon = (status: LessonStatus) => {
    switch (status) {
      case "Fazer":
        return <Circle className="h-4 w-4" />;
      case "Fazendo":
        return <Clock className="h-4 w-4" />;
      case "Finalizando":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: LessonStatus) => {
    switch (status) {
      case "Fazer":
        return "text-gray-500";
      case "Fazendo":
        return "text-blue-500";
      case "Finalizando":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLessonContent(e.target.value);
  };

  const handleCloseAndSave = () => {
    saveCurrentContent();
    onClose();
  };

  const getSelectedLesson = () => {
    if (!course || !selectedModuleId || !selectedLessonId) return null;
    
    const module = course.modules.find(m => m.id === selectedModuleId);
    if (!module) return null;
    
    return module.lessons.find(l => l.id === selectedLessonId);
  };

  const selectedLesson = getSelectedLesson();

  return (
    <Dialog open={true} onOpenChange={handleCloseAndSave} modal={false}>
      <DialogContent className="max-w-full w-screen h-screen p-0 overflow-hidden bg-background">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleCloseAndSave}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-semibold">{course?.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPreview(!isPreview)}
                    >
                      {isPreview ? "Editar" : "Visualizar"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isPreview ? "Voltar para o editor" : "Visualizar markdown"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarVisible(!sidebarVisible)}
                className="flex items-center gap-1"
              >
                <Menu className="h-4 w-4" />
                <span className="hidden sm:inline">{sidebarVisible ? "Ocultar" : "Mostrar"} Navegação</span>
              </Button>
              <Button onClick={saveCurrentContent} className="gap-1">
                <Save className="h-4 w-4" />
                <span>Salvar</span>
              </Button>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <AnimatePresence initial={false}>
              {sidebarVisible && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 320, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="border-r h-full flex flex-col bg-secondary/30"
                >
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-medium">Estrutura do Curso</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleAddModule}
                      className="hover:bg-secondary"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <ScrollArea className="flex-1 p-2">
                    {course?.modules.map((module: Module) => (
                      <div key={module.id} className="mb-3">
                        <div 
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-secondary",
                            selectedModuleId === module.id && "bg-secondary"
                          )}
                          onClick={() => toggleExpanded(module.id)}
                        >
                          <button className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                            {expandedModules[module.id] ? 
                              <ChevronDown className="h-4 w-4" /> : 
                              <ChevronRight className="h-4 w-4" />
                            }
                          </button>
                          <div className="flex-1 flex items-center gap-2">
                            <Book className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium truncate">{module.title}</span>
                          </div>
                          <div className="flex items-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 rounded-full hover:bg-secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddLesson(module.id);
                              }}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {expandedModules[module.id] && (
                          <AnimatePresence initial={false}>
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="pl-7 mt-1 ml-2 border-l"
                            >
                              {module.lessons.map((lesson: Lesson) => (
                                <div
                                  key={lesson.id}
                                  className={cn(
                                    "flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-secondary text-sm",
                                    selectedLessonId === lesson.id && "bg-secondary"
                                  )}
                                  onClick={() => selectLesson(module.id, lesson.id)}
                                >
                                  <FileText className="h-4 w-4 flex-shrink-0" />
                                  <span className="flex-1 truncate">{lesson.title}</span>
                                  <div className={cn("flex items-center", getStatusColor(lesson.status))}>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0 rounded-full hover:bg-secondary"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          {getStatusIcon(lesson.status)}
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleLessonStatusChange(module.id, lesson.id, "Fazer")}>
                                          <Circle className="mr-2 h-4 w-4" />
                                          <span>Fazer</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleLessonStatusChange(module.id, lesson.id, "Fazendo")}>
                                          <Clock className="mr-2 h-4 w-4" />
                                          <span>Fazendo</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleLessonStatusChange(module.id, lesson.id, "Finalizando")}>
                                          <CheckCircle2 className="mr-2 h-4 w-4" />
                                          <span>Finalizando</span>
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          </AnimatePresence>
                        )}
                      </div>
                    ))}
                  </ScrollArea>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Editor area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {selectedLesson ? (
                <>
                  <div className="border-b p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "px-2 py-0.5",
                            selectedLesson.status === "Fazer" && "bg-gray-100",
                            selectedLesson.status === "Fazendo" && "bg-blue-100 text-blue-800 border-blue-300",
                            selectedLesson.status === "Finalizando" && "bg-green-100 text-green-800 border-green-300"
                          )}
                        >
                          {selectedLesson.status}
                        </Badge>
                        <Badge variant="outline" className="px-2 py-0.5">
                          {selectedLesson.activityType}
                        </Badge>
                        <Badge variant="outline" className="px-2 py-0.5">
                          {selectedLesson.duration} min
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleLessonStatusChange(selectedModuleId!, selectedLessonId!, "Fazer")}>
                            Marcar como "Fazer"
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleLessonStatusChange(selectedModuleId!, selectedLessonId!, "Fazendo")}>
                            Marcar como "Fazendo"
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleLessonStatusChange(selectedModuleId!, selectedLessonId!, "Finalizando")}>
                            Marcar como "Finalizando"
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <Input 
                      className="mt-2 text-xl font-bold border-none pl-0 focus-visible:ring-0" 
                      value={selectedLesson.title}
                      onChange={(e) => {
                        updateLesson(courseId, selectedModuleId!, selectedLessonId!, {
                          title: e.target.value
                        });
                      }}
                    />
                  </div>

                  <div className="flex-1 overflow-auto p-4">
                    {isPreview ? (
                      <div className="prose prose-sm sm:prose max-w-none p-4">
                        <ReactMarkdown>{lessonContent}</ReactMarkdown>
                      </div>
                    ) : (
                      <Textarea
                        className="w-full h-full p-4 resize-none focus-visible:ring-0 border-none font-mono"
                        value={lessonContent}
                        onChange={handleContentChange}
                        placeholder="Escreva o conteúdo da aula em markdown..."
                      />
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">Nenhuma aula selecionada</h3>
                    <p className="text-muted-foreground mb-4">
                      Selecione uma aula para começar a editar seu conteúdo.
                    </p>
                    {!sidebarVisible && (
                      <Button onClick={() => setSidebarVisible(true)}>Mostrar Navegação</Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
