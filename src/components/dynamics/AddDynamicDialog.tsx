
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDynamicsStore, DynamicCategory } from "@/store/dynamicsStore";
import { toast } from "sonner";

interface AddDynamicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddDynamicDialog({ open, onOpenChange }: AddDynamicDialogProps) {
  const { addDynamic } = useDynamicsStore();
  const [formData, setFormData] = useState({
    name: "",
    category: "Quebra-gelo" as DynamicCategory,
    objective: "",
    materials: "",
    description: "",
    duration: 30,
    minimumParticipants: 5,
    maximumParticipants: 30
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const categories: DynamicCategory[] = [
    "Quebra-gelo",
    "Integração",
    "Energização",
    "Trabalho em equipe",
    "Comunicação",
    "Liderança",
    "Criatividade",
    "Resolução de problemas",
    "Tomada de decisão",
    "Feedback",
    "Reflexão"
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value as DynamicCategory }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simple validation
    if (!formData.name.trim()) {
      toast.error("O nome da dinâmica é obrigatório.");
      setIsSubmitting(false);
      return;
    }
    
    try {
      addDynamic(formData);
      toast.success("Dinâmica adicionada com sucesso!");
      setFormData({
        name: "",
        category: "Quebra-gelo",
        objective: "",
        materials: "",
        description: "",
        duration: 30,
        minimumParticipants: 5,
        maximumParticipants: 30
      });
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao adicionar dinâmica.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Dinâmica</DialogTitle>
          <DialogDescription>
            Adicione uma nova dinâmica ao banco de dinâmicas.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Dinâmica</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Digite o nome da dinâmica"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="objective">Objetivo</Label>
              <Textarea
                id="objective"
                name="objective"
                value={formData.objective}
                onChange={handleChange}
                placeholder="Descreva o objetivo da dinâmica"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="materials">Materiais</Label>
              <Textarea
                id="materials"
                name="materials"
                value={formData.materials}
                onChange={handleChange}
                placeholder="Liste os materiais necessários"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descreva como a dinâmica funciona"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duração (minutos)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleNumberChange}
                  min="1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minimumParticipants">Mínimo de Participantes</Label>
                <Input
                  id="minimumParticipants"
                  name="minimumParticipants"
                  type="number"
                  value={formData.minimumParticipants}
                  onChange={handleNumberChange}
                  min="1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maximumParticipants">Máximo de Participantes</Label>
                <Input
                  id="maximumParticipants"
                  name="maximumParticipants"
                  type="number"
                  value={formData.maximumParticipants}
                  onChange={handleNumberChange}
                  min="1"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Dinâmica"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
