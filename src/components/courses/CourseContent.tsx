
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Course } from "@/store/courseStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ModuleItem } from "@/components/courses/ModuleItem";
import { FileEdit, Plus } from "lucide-react";

interface CourseContentProps {
  course: Course;
  onOpenEditor: () => void;
  onAddModule: () => void;
}

export const CourseContent = ({ course, onOpenEditor, onAddModule }: CourseContentProps) => {
  return (
    <Tabs defaultValue="content" className="mt-6">
      <TabsList>
        <TabsTrigger value="content">Conteúdo</TabsTrigger>
        <TabsTrigger value="info">Informações</TabsTrigger>
      </TabsList>
      <TabsContent value="content" className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Módulos</h2>
          <div className="flex gap-2">
            <Button onClick={onOpenEditor} className="gap-2" variant="outline">
              <FileEdit className="h-4 w-4" />
              <span>Editor Avançado</span>
            </Button>
            <Button onClick={onAddModule} className="gap-2">
              <Plus className="h-4 w-4" />
              <span>Adicionar Módulo</span>
            </Button>
          </div>
        </div>

        {course.modules.length === 0 ? (
          <div className="text-center p-8 border border-dashed rounded-lg">
            <h3 className="font-medium text-lg mb-2">Nenhum módulo adicionado</h3>
            <p className="text-muted-foreground mb-4">
              Comece adicionando um módulo ao seu curso.
            </p>
            <Button onClick={onAddModule}>Adicionar Módulo</Button>
          </div>
        ) : (
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
        )}
      </TabsContent>
      <TabsContent value="info">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Descrição</h3>
            <p className="whitespace-pre-wrap">{course.description}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Objetivos</h3>
            <p className="whitespace-pre-wrap">{course.objectives}</p>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {course.tags && course.tags.length > 0 ? (
              course.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))
            ) : (
              <p className="text-muted-foreground">Nenhuma tag adicionada</p>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
