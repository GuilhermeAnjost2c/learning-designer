
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
import { Module, useCourseStore } from "@/store/courseStore";
import { X, Save, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ModuleFormProps {
  courseId: string;
  module?: Module;
  onClose: () => void;
}

export const ModuleForm = ({ courseId, module, onClose }: ModuleFormProps) => {
  const { addModule, updateModule } = useCourseStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!module;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: module?.title || "",
      description: module?.description || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      if (isEditing && module) {
        updateModule(courseId, module.id, values);
        toast.success("Módulo atualizado com sucesso!");
      } else {
        addModule(courseId, {
          title: values.title,
          description: values.description,
        });
        toast.success("Módulo criado com sucesso!");
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
            {isEditing ? "Editar Módulo" : "Novo Módulo"}
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
                    <FormLabel>Título do Módulo</FormLabel>
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
                        placeholder="Descreva brevemente o conteúdo deste módulo..."
                        className="min-h-24"
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
            <span>{isSubmitting ? "Salvando..." : "Salvar Módulo"}</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
