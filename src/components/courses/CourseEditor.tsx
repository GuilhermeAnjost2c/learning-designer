
import { useState, useEffect, useCallback, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCourseStore, Module, Lesson, LessonStatus, CourseStatus } from "@/store/courseStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ChevronDown, ChevronRight, Plus, X, Save, Book, FileText, Menu, 
  ArrowLeft, MoreHorizontal, CheckCircle2, Circle, Clock, Trash, 
  Edit, GripVertical, Heading1, Heading2, Heading3, Bold, Italic, 
  List, ListOrdered, Link as LinkIcon, Image
} from "lucide-react";
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
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface CourseEditorProps {
  courseId: string;
  onClose: () => void;
}

export const CourseEditor = ({ courseId, onClose }: CourseEditorProps) => {
  const { 
    courses, updateModule, updateLesson, addModule, addLesson, 
    updateLessonStatus, deleteModule, deleteLesson, reorderModule, reorderLesson 
  } = useCourseStore();
  const [course, setCourse] = useState(() => courses.find(c => c.id === courseId));
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [lessonContents, setLessonContents] = useState<Record<string, string>>({});
  const [isPreview, setIsPreview] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [editingTitle, setEditingTitle] = useState<{id: string, type: 'module' | 'lesson'} | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

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
      
      // Initialize lesson contents from course data
      const contents: Record<string, string> = {};
      course.modules.forEach(module => {
        module.lessons.forEach(lesson => {
          contents[lesson.id] = lesson.description || "";
        });
      });
      setLessonContents(contents);
    }
  }, [course]);

  // Focus title input when editing
  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingTitle]);

  // Update course when store changes
  useEffect(() => {
    const updatedCourse = courses.find(c => c.id === courseId);
    if (updatedCourse) {
      setCourse(updatedCourse);
    }
  }, [courses, courseId]);

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
    if (course && selectedModuleId && selectedLessonId && lessonContents[selectedLessonId] !== undefined) {
      const moduleIndex = course.modules.findIndex(m => m.id === selectedModuleId);
      if (moduleIndex >= 0) {
        const lessonIndex = course.modules[moduleIndex].lessons.findIndex(l => l.id === selectedLessonId);
        if (lessonIndex >= 0) {
          const lesson = course.modules[moduleIndex].lessons[lessonIndex];
          if (lesson.description !== lessonContents[selectedLessonId]) {
            updateLesson(courseId, selectedModuleId, selectedLessonId, {
              description: lessonContents[selectedLessonId]
            });
            toast.success("Conteúdo salvo com sucesso!");
          }
        }
      }
    }
  }, [course, courseId, lessonContents, selectedLessonId, selectedModuleId, updateLesson]);

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

  const handleDeleteModule = (moduleId: string) => {
    deleteModule(courseId, moduleId);
    if (selectedModuleId === moduleId) {
      setSelectedModuleId(null);
      setSelectedLessonId(null);
    }
    toast.success("Módulo excluído com sucesso");
  };

  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    deleteLesson(courseId, moduleId, lessonId);
    if (selectedLessonId === lessonId) {
      setSelectedLessonId(null);
    }
    
    // Remove content from lessonContents
    setLessonContents(prev => {
      const newContents = {...prev};
      delete newContents[lessonId];
      return newContents;
    });
    
    toast.success("Aula excluída com sucesso");
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
    if (!selectedLessonId) return;
    
    // Update only the selected lesson's content
    setLessonContents(prev => ({
      ...prev,
      [selectedLessonId]: e.target.value
    }));
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

  const handleDoubleClick = (id: string, type: 'module' | 'lesson') => {
    setEditingTitle({ id, type });
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    }
    if (e.key === 'Escape') {
      setEditingTitle(null);
    }
  };

  const handleTitleBlur = () => {
    if (editingTitle && titleInputRef.current) {
      const newTitle = titleInputRef.current.value.trim();
      
      if (newTitle) {
        if (editingTitle.type === 'module') {
          updateModule(courseId, editingTitle.id, { title: newTitle });
        } else {
          // Find which module contains this lesson
          const moduleWithLesson = course?.modules.find(
            m => m.lessons.some(l => l.id === editingTitle.id)
          );
          
          if (moduleWithLesson) {
            updateLesson(courseId, moduleWithLesson.id, editingTitle.id, { title: newTitle });
          }
        }
      }
    }
    setEditingTitle(null);
  };

  const handleDragEnd = (result: any) => {
    const { source, destination, type } = result;
    
    // Dropped outside the list
    if (!destination) return;
    
    // Dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;
    
    if (type === 'MODULE') {
      reorderModule(courseId, source.index, destination.index);
      toast.success("Módulo reordenado com sucesso");
    } else if (type === 'LESSON') {
      // Only handle reordering lessons within the same module for now
      if (source.droppableId === destination.droppableId) {
        reorderLesson(courseId, source.droppableId, source.index, destination.index);
        toast.success("Aula reordenada com sucesso");
      }
    }
  };

  const insertMarkdownSyntax = (syntax: string, wrap: boolean = false) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea || !selectedLessonId) return;
    
    const content = lessonContents[selectedLessonId] || "";
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newText;
    if (wrap && selectedText) {
      newText = content.substring(0, start) + 
        syntax + selectedText + syntax + 
        content.substring(end);
    } else {
      newText = content.substring(0, start) + 
        syntax + 
        content.substring(end);
    }
    
    setLessonContents(prev => ({
      ...prev,
      [selectedLessonId]: newText
    }));
    
    // Focus back on textarea
    setTimeout(() => {
      textarea.focus();
      if (wrap && selectedText) {
        textarea.setSelectionRange(start + syntax.length, end + syntax.length);
      } else {
        const newPosition = start + syntax.length;
        textarea.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };
  
  const selectedLesson = getSelectedLesson();
  const currentLessonContent = selectedLessonId ? lessonContents[selectedLessonId] || "" : "";

  return (
    <Dialog open={true} onOpenChange={handleCloseAndSave} modal={false}>
      <DialogContent className="max-w-full w-screen h-screen p-0 overflow-hidden bg-background font-sans">
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
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="modules" type="MODULE">
                        {(provided) => (
                          <div 
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {course?.modules.map((module: Module, moduleIndex) => (
                              <Draggable 
                                key={module.id} 
                                draggableId={module.id} 
                                index={moduleIndex}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="mb-3"
                                  >
                                    <div 
                                      className={cn(
                                        "flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-secondary group",
                                        selectedModuleId === module.id && "bg-secondary"
                                      )}
                                    >
                                      <div
                                        {...provided.dragHandleProps}
                                        className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                      <button 
                                        className="w-5 h-5 flex-shrink-0 flex items-center justify-center"
                                        onClick={() => toggleExpanded(module.id)}
                                      >
                                        {expandedModules[module.id] ? 
                                          <ChevronDown className="h-4 w-4" /> : 
                                          <ChevronRight className="h-4 w-4" />
                                        }
                                      </button>
                                      <div 
                                        className="flex-1 flex items-center gap-2" 
                                        onClick={() => toggleExpanded(module.id)}
                                      >
                                        <Book className="h-4 w-4 text-primary" />
                                        {editingTitle?.id === module.id && editingTitle.type === 'module' ? (
                                          <Input 
                                            ref={titleInputRef}
                                            defaultValue={module.title}
                                            className="h-7 py-1 text-sm border-none focus-visible:ring-1 bg-white"
                                            onBlur={handleTitleBlur}
                                            onKeyDown={handleTitleKeyDown}
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                        ) : (
                                          <span 
                                            className="text-sm font-medium truncate"
                                            onDoubleClick={() => handleDoubleClick(module.id, 'module')}
                                          >
                                            {module.title}
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
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
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0 rounded-full hover:bg-destructive/20 hover:text-destructive"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteModule(module.id);
                                          }}
                                        >
                                          <Trash className="h-3 w-3" />
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
                                          <Droppable droppableId={module.id} type="LESSON">
                                            {(provided) => (
                                              <div 
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                              >
                                                {module.lessons.map((lesson: Lesson, lessonIndex) => (
                                                  <Draggable 
                                                    key={lesson.id} 
                                                    draggableId={lesson.id} 
                                                    index={lessonIndex}
                                                  >
                                                    {(provided) => (
                                                      <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={cn(
                                                          "flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-secondary text-sm group",
                                                          selectedLessonId === lesson.id && "bg-secondary"
                                                        )}
                                                        onClick={() => selectLesson(module.id, lesson.id)}
                                                      >
                                                        <div
                                                          {...provided.dragHandleProps}
                                                          className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                          <GripVertical className="h-3 w-3 text-muted-foreground" />
                                                        </div>
                                                        <FileText className="h-4 w-4 flex-shrink-0" />
                                                        
                                                        {editingTitle?.id === lesson.id && editingTitle.type === 'lesson' ? (
                                                          <Input 
                                                            ref={titleInputRef}
                                                            defaultValue={lesson.title}
                                                            className="h-6 py-1 text-xs border-none focus-visible:ring-1 bg-white"
                                                            onBlur={handleTitleBlur}
                                                            onKeyDown={handleTitleKeyDown}
                                                            onClick={(e) => e.stopPropagation()}
                                                          />
                                                        ) : (
                                                          <span 
                                                            className="flex-1 truncate"
                                                            onDoubleClick={() => handleDoubleClick(lesson.id, 'lesson')}
                                                          >
                                                            {lesson.title}
                                                          </span>
                                                        )}
                                                        
                                                        <div className={cn(
                                                          "flex items-center", 
                                                          getStatusColor(lesson.status)
                                                        )}>
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
                                                          <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 w-6 p-0 rounded-full hover:bg-destructive/20 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                                            onClick={(e) => {
                                                              e.stopPropagation();
                                                              handleDeleteLesson(module.id, lesson.id);
                                                            }}
                                                          >
                                                            <Trash className="h-3 w-3" />
                                                          </Button>
                                                        </div>
                                                      </div>
                                                    )}
                                                  </Draggable>
                                                ))}
                                                {provided.placeholder}
                                              </div>
                                            )}
                                          </Droppable>
                                        </motion.div>
                                      </AnimatePresence>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
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

                  {!isPreview && (
                    <div className="border-b p-2 flex flex-wrap gap-1 bg-muted/20">
                      <TooltipProvider delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => insertMarkdownSyntax('# ')}
                            >
                              <Heading1 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Título H1</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => insertMarkdownSyntax('## ')}
                            >
                              <Heading2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Título H2</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => insertMarkdownSyntax('### ')}
                            >
                              <Heading3 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Título H3</TooltipContent>
                        </Tooltip>
                        
                        <Separator orientation="vertical" className="h-6 mx-1" />
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => insertMarkdownSyntax('**', true)}
                            >
                              <Bold className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Negrito</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => insertMarkdownSyntax('*', true)}
                            >
                              <Italic className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Itálico</TooltipContent>
                        </Tooltip>
                        
                        <Separator orientation="vertical" className="h-6 mx-1" />
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => insertMarkdownSyntax('- ')}
                            >
                              <List className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Lista não ordenada</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => insertMarkdownSyntax('1. ')}
                            >
                              <ListOrdered className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Lista ordenada</TooltipContent>
                        </Tooltip>
                        
                        <Separator orientation="vertical" className="h-6 mx-1" />
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => insertMarkdownSyntax('[texto do link](url)')}
                            >
                              <LinkIcon className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Link</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => insertMarkdownSyntax('![texto alternativo](url da imagem)')}
                            >
                              <Image className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Imagem</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}

                  <div className="flex-1 overflow-auto">
                    {isPreview ? (
                      <div className="prose prose-sm sm:prose max-w-none p-6 font-sans">
                        <ReactMarkdown>{currentLessonContent}</ReactMarkdown>
                      </div>
                    ) : (
                      <Textarea
                        className="w-full h-full p-4 resize-none focus-visible:ring-0 border-none font-sans"
                        value={currentLessonContent}
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
