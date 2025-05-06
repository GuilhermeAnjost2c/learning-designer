
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lesson, ActivityType, useCourseStore } from "@/store/courseStore";
import { X, Save, Clock, BookOpen, LayoutList } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  duration: z.coerce
    .number()
    .min(1, "A duração deve ser pelo menos 1 minuto")
    .max(480, "A duração deve ser no máximo 480 minutos (8 horas)"),
  activityType: z.enum(["Exposição", "Dinâmica", "Prática", "Avaliação"] as const),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface LessonFormProps {
  courseId: string;
  moduleId: string;
  lesson?: Lesson;
  onClose: () => void;
}

export const LessonForm = ({ courseId, moduleId, lesson, onClose }: LessonFormProps) => {
  const { addLesson, updateLesson } = useCourseStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!lesson;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: lesson?.title || "",
      description: lesson?.description || "",
      duration: lesson?.duration || 30,
      activityType: lesson?.activityType || "Exposição",
      notes: lesson?.notes || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      if (isEditing && lesson) {
        updateLesson(courseId, moduleId, lesson.id, values);
        toast.success("Aula atualizada com sucesso!");
      } else {
        addLesson(courseId, moduleId, {
          title: values.title,
          description: values.description || "",
          duration: values.duration,
          activityType: values.activityType,
          notes: values.notes
        });
        toast.success("Aula criada com sucesso!");
      }
      onClose();
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
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {isEditing ? "Editar Aula" : "Nova Aula"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título da Aula</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Ex: Introdução ao Design Thinking" {...field} />
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
                    <FormLabel>Descrição (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva brevemente o conteúdo desta aula..."
                        className="min-h-20"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração (minutos)</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                          <Input type="number" min={1} max={480} {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="activityType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Atividade</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Exposição">Exposição</SelectItem>
                          <SelectItem value="Dinâmica">Dinâmica</SelectItem>
                          <SelectItem value="Prática">Prática</SelectItem>
                          <SelectItem value="Avaliação">Avaliação</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas Adicionais (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Anotações sobre materiais, instruções especiais, etc..."
                        className="min-h-20"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            <span>{isSubmitting ? "Salvando..." : "Salvar Aula"}</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
