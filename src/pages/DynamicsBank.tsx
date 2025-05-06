
import { useState } from "react";
import { useDynamicsStore, DynamicsActivity, DynamicsCategory } from "@/store/dynamicsStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Search, Users, Target, Plus, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const DynamicsBank = () => {
  const { dynamicsActivities, dynamicsCategories } = useDynamicsStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDuration, setSelectedDuration] = useState<string>("all");
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [hoveredDynamic, setHoveredDynamic] = useState<string | null>(null);

  // Filtered dynamics based on search term and filters
  const filteredDynamics = dynamicsActivities.filter((dynamic) => {
    const matchesSearch =
      searchTerm === "" ||
      dynamic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dynamic.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || dynamic.category === selectedCategory;

    const matchesDuration =
      selectedDuration === "all" ||
      (selectedDuration === "short" && dynamic.duration <= 15) ||
      (selectedDuration === "medium" &&
        dynamic.duration > 15 &&
        dynamic.duration <= 30) ||
      (selectedDuration === "long" && dynamic.duration > 30);

    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "team" && dynamic.teamSize > 1) ||
      (selectedTab === "individual" && dynamic.teamSize === 1);

    return matchesSearch && matchesCategory && matchesDuration && matchesTab;
  });

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Banco de Dinâmicas</h1>
          <p className="text-muted-foreground mt-1">
            Explore e utilize dinâmicas em suas aulas e treinamentos
          </p>
        </div>
        <Button className="flex items-center gap-2 w-full md:w-auto">
          <Plus className="h-4 w-4" />
          <span>Nova Dinâmica</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Filtros</CardTitle>
              <CardDescription>Refine sua busca de dinâmicas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Buscar dinâmica..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {dynamicsCategories.map((category: DynamicsCategory) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duração</Label>
                <Select
                  value={selectedDuration}
                  onValueChange={setSelectedDuration}
                >
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Qualquer duração" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">Qualquer duração</SelectItem>
                      <SelectItem value="short">Curta (até 15 min)</SelectItem>
                      <SelectItem value="medium">
                        Média (15-30 min)
                      </SelectItem>
                      <SelectItem value="long">Longa (30+ min)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="hidden lg:block">
            <CardHeader className="pb-3">
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total de dinâmicas:</span>
                <span className="font-medium">{dynamicsActivities.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Categorias:</span>
                <span className="font-medium">{dynamicsCategories.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Filtradas:</span>
                <span className="font-medium">{filteredDynamics.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Tabs
            defaultValue="all"
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="team">Em grupo</TabsTrigger>
              <TabsTrigger value="individual">Individual</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredDynamics.length > 0 ? (
                    filteredDynamics.map((dynamic: DynamicsActivity) => (
                      <Card
                        key={dynamic.id}
                        className="overflow-hidden transition-all duration-200 hover:shadow-md"
                        onMouseEnter={() => setHoveredDynamic(dynamic.id)}
                        onMouseLeave={() => setHoveredDynamic(null)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg leading-tight">
                                {dynamic.title}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {dynamicsCategories.find(
                                  (c) => c.id === dynamic.category
                                )?.name || "Categoria"}
                              </CardDescription>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-xs bg-primary/5 border-primary/20"
                            >
                              {dynamic.format}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {dynamic.description}
                          </p>
                        </CardContent>
                        <CardFooter className="pt-0 flex justify-between items-center">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>{dynamic.duration} min</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-3.5 w-3.5 mr-1" />
                              <span>{dynamic.teamSize}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`p-0 h-8 opacity-0 transition-opacity duration-200 ${
                              hoveredDynamic === dynamic.id ? "opacity-100" : ""
                            }`}
                          >
                            <span className="mr-1 text-xs">Ver</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center">
                      <Target className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                      <h3 className="mt-4 text-lg font-medium">
                        Nenhuma dinâmica encontrada
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Tente ajustar seus filtros ou criar uma nova dinâmica.
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DynamicsBank;
