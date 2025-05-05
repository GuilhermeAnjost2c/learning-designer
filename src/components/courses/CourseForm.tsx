
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Course } from "@/types/course";
import { useCourseStore } from "@/store/courseStore";

// Define the props type for the component
export interface CourseFormProps {
  onClose: () => void;
  userId: string;
  initialValues?: Course;
}

// Schema for form validation
const courseSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  objectives: z.string().min(10, "Objetivos devem ter pelo menos 10 caracteres"),
  targetAudience: z.string().min(3, "Público-alvo deve ter pelo menos 3 caracteres"),
  estimatedDuration: z.coerce
    .number()
    .min(1, "Duração deve ser pelo menos 1 hora"),
  department: z.string().optional(),
  format: z.string().optional(),
  tags: z.string().optional(),
});

export const CourseForm = ({
  onClose,
  userId,
  initialValues,
}: CourseFormProps) => {
  const { createCourse, updateCourse } = useCourseStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create form
  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: initialValues
      ? {
          name: initialValues.name,
          description: initialValues.description,
          objectives: initialValues.objectives,
          targetAudience: initialValues.targetAudience,
          estimatedDuration: initialValues.estimatedDuration,
          department: initialValues.department || "",
          format: initialValues.format || "EAD",
          tags: initialValues.tags.join(", "),
        }
      : {
          name: "",
          description: "",
          objectives: "",
          targetAudience: "",
          estimatedDuration: 1,
          department: "",
          format: "EAD",
          tags: "",
        },
  });

  const onSubmit = async (data: z.infer<typeof courseSchema>) => {
    try {
      setIsSubmitting(true);
      const tags = data.tags
        ? data.tags.split(",").map((tag) => tag.trim())
        : [];

      if (initialValues) {
        // Update existing course
        await updateCourse(initialValues.id, {
          name: data.name,
          description: data.description,
          objectives: data.objectives,
          targetAudience: data.targetAudience,
          estimatedDuration: data.estimatedDuration,
          department: data.department,
          format: data.format,
          tags,
        });
        toast.success("Curso atualizado com sucesso!");
      } else {
        // Create new course
        await createCourse({
          name: data.name,
          description: data.description,
          objectives: data.objectives,
          targetAudience: data.targetAudience,
          estimatedDuration: data.estimatedDuration,
          tags,
          createdBy: userId,
          department: data.department,
          format: data.format,
        });
        toast.success("Curso criado com sucesso!");
      }
      onClose();
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error(
        `Erro ao ${initialValues ? "atualizar" : "criar"} curso. Tente novamente.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-6 bg-white rounded-lg"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Curso</FormLabel>
              <FormControl>
                <Input placeholder="Nome do curso" {...field} />
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
                  placeholder="Descreva o curso"
                  className="min-h-[100px]"
                  {...field}
                />
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
                <Textarea
                  placeholder="Objetivos do curso"
                  className="min-h-[100px]"
                  {...field}
                />
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
                <Input placeholder="Público-alvo do curso" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="estimatedDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duração Estimada (horas)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Duração em horas"
                    {...field}
                  />
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
                  <Input placeholder="Departamento" {...field} />
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
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (separadas por vírgula)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: gestão, liderança, vendas"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 mt-6">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : initialValues ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
