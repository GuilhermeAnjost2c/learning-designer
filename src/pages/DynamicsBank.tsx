
import { useState, useEffect } from 'react';
import { PlusCircle, Filter, Search, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { useDynamicsStore, DynamicCategory, Dynamic } from '@/store/dynamicsStore';
import { useUserStore } from '@/store/userStore';
import { cn } from '@/lib/utils';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const DynamicsBank = () => {
  const { currentUser } = useUserStore();
  const { 
    dynamics, 
    dynamicsCategories,
    addDynamic,
    searchDynamics,
    getDynamicsByCategory,
    fetchAllDynamics,
    isInitialized,
    isLoading
  } = useDynamicsStore();

  const [filteredDynamics, setFilteredDynamics] = useState<Dynamic[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeDynamics = async () => {
      if (!isInitialized) {
        await fetchAllDynamics();
      }
      setLoading(false);
    };

    initializeDynamics();
  }, [fetchAllDynamics, isInitialized]);

  useEffect(() => {
    if (searchTerm) {
      setFilteredDynamics(searchDynamics(searchTerm));
    } else if (selectedCategory) {
      setFilteredDynamics(getDynamicsByCategory(selectedCategory as DynamicCategory));
    } else {
      setFilteredDynamics(dynamics);
    }
  }, [searchTerm, selectedCategory, dynamics, searchDynamics, getDynamicsByCategory]);

  const [newDynamic, setNewDynamic] = useState({
    name: '',
    category: 'Quebra-gelo' as DynamicCategory,
    objective: '',
    materials: '',
    description: '',
    duration: 15,
    minimumParticipants: 2,
    maximumParticipants: 10,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDynamic(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDynamic(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  const handleSelectChange = (value: string) => {
    setNewDynamic(prev => ({
      ...prev,
      category: value as DynamicCategory
    }));
  };

  const handleAddDynamic = async () => {
    // Validation
    if (!newDynamic.name.trim()) {
      toast.error('O nome da dinâmica é obrigatório');
      return;
    }
    
    if (!newDynamic.description.trim()) {
      toast.error('A descrição da dinâmica é obrigatória');
      return;
    }
    
    try {
      const result = await addDynamic(newDynamic);
      
      if (result) {
        // Reset form
        setNewDynamic({
          name: '',
          category: 'Quebra-gelo' as DynamicCategory,
          objective: '',
          materials: '',
          description: '',
          duration: 15,
          minimumParticipants: 2,
          maximumParticipants: 10,
        });
        
        // Close dialog
        setDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding dynamic:', error);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banco de Dinâmicas</h1>
          <p className="text-muted-foreground">
            Explore e gerencie dinâmicas para usar em seus treinamentos.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <PlusCircle className="h-5 w-5" />
              <span>Nova Dinâmica</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Nova Dinâmica</DialogTitle>
              <DialogDescription>
                Crie uma nova dinâmica para seu banco de atividades.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={newDynamic.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Categoria
                </Label>
                <Select 
                  value={newDynamic.category} 
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {dynamicsCategories.map(category => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="objective" className="text-right">
                  Objetivo
                </Label>
                <Textarea
                  id="objective"
                  name="objective"
                  value={newDynamic.objective}
                  onChange={handleInputChange}
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
                  name="materials"
                  value={newDynamic.materials}
                  onChange={handleInputChange}
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
                  name="description"
                  value={newDynamic.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">
                  Duração (min)
                </Label>
                <Input
                  type="number"
                  id="duration"
                  name="duration"
                  value={newDynamic.duration}
                  onChange={handleNumberChange}
                  className="col-span-3"
                  min={1}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-2 items-center gap-2">
                  <Label htmlFor="minimumParticipants" className="text-right text-xs sm:text-sm">
                    Mín. Participantes
                  </Label>
                  <Input
                    type="number"
                    id="minimumParticipants"
                    name="minimumParticipants"
                    value={newDynamic.minimumParticipants}
                    onChange={handleNumberChange}
                    min={1}
                  />
                </div>
                
                <div className="grid grid-cols-2 items-center gap-2">
                  <Label htmlFor="maximumParticipants" className="text-right text-xs sm:text-sm">
                    Máx. Participantes
                  </Label>
                  <Input
                    type="number"
                    id="maximumParticipants"
                    name="maximumParticipants"
                    value={newDynamic.maximumParticipants}
                    onChange={handleNumberChange}
                    min={1}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleAddDynamic} disabled={isLoading}>
                {isLoading ? "Adicionando..." : "Adicionar Dinâmica"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar dinâmicas..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedCategory(null);
            }}
            className="pl-9"
          />
        </div>
        
        <div className="flex-shrink-0">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedCategory(null);
              setSearchTerm('');
            }}
            className="w-full md:w-auto"
          >
            Limpar filtros
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-lg font-medium">Categorias</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {dynamicsCategories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.name ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer',
                selectedCategory === category.name ? 'bg-primary' : 'hover:bg-secondary'
              )}
              onClick={() => {
                setSelectedCategory(
                  selectedCategory === category.name ? null : category.name
                );
                setSearchTerm('');
              }}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Dynamics List */}
      {loading ? (
        <div className="text-center py-12">
          <p>Carregando dinâmicas...</p>
        </div>
      ) : filteredDynamics.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <h3 className="text-xl font-medium mb-2">Nenhuma dinâmica encontrada</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || selectedCategory
              ? 'Tente ajustar seus filtros ou criar uma nova dinâmica.'
              : 'Comece adicionando sua primeira dinâmica ao banco.'}
          </p>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-5 w-5 mr-2" />
              Adicionar Dinâmica
            </Button>
          </DialogTrigger>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDynamics.map((dynamic) => (
            <Card key={dynamic.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{dynamic.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {dynamic.category} · {dynamic.duration} min
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{dynamic.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm">Objetivo</h4>
                  <p className="text-sm text-muted-foreground">{dynamic.objective}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Descrição</h4>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {dynamic.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium">Participantes</h4>
                    <p className="text-muted-foreground">
                      {dynamic.minimumParticipants} a {dynamic.maximumParticipants}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Materiais</h4>
                    <p className="text-muted-foreground line-clamp-2">
                      {dynamic.materials || "Nenhum material necessário"}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  Ver detalhes
                </Button>
                <Button size="sm">Usar em curso</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DynamicsBank;
