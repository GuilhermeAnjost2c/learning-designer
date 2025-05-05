
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { CourseHeader } from "@/components/courses/CourseHeader";
import { CourseContent } from "@/components/courses/CourseContent";
import { CourseInfo } from "@/components/courses/CourseInfo";
import { CourseForm } from "@/components/courses/CourseForm";
import { CourseEditor } from "@/components/courses/CourseEditor";
import { useAuth } from "@/hooks/useAuth";
import { useCourseStore } from "@/store/courseStore";
import { supabase } from "@/integrations/supabase/client";

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    fetchCourse, 
    course, 
    updateCourse,
    deleteCourse,
    loading, 
    error,
    requestCourseApproval
  } = useCourseStore();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("content");

  useEffect(() => {
    if (courseId && user) {
      fetchCourse(courseId);
    }
  }, [courseId, user, fetchCourse]);

  const handleDelete = async () => {
    if (courseId) {
      await deleteCourse(courseId);
      toast.success("Curso excluído com sucesso!");
      navigate("/courses");
    }
  };

  const handleSubmitForApproval = async () => {
    if (courseId && course) {
      try {
        await requestCourseApproval(courseId);
        toast.success("Curso enviado para aprovação com sucesso!");
        // Refresh course data
        fetchCourse(courseId);
      } catch (error) {
        console.error("Error submitting course for approval:", error);
        toast.error("Erro ao enviar curso para aprovação");
      }
    }
  };

  const handleEditClose = () => {
    setIsEditOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-red-500">Erro ao carregar curso</h2>
        <p className="text-gray-600 mt-2">{error}</p>
        <Button onClick={() => navigate("/courses")} className="mt-4">
          Voltar para lista de cursos
        </Button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold">Curso não encontrado</h2>
        <Button onClick={() => navigate("/courses")} className="mt-4">
          Voltar para lista de cursos
        </Button>
      </div>
    );
  }

  const isOwner = user && course.createdBy === user.id;
  const isCollaborator = user && course.collaborators && course.collaborators.includes(user.id);
  const canEdit = isOwner || isCollaborator;

  return (
    <div className="container mx-auto max-w-7xl">
      <CourseHeader
        course={course}
        onEdit={() => setIsEditOpen(true)}
        onDelete={() => setDeleteDialogOpen(true)}
        onSubmitForApproval={handleSubmitForApproval}
        isOwner={isOwner}
        canEdit={canEdit}
      />

      <Tabs
        defaultValue="content"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mt-6"
      >
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-0">
          <CourseContent 
            course={course} 
            canEdit={canEdit}
            onCourseUpdated={() => fetchCourse(courseId || '')}
          />
        </TabsContent>

        <TabsContent value="info" className="mt-0">
          <CourseInfo course={course} />
        </TabsContent>

        <TabsContent value="editor" className="mt-0">
          <CourseEditor 
            course={course}
            onSave={(updatedCourse) => {
              updateCourse(courseId || '', updatedCourse);
              toast.success("Curso atualizado com sucesso!");
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Edit Course Dialog */}
      {isEditOpen && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Curso</DialogTitle>
              <DialogDescription>
                Edite as informações do curso. Clique em salvar quando terminar.
              </DialogDescription>
            </DialogHeader>
            <CourseForm 
              onClose={handleEditClose} 
              userId={user?.id || ''}
              initialValues={course}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseDetail;
