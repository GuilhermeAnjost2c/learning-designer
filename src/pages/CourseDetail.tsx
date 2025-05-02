
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCourseStore, Course, CourseStatus, ApprovalItemType } from "@/store/courseStore";
import { useUserStore } from "@/store/userStore";
import { CourseForm } from "@/components/courses/CourseForm";
import { ModuleForm } from "@/components/courses/ModuleForm";
import { toast } from "sonner";
import { CourseEditor } from "@/components/courses/CourseEditor";
import { CourseHeader } from "@/components/courses/CourseHeader";
import { CourseInfo } from "@/components/courses/CourseInfo";
import { CourseContent } from "@/components/courses/CourseContent";
import { CourseDialogs } from "@/components/courses/CourseDialogs";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, FileDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courses, deleteCourse, updateCourseStatus, addCollaborator, removeCollaborator, submitForApproval } = useCourseStore();
  const { users, currentUser, getAllManagers } = useUserStore();
  const [course, setCourse] = useState<Course | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [isCollaboratorDialogOpen, setIsCollaboratorDialogOpen] = useState(false);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [approvalData, setApprovalData] = useState({
    approverId: "",
    approvalType: "curso_completo" as ApprovalItemType,
    itemId: "",
    comments: ""
  });
  const [showStructure, setShowStructure] = useState(false);
  
  const managers = getAllManagers();
  
  useEffect(() => {
    if (courseId) {
      const foundCourse = courses.find(c => c.id === courseId);
      setCourse(foundCourse || null);
    }
  }, [courseId, courses]);
  
  const canViewCourse = () => {
    if (!currentUser || !course) return false;
    
    return (
      currentUser.role === 'admin' ||
      course.createdBy === currentUser.id ||
      (currentUser.department && course.department === currentUser.department) ||
      (course.collaborators && course.collaborators.includes(currentUser.id))
    );
  };

  if (!course) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Curso não encontrado</h1>
        <Button onClick={() => navigate("/courses")}>Voltar para Cursos</Button>
      </div>
    );
  }
  
  if (!canViewCourse()) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Você não tem permissão para visualizar este curso</h1>
        <p className="mb-4 text-muted-foreground">Este curso está em outro departamento ou você não é um colaborador.</p>
        <Button onClick={() => navigate("/courses")}>Voltar para Cursos</Button>
      </div>
    );
  }

  const totalModules = course.modules.length;
  const totalLessons = course.modules.reduce(
    (acc, module) => acc + module.lessons.length, 
    0
  );

  const handleDelete = () => {
    deleteCourse(course.id);
    toast.success("Curso excluído com sucesso");
    navigate("/courses");
  };

  const handleStatusChange = (status: CourseStatus) => {
    updateCourseStatus(course.id, status);
    toast.success(`Status do curso atualizado para "${status}"`);
  };

  const openEditor = () => {
    setEditorOpen(true);
  };
  
  const handleAddCollaborator = () => {
    if (!collaboratorEmail) {
      toast.error("Informe o email do colaborador");
      return;
    }
    
    const collaborator = users.find(user => user.email === collaboratorEmail);
    if (!collaborator) {
      toast.error("Usuário não encontrado");
      return;
    }
    
    if (course.collaborators && course.collaborators.includes(collaborator.id)) {
      toast.error("Este usuário já é um colaborador");
      return;
    }
    
    addCollaborator(course.id, collaborator.id);
    toast.success(`${collaborator.name} adicionado como colaborador`);
    setCollaboratorEmail("");
    setIsCollaboratorDialogOpen(false);
  };
  
  const handleRemoveCollaborator = (userId: string) => {
    removeCollaborator(course.id, userId);
    toast.success("Colaborador removido com sucesso");
  };
  
  const getCollaborators = () => {
    // Make sure course.collaborators exists before trying to map over it
    return course.collaborators && Array.isArray(course.collaborators) 
      ? course.collaborators
          .map(userId => users.find(user => user.id === userId))
          .filter(Boolean)
      : [];
  };
  
  const handleSubmitForApproval = () => {
    if (!approvalData.approverId) {
      toast.error("Selecione um aprovador");
      return;
    }
    
    submitForApproval(
      course.id,
      currentUser!.id,
      approvalData.approverId,
      approvalData.approvalType,
      approvalData.approvalType !== 'curso_completo' ? approvalData.itemId : undefined,
      approvalData.comments
    );
    
    toast.success("Curso enviado para aprovação");
    setIsApprovalDialogOpen(false);
  };

  const toggleShowStructure = () => {
    setShowStructure(!showStructure);
  };

  const exportStructurePDF = () => {
    // This is just a placeholder for now - we'll implement PDF export in a future update
    toast.success("Funcionalidade de exportação PDF será implementada em breve!");
  };

  return (
    <div className="container mx-auto py-6">
      <CourseHeader 
        course={course}
        onDelete={handleDelete}
        onEdit={() => setIsEditing(true)}
        onStatusChange={handleStatusChange}
        onAddCollaborators={() => setIsCollaboratorDialogOpen(true)}
        onApprovalRequest={() => setIsApprovalDialogOpen(true)}
        handleDeleteDialogOpen={() => setDeleteDialogOpen(true)}
      />

      <CourseInfo 
        course={course}
        totalModules={totalModules}
        totalLessons={totalLessons}
        collaborators={getCollaborators()}
        onOpenEditor={openEditor}
        onRemoveCollaborator={handleRemoveCollaborator}
        onOpenCollaboratorDialog={() => setIsCollaboratorDialogOpen(true)}
      />

      {/* Course Structure Summary */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Estrutura do Curso</h3>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleShowStructure}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              {showStructure ? "Ocultar Estrutura" : "Ver Estrutura"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportStructurePDF}
              className="flex items-center gap-2"
            >
              <FileDown className="h-4 w-4" />
              Exportar PDF
            </Button>
          </div>
        </div>
        
        {showStructure && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {course.modules.map((module, moduleIndex) => (
                    <div key={module.id} className="border-b pb-3">
                      <h4 className="text-md font-medium mb-2">
                        Módulo {moduleIndex + 1}: {module.title}
                      </h4>
                      {module.description && (
                        <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                      )}
                      <div className="pl-4 space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div key={lesson.id} className="border-l-2 pl-3 py-1">
                            <div className="flex justify-between">
                              <h5 className="text-sm font-medium">{moduleIndex + 1}.{lessonIndex + 1} - {lesson.title}</h5>
                              <span className="text-xs text-muted-foreground">{lesson.duration} min</span>
                            </div>
                            {lesson.description && (
                              <p className="text-xs text-muted-foreground mt-1">{lesson.description.substring(0, 100)}{lesson.description.length > 100 ? "..." : ""}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>

      <CourseContent 
        course={course}
        onOpenEditor={openEditor}
        onAddModule={() => setIsAddingModule(true)}
      />

      {isEditing && (
        <CourseForm
          course={course}
          onClose={() => setIsEditing(false)}
        />
      )}

      {isAddingModule && (
        <ModuleForm
          courseId={course.id}
          onClose={() => setIsAddingModule(false)}
        />
      )}

      {editorOpen && (
        <CourseEditor 
          courseId={course.id} 
          onClose={() => setEditorOpen(false)} 
        />
      )}

      <CourseDialogs 
        course={course}
        managers={managers}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        handleDelete={handleDelete}
        collaboratorEmail={collaboratorEmail}
        setCollaboratorEmail={setCollaboratorEmail}
        isCollaboratorDialogOpen={isCollaboratorDialogOpen}
        setIsCollaboratorDialogOpen={setIsCollaboratorDialogOpen}
        handleAddCollaborator={handleAddCollaborator}
        handleRemoveCollaborator={handleRemoveCollaborator}
        getCollaborators={getCollaborators}
        approvalData={approvalData}
        setApprovalData={setApprovalData}
        isApprovalDialogOpen={isApprovalDialogOpen}
        setIsApprovalDialogOpen={setIsApprovalDialogOpen}
        handleSubmitForApproval={handleSubmitForApproval}
      />
    </div>
  );
};

export default CourseDetail;
