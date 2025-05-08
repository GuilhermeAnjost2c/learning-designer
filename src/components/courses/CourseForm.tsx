
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Course, CourseFormat, DepartmentName } from "@/types/course";
import { toast } from "sonner";
import { useCourses } from "@/hooks/useCourses";
import { useUserStore } from "@/store/userStore";
import { useNavigate } from "react-router-dom";

interface CourseFormProps {
  course?: Course;
  onClose: () => void;
}

export const CourseForm = ({ course, onClose }: CourseFormProps) => {
  const { addCourse, updateCourse, loading } = useCourses();
  const { currentUser } = useUserStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: course?.name || "",
    description: course?.description || "",
    objectives: course?.objectives || "",
    target_audience: course?.target_audience || "",
    estimated_duration: course?.estimated_duration?.toString() || "60",
    department: course?.department || (currentUser?.department || ""),
    tags: course?.tags?.join(", ") || "",
    format: (course?.format as CourseFormat) || "EAD" as CourseFormat,
    status: course?.status || "Rascunho",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log("CourseForm rendered with data:", { formData, currentUser });
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    console.log(`Field ${name} changed to:`, value);
  };
  
  const handleSelectChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    console.log(`Select ${key} changed to:`, value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simple validation
    if (!formData.name.trim()) {
      toast.error("O nome do curso é obrigatório.");
      setIsSubmitting(false);
      return;
    }
    
    try {
      console.log("Submitting course form with data:", formData);
      
      // Parse tags from comma-separated string
      const tags = formData.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag);
        
      // Parse numeric values
      const estimated_duration = parseInt(formData.estimated_duration) || 60;
      
      const courseData = {
        name: formData.name,
        description: formData.description,
        objectives: formData.objectives,
        target_audience: formData.target_audience,
        estimated_duration,
        department: formData.department as DepartmentName | undefined,
        tags,
        format: formData.format,
        status: formData.status,
        created_by: currentUser?.id || ''
      };
      
      console.log("Prepared course data:", courseData);
      
      if (course) {
        // Update existing course
        const result = await updateCourse(course.id, courseData);
        console.log("Update result:", result);
        if (result) {
          toast.success("Curso atualizado com sucesso!");
          navigate("/courses");
        } else {
          toast.error("Erro ao atualizar o curso.");
        }
      } else {
        // Add new course
        const result = await addCourse(courseData);
        console.log("Add result:", result);
        
        if (result) {
          toast.success("Curso criado com sucesso!");
          navigate("/courses");
        } else {
          toast.error("Erro ao criar o curso.");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Ocorreu um erro ao salvar o curso.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {course ? "Editar Curso" : "Novo Curso"}
          </DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para {course ? "editar" : "criar"} um curso
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Curso</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Digite o nome do curso"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descreva o curso brevemente"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="objectives">Objetivos de Aprendizagem</Label>
                <Textarea
                  id="objectives"
                  name="objectives"
                  value={formData.objectives}
                  onChange={handleChange}
                  placeholder="O que os alunos aprenderão?"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="target_audience">Público-Alvo</Label>
                <Textarea
                  id="target_audience"
                  name="target_audience"
                  value={formData.target_audience}
                  onChange={handleChange}
                  placeholder="Para quem este curso é destinado?"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimated_duration">Duração Estimada (minutos)</Label>
                <Input
                  id="estimated_duration"
                  name="estimated_duration"
                  type="number"
                  value={formData.estimated_duration}
                  onChange={handleChange}
                  placeholder="60"
                  min="1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleSelectChange("department", value)}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Selecione o departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Departamentos</SelectLabel>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Vendas">Vendas</SelectItem>
                      <SelectItem value="RH">RH</SelectItem>
                      <SelectItem value="TI">TI</SelectItem>
                      <SelectItem value="Operações">Operações</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="format">Formato do Curso</Label>
                <Select
                  value={formData.format}
                  onValueChange={(value) => handleSelectChange("format", value)}
                >
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Formato</SelectLabel>
                      <SelectItem value="EAD">EAD</SelectItem>
                      <SelectItem value="Ao vivo">Ao vivo</SelectItem>
                      <SelectItem value="Híbrido">Híbrido</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Ex: liderança, comunicação"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting || loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || loading}>
              {isSubmitting || loading ? "Salvando..." : course ? "Salvar Alterações" : "Criar Curso"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
