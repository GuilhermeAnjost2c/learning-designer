import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDynamicsStore, DynamicActivity, DynamicCategory } from "@/store/dynamicsStore";
import { DynamicsSelector } from "@/components/courses/DynamicsSelector";
import { Search, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

const DynamicsBank = () => {
  const { activities, categories, initializeDynamics, filterByCategory, searchActivities } = useDynamicsStore();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<DynamicCategory | null>(null);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  useEffect(() => {
    if (user) {
      initializeDynamics(user.id);
    }
  }, [user, initializeDynamics]);

  const filteredActivities = searchTerm
    ? searchActivities(searchTerm)
    : selectedCategory
    ? filterByCategory(selectedCategory)
    : activities;

  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banco de Dinâmicas</h1>
          <p className="text-muted-foreground">
            Explore e gerencie uma variedade de dinâmicas para suas aulas e
            workshops.
          </p>
        </div>
        <Button onClick={() => setIsSelectorOpen(true)}>
          Adicionar Dinâmica
        </Button>
      </div>

      {/* Category Section */}
      {categories.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Categorias</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer py-1 px-3 text-sm"
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category ? null : category
                  )
                }
              >
                {category}
                {selectedCategory === category && (
                  <X className="h-4 w-4 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar dinâmicas..."
            className="pl-9 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          <span>Filtrar</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white rounded-lg shadow-md p-4"
          >
            <h3 className="text-lg font-semibold">{activity.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {activity.category}
            </p>
            <p className="mt-2">{activity.description}</p>
          </div>
        ))}
      </div>

      <DynamicsSelector
        open={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
      />
    </div>
  );
};

export default DynamicsBank;
