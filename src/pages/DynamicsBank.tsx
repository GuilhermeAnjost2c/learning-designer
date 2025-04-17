
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Search, Tag, Filter, X, Clock, Users, Database } from "lucide-react";
import { useDynamicsStore, Dynamic, DynamicCategory } from "@/store/dynamicsStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sampleDynamics } from "@/utils/sampleDynamics";
import { cn } from "@/lib/utils";

const DynamicsBank = () => {
  const { dynamics, addDynamic } = useDynamicsStore();
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

  // Adiciona dinâmicas de exemplo se não houver nenhuma
  useEffect(() => {
    if (dynamics.length === 0) {
      sampleDynamics.forEach(dynamic => {
        addDynamic(dynamic);
      });
    }
  }, [dynamics.length, addDynamic]);

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

  // Count dynamics by category
  const dynamicsByCategory = categories.reduce((acc, category) => {
    acc[category] = dynamics.filter(d => d.category === category).length;
    return acc;
  }, {} as Record<string, number>);

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
    addDynamic(newDynamic);
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

  const handleSelectCategory = (category: DynamicCategory | "all") => {
    setSelectedCategory(category);
  };

  return (
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banco de Dinâmicas</h1>
          <p className="text-muted-foreground">
            Explore e gerencie dinâmicas para seus treinamentos corporativos.
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <PlusCircle className="h-5 w-5" />
              <span>Nova Dinâmica</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Adicionar nova dinâmica</DialogTitle>
              <DialogDescription>
                Crie uma nova dinâmica para seu banco de atividades. Preencha todos os campos abaixo.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
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
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <div className="bg-white rounded-lg border p-4 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <Database className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Categorias</h3>
              </div>
              
              <div className="space-y-1">
                <Button 
                  variant={selectedCategory === "all" ? "default" : "ghost"} 
                  className="w-full justify-start font-normal" 
                  onClick={() => handleSelectCategory("all")}
                >
                  <span>Todas as dinâmicas</span>
                  <Badge variant="outline" className="ml-auto">
                    {dynamics.length}
                  </Badge>
                </Button>
                
                {categories.map((category) => (
                  <Button 
                    key={category} 
                    variant={selectedCategory === category ? "default" : "ghost"} 
                    className="w-full justify-start font-normal"
                    onClick={() => handleSelectCategory(category)}
                  >
                    <span>{category}</span>
                    <Badge variant="outline" className="ml-auto">
                      {dynamicsByCategory[category] || 0}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <div className="mb-6">
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
          
          {selectedCategory !== "all" && (
            <div className="mb-4 flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Filtrando por:</p>
              <Badge 
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => setSelectedCategory("all")}
              >
                {selectedCategory}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            </div>
          )}
          
          {filteredDynamics.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 bg-muted/40 rounded-lg border border-dashed">
              <h3 className="text-xl font-medium mb-2">Nenhuma dinâmica encontrada</h3>
              <p className="text-muted-foreground text-center mb-6">
                {searchTerm 
                  ? "Tente ajustar sua busca ou filtros" 
                  : "Comece adicionando dinâmicas ao seu banco"}
              </p>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <PlusCircle className="h-5 w-5" />
                    <span>Nova Dinâmica</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  {/* Same dialog content as above */}
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredDynamics.map((dynamic) => (
                <Card key={dynamic.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{dynamic.name}</CardTitle>
                        <CardDescription className="mt-1">{dynamic.objective}</CardDescription>
                      </div>
                      <Badge>{dynamic.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium mb-1">Descrição</h4>
                        <p className="text-sm text-muted-foreground">{dynamic.description}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-1">Materiais</h4>
                        <p className="text-sm text-muted-foreground">{dynamic.materials}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/30 pt-3">
                    <div className="flex items-center justify-between w-full">
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
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicsBank;
