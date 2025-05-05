
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DynamicActivity, useDynamicsStore } from "@/store/dynamicsStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface DynamicsSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DynamicsSelector = ({ isOpen, onClose }: DynamicsSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { activities, addDynamic } = useDynamicsStore();
  
  const filteredActivities = searchTerm 
    ? activities.filter(activity => 
        activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : activities;

  const handleSelectDynamic = (dynamic: DynamicActivity) => {
    // Handle the selection
    console.log("Selected dynamic:", dynamic);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Selecionar Dinâmica</DialogTitle>
        </DialogHeader>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar dinâmicas..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[60vh]">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="border rounded-lg p-4 cursor-pointer hover:bg-slate-50"
              onClick={() => handleSelectDynamic(activity)}
            >
              <h3 className="font-medium">{activity.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs px-2 py-1 bg-primary/10 rounded-full">{activity.category}</span>
                <span className="text-xs text-muted-foreground">{activity.duration} min</span>
              </div>
            </div>
          ))}

          {filteredActivities.length === 0 && (
            <div className="col-span-2 p-8 text-center">
              <p className="text-muted-foreground">Nenhuma dinâmica encontrada.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
