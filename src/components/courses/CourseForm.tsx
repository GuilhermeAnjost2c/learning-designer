
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useCourseStore, Course } from "@/store/courseStore";
import { toast } from "sonner";

interface CourseFormProps {
  course?: Course;
  onClose: () => void;
}

export type CourseFormat = "EAD" | "Ao vivo" | "Híbrido";

export const CourseForm = ({ course, onClose }: CourseFormProps) => {
  const { addCourse, updateCourse } = useCourseStore();
  
  const [formData, setFormData] = useState({
    name: course?.name || "",
    description: course?.description || "",
    objectives: course?.objectives || "",
    targetAudience: course?.targetAudience || "",
    estimatedDuration: course?.estimatedDuration?.toString() || "60",
    department: course?.department || "",
    tags: course?.tags?.join(", ") || "",
    format: (course?.format as CourseFormat) || "EAD" as CourseFormat,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name.trim()) {
      toast.error("O nome do curso é obrigatório.");
      return;
    }
    
    // Parse tags from comma-separated string
    const tags = formData.tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag);
      
    // Parse numeric values
    const estimatedDuration = parseInt(formData.estimatedDuration) || 60;
    
    const courseData = {
      name: formData.name,
      description: formData.description,
      objectives: formData.objectives,
      targetAudience: formData.targetAudience,
      estimatedDuration,
      department: formData.department,
      tags,
      format: formData.format,
    };
    
    if (course) {
      // Update existing course
      updateCourse(course.id, courseData);
      toast.success("Curso atualizado com sucesso!");
    } else {
      // Add new course
      addCourse(courseData);
      toast.success("Curso criado com sucesso!");
    }
    
    onClose();
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {course ? "Editar Curso" : "Novo Curso"}
          </DialogTitle>
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
                <Label htmlFor="targetAudience">Público-Alvo</Label>
                <Textarea
                  id="targetAudience"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  placeholder="Para quem este curso é destinado?"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedDuration">Duração Estimada (minutos)</Label>
                <Input
                  id="estimatedDuration"
                  name="estimatedDuration"
                  type="number"
                  value={formData.estimatedDuration}
                  onChange={handleChange}
                  placeholder="60"
                  min="1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Input
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Opcional"
                />
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {course ? "Salvar Alterações" : "Criar Curso"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
