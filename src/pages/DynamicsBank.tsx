
import { useEffect, useState } from "react";
import { DynamicsList } from "@/components/dynamics/DynamicsList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useDynamicsStore } from "@/store/dynamicsStore";
import { AddDynamicDialog } from "@/components/dynamics/AddDynamicDialog";
import { Separator } from "@/components/ui/separator";

const DynamicsBank = () => {
  const [isAddingDynamic, setIsAddingDynamic] = useState(false);
  const { fetchDynamics, dynamics, loading } = useDynamicsStore();

  useEffect(() => {
    // Fetch dynamics from Supabase when component mounts
    fetchDynamics();
  }, [fetchDynamics]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banco de Dinâmicas</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todas as dinâmicas disponíveis para seus cursos.
          </p>
        </div>
        <Button 
          onClick={() => setIsAddingDynamic(true)}
          className="mt-4 sm:mt-0 gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Dinâmica</span>
        </Button>
      </div>
      
      <Separator className="mb-6" />
      
      {loading ? (
        <div className="flex justify-center py-12">
          <p className="text-muted-foreground">Carregando dinâmicas...</p>
        </div>
      ) : (
        <DynamicsList dynamics={dynamics} />
      )}
      
      <AddDynamicDialog 
        open={isAddingDynamic}
        onOpenChange={setIsAddingDynamic}
      />
    </div>
  );
};

export default DynamicsBank;
