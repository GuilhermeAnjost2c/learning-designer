
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Course, useCourseStore } from "@/store/courseStore";
import { useNavigate } from "react-router-dom";
import { X, Save, Clock, Users, Target, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  objectives: z.string().min(10, "Os objetivos devem ter pelo menos 10 caracteres"),
  targetAudience: z.string().min(5, "O público-alvo deve ter pelo menos 5 caracteres"),
  estimatedDuration: z.coerce
    .number()
    .min(1, "A duração deve ser pelo menos 1 minuto")
    .max(10000, "A duração deve ser no máximo 10000 minutos"),
  thumbnail: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CourseFormProps {
  course?: Course;
  onClose: () => void;
}

export const CourseForm = ({ course, onClose }: CourseFormProps) => {
  const { addCourse, updateCourse } = useCourseStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!course;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: course?.name || "",
      description: course?.description || "",
      objectives: course?.objectives || "",
      targetAudience: course?.targetAudience || "",
      estimatedDuration: course?.estimatedDuration || 60,
      thumbnail: course?.thumbnail || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      if (isEditing && course) {
        updateCourse(course.id, {
          ...values,
          updatedAt: new Date(),
        });
        toast.success("Curso atualizado com sucesso!");
        navigate(`/courses/${course.id}`);
      } else {
        addCourse({
          name: values.name,
          description: values.description,
          objectives: values.objectives,
          targetAudience: values.targetAudience,
          estimatedDuration: values.estimatedDuration,
          thumbnail: values.thumbnail,
          modules: [],
        });
        toast.success("Curso criado com sucesso!");
        navigate("/courses");
      }
    } catch (error) {
      toast.error("Ocorreu um erro. Tente novamente.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">
            {isEditing ? "Editar Curso" : "Novo Curso"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Curso</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Ex: Fundamentos de Design Thinking" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Breve descrição do curso, seus principais tópicos e benefícios..."
                        className="min-h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="objectives"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objetivos de Aprendizagem</FormLabel>
                      <FormControl>
                        <div className="flex items-start space-x-2">
                          <Target className="h-5 w-5 mt-2 text-muted-foreground" />
                          <Textarea
                            placeholder="Ao final deste curso, os participantes serão capazes de..."
                            className="min-h-24"
                            {...field}
                          />
                        </div>
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
                      <FormLabel>Público-Alvo</FormLabel>
                      <FormControl>
                        <div className="flex items-start space-x-2">
                          <Users className="h-5 w-5 mt-2 text-muted-foreground" />
                          <Textarea
                            placeholder="Este curso é indicado para..."
                            className="min-h-24"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="estimatedDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração Estimada (minutos)</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                          <Input type="number" min={1} {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagem de Capa (URL)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/image.jpg" 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)} 
            disabled={isSubmitting}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            <span>{isSubmitting ? "Salvando..." : "Salvar Curso"}</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
