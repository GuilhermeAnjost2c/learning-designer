
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useCourseStore, ExperienceSection } from "@/store/courseStore";

interface ExperienceCanvasProps {
  courseId: string;
}

export const ExperienceCanvas = ({ courseId }: ExperienceCanvasProps) => {
  const { courses, updateExperienceSection } = useCourseStore();
  const course = courses.find((c) => c.id === courseId);

  const handleContentChange = (sectionId: string, content: string) => {
    updateExperienceSection(courseId, sectionId, { content });
  };

  if (!course) return null;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Design de Experiência</h2>
      <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-lg border">
        <ResizablePanel defaultSize={25}>
          <Card className="rounded-none h-full">
            <CardHeader className="bg-blue-50">
              <h3 className="text-lg font-semibold text-blue-700">Problemas/sintomas</h3>
            </CardHeader>
            <CardContent>
              <Textarea
                className="min-h-[200px] resize-none"
                placeholder="Descreva os problemas ou sintomas que o curso vai resolver..."
                value={course.experienceSections?.find(s => s.type === 'problems')?.content || ''}
                onChange={(e) => handleContentChange(
                  course.experienceSections?.find(s => s.type === 'problems')?.id || '',
                  e.target.value
                )}
              />
            </CardContent>
          </Card>
        </ResizablePanel>
        
        <ResizableHandle />
        
        <ResizablePanel defaultSize={25}>
          <Card className="rounded-none h-full">
            <CardHeader className="bg-green-50">
              <h3 className="text-lg font-semibold text-green-700">Resultados esperados</h3>
            </CardHeader>
            <CardContent>
              <Textarea
                className="min-h-[200px] resize-none"
                placeholder="Descreva os resultados que espera alcançar..."
                value={course.experienceSections?.find(s => s.type === 'results')?.content || ''}
                onChange={(e) => handleContentChange(
                  course.experienceSections?.find(s => s.type === 'results')?.id || '',
                  e.target.value
                )}
              />
            </CardContent>
          </Card>
        </ResizablePanel>
        
        <ResizableHandle />
        
        <ResizablePanel defaultSize={50}>
          <div className="grid grid-rows-2 h-full">
            <Card className="rounded-none">
              <CardHeader className="bg-purple-50">
                <h3 className="text-lg font-semibold text-purple-700">Ideias para alcançar o resultado</h3>
              </CardHeader>
              <CardContent>
                <Textarea
                  className="min-h-[100px] resize-none"
                  placeholder="Liste suas ideias para alcançar os resultados..."
                  value={course.experienceSections?.find(s => s.type === 'ideas')?.content || ''}
                  onChange={(e) => handleContentChange(
                    course.experienceSections?.find(s => s.type === 'ideas')?.id || '',
                    e.target.value
                  )}
                />
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-2 gap-2">
              <Card className="rounded-none">
                <CardHeader className="bg-orange-50">
                  <h3 className="text-sm font-semibold text-orange-700">Objetivos de Aprendizagem</h3>
                </CardHeader>
                <CardContent>
                  <Textarea
                    className="min-h-[100px] resize-none"
                    placeholder="Liste os objetivos de aprendizagem..."
                    value={course.experienceSections?.find(s => s.type === 'objectives')?.content || ''}
                    onChange={(e) => handleContentChange(
                      course.experienceSections?.find(s => s.type === 'objectives')?.id || '',
                      e.target.value
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card className="rounded-none">
                <CardHeader className="bg-teal-50">
                  <h3 className="text-sm font-semibold text-teal-700">Pessoas e Características</h3>
                </CardHeader>
                <CardContent>
                  <Textarea
                    className="min-h-[100px] resize-none"
                    placeholder="Descreva o perfil das pessoas..."
                    value={course.experienceSections?.find(s => s.type === 'people')?.content || ''}
                    onChange={(e) => handleContentChange(
                      course.experienceSections?.find(s => s.type === 'people')?.id || '',
                      e.target.value
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
