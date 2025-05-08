
import { useState, useEffect } from "react";
import { PlusCircle, Search, X, Clock, Users } from "lucide-react";
import { useDynamicsStore, Dynamic, DynamicCategory } from "@/store/dynamicsStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface DynamicsSelectorProps {
  onSelectDynamic: (dynamic: Dynamic) => void;
}

export const DynamicsSelector = ({ onSelectDynamic }: DynamicsSelectorProps) => {
  const { dynamics, addDynamic, fetchDynamics, loading } = useDynamicsStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<DynamicCategory | "all">("all");
  const [newDynamic, setNewDynamic] = useState<Omit<Dynamic, "id" | "createdAt">>({
    name: "",
    category: "Quebra-gelo",
    objective: "",
    materials: "",
    description: "",
    duration: 30,
    minimumParticipants: 5,
    maximumParticipants: 30
  });

  // Fetch dynamics from Supabase when component mounts
  useEffect(() => {
    fetchDynamics();
  }, [fetchDynamics]);

  // Get all categories
  const categories = [
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
  ] as DynamicCategory[];

  // Filter dynamics
  const filteredDynamics = dynamics.filter(dynamic => {
    const matchesSearch = 
      dynamic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dynamic.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dynamic.objective.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || dynamic.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddDynamic = () => {
    if (newDynamic.name.trim() === "") return;
    const id = addDynamic(newDynamic);
    const createdDynamic = dynamics.find(d => d.id === id);
    if (createdDynamic) {
      onSelectDynamic(createdDynamic);
    }

    setNewDynamic({
      name: "",
      category: "Quebra-gelo",
      objective: "",
      materials: "",
      description: "",
      duration: 30,
      minimumParticipants: 5,
      maximumParticipants: 30
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Adicionar dinâmica</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Selecionar dinâmica</DialogTitle>
          <DialogDescription>
            Escolha uma dinâmica do banco ou crie uma nova para adicionar ao seu curso.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="bank" className="mt-4 flex-1 flex flex-col">
          <TabsList className="mb-4">
            <TabsTrigger value="bank">Banco de dinâmicas</TabsTrigger>
            <TabsTrigger value="new">Criar nova dinâmica</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bank" className="flex-1 overflow-hidden">
            <div className="grid grid-cols-4 gap-4 h-full">
              <div className="col-span-1">
                <div className="mb-4">
                  <Button 
                    variant={selectedCategory === "all" ? "default" : "ghost"} 
                    className="w-full justify-start font-normal" 
                    onClick={() => setSelectedCategory("all")}
                  >
                    <span>Todas as dinâmicas</span>
                  </Button>
                  
                  {categories.map((category) => (
                    <Button 
                      key={category} 
                      variant={selectedCategory === category ? "default" : "ghost"} 
                      className="w-full justify-start font-normal"
                      onClick={() => setSelectedCategory(category)}
                    >
                      <span>{category}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="col-span-3">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar dinâmicas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <ScrollArea className="h-[400px] pr-4">
                  <div className="grid grid-cols-1 gap-4">
                    {loading ? (
                      <div className="flex flex-col items-center justify-center p-10">
                        <p className="text-muted-foreground">Carregando dinâmicas...</p>
                      </div>
                    ) : filteredDynamics.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-10 bg-muted/40 rounded-lg border border-dashed">
                        <p className="text-muted-foreground text-center">
                          Nenhuma dinâmica encontrada com esses filtros.
                        </p>
                      </div>
                    ) : (
                      filteredDynamics.map((dynamic) => (
                        <Card 
                          key={dynamic.id} 
                          className="overflow-hidden cursor-pointer hover:border-primary transition-colors"
                          onClick={() => onSelectDynamic(dynamic)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-base">{dynamic.name}</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">{dynamic.objective}</p>
                              </div>
                              <Badge>{dynamic.category}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-3">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{dynamic.duration} min</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {dynamic.minimumParticipants} - {dynamic.maximumParticipants} participantes
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="new" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={newDynamic.name}
                  onChange={(e) => setNewDynamic({...newDynamic, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Categoria
                </Label>
                <Select 
                  value={newDynamic.category} 
                  onValueChange={(value) => setNewDynamic({...newDynamic, category: value as DynamicCategory})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione uma categoria" />
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
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="objective" className="text-right">
                  Objetivo
                </Label>
                <Textarea
                  id="objective"
                  value={newDynamic.objective}
                  onChange={(e) => setNewDynamic({...newDynamic, objective: e.target.value})}
                  className="col-span-3"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="materials" className="text-right">
                  Materiais
                </Label>
                <Textarea
                  id="materials"
                  value={newDynamic.materials}
                  onChange={(e) => setNewDynamic({...newDynamic, materials: e.target.value})}
                  className="col-span-3"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  value={newDynamic.description}
                  onChange={(e) => setNewDynamic({...newDynamic, description: e.target.value})}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">
                  Duração (min)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={newDynamic.duration}
                  onChange={(e) => setNewDynamic({...newDynamic, duration: parseInt(e.target.value) || 0})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="participants" className="text-right">
                  Participantes
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="minParticipants"
                    type="number"
                    value={newDynamic.minimumParticipants}
                    onChange={(e) => setNewDynamic({...newDynamic, minimumParticipants: parseInt(e.target.value) || 0})}
                    className="w-full"
                    placeholder="Mínimo"
                  />
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={newDynamic.maximumParticipants}
                    onChange={(e) => setNewDynamic({...newDynamic, maximumParticipants: parseInt(e.target.value) || 0})}
                    className="w-full"
                    placeholder="Máximo"
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit" onClick={handleAddDynamic}>Adicionar Dinâmica</Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
