
import { useState, useEffect } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Course } from '@/types/course';
import { toast } from 'sonner';
import { useCourseStore } from '@/store/courseStore';
import { Tables } from '@/integrations/supabase/types';

type CourseEditorProps = {
  course: Course;
  onSave: (course: Partial<Course>) => void;
};

const courseSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  objectives: z.string().min(10, 'Objetivos devem ter pelo menos 10 caracteres'),
  targetAudience: z.string().min(3, 'Público-alvo deve ter pelo menos 3 caracteres'),
  estimatedDuration: z.coerce.number().min(1, 'Duração deve ser pelo menos 1 hora'),
  department: z.string().optional(),
  format: z.string().optional(),
  tags: z.string(),
  status: z.string(),
  modules: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional(),
      position: z.number(),
      lessons: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          duration: z.number(),
          activityType: z.string(),
          notes: z.string().optional(),
          status: z.string(),
          position: z.number(),
        })
      ),
    })
  ),
});

export const CourseEditor = ({ course, onSave }: CourseEditorProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [markdownView, setMarkdownView] = useState(false);

  // Initialize form with course data
  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: course.name,
      description: course.description,
      objectives: course.objectives,
      targetAudience: course.targetAudience,
      estimatedDuration: course.estimatedDuration,
      department: course.department || '',
      format: course.format || 'EAD',
      tags: course.tags.join(', '),
      status: course.status,
      modules: course.modules,
    },
  });

  // Generate markdown representation of the course
  const generateMarkdown = (): string => {
    const data = form.getValues();
    
    let markdown = `# ${data.name}\n\n`;
    markdown += `Status: ${data.status}\n`;
    markdown += `Departamento: ${data.department || 'N/A'}\n`;
    markdown += `Formato: ${data.format || 'EAD'}\n`;
    markdown += `Duração Estimada: ${data.estimatedDuration} horas\n\n`;
    
    markdown += `## Descrição\n\n${data.description}\n\n`;
    markdown += `## Objetivos\n\n${data.objectives}\n\n`;
    markdown += `## Público-alvo\n\n${data.targetAudience}\n\n`;
    markdown += `## Tags\n\n${data.tags}\n\n`;
    
    markdown += `## Módulos\n\n`;
    
    data.modules.forEach((module, index) => {
      markdown += `### Módulo ${index + 1}: ${module.title}\n\n`;
      
      if (module.description) {
        markdown += `${module.description}\n\n`;
      }
      
      markdown += `#### Aulas\n\n`;
      
      module.lessons.forEach((lesson, lessonIndex) => {
        markdown += `##### ${lessonIndex + 1}. ${lesson.title} (${lesson.duration} min) - ${lesson.activityType}\n\n`;
        markdown += `${lesson.description}\n\n`;
        
        if (lesson.notes) {
          markdown += `**Notas:** ${lesson.notes}\n\n`;
        }
        
        markdown += `**Status:** ${lesson.status}\n\n`;
      });
    });
    
    return markdown;
  };

  const handleSubmit = async (data: z.infer<typeof courseSchema>) => {
    try {
      setIsSubmitting(true);
      
      const tags = data.tags.split(',').map(tag => tag.trim());
      
      const updatedCourse = {
        name: data.name,
        description: data.description,
        objectives: data.objectives,
        targetAudience: data.targetAudience,
        estimatedDuration: data.estimatedDuration,
        department: data.department,
        format: data.format,
        tags,
        status: data.status as 'Rascunho' | 'Revisão' | 'Publicado',
        modules: data.modules,
      };
      
      onSave(updatedCourse);
      toast.success('Curso atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Erro ao atualizar curso');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateMarkdown());
    toast.success('Conteúdo copiado para a área de transferência!');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Editor de Curso</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setMarkdownView(!markdownView)}
          >
            {markdownView ? 'Voltar ao Formulário' : 'Visualizar Markdown'}
          </Button>
          {markdownView && (
            <Button onClick={copyToClipboard}>
              Copiar para Área de Transferência
            </Button>
          )}
        </div>
      </div>

      {markdownView ? (
        <div className="bg-gray-100 p-4 rounded-md">
          <pre className="whitespace-pre-wrap text-sm font-mono">
            {generateMarkdown()}
          </pre>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Curso</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                        disabled={course.status === 'Publicado'} // Cannot change status if published
                      >
                        <option value="Rascunho">Rascunho</option>
                        <option value="Revisão">Revisão</option>
                        <option value="Publicado">Publicado</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Formato</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="EAD">EAD</option>
                        <option value="Presencial">Presencial</option>
                        <option value="Híbrido">Híbrido</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="objectives"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objetivos</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetAudience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Público-alvo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimatedDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duração Estimada (horas)</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (separadas por vírgula)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-6 space-x-2 flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
