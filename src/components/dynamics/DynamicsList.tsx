
import { Dynamic } from "@/store/dynamicsStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

interface DynamicsListProps {
  dynamics: Dynamic[];
}

export function DynamicsList({ dynamics }: DynamicsListProps) {
  if (dynamics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-muted/40 rounded-lg border border-dashed">
        <p className="text-muted-foreground text-center">
          Nenhuma dinâmica encontrada. Adicione sua primeira dinâmica!
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dynamics.map((dynamic) => (
        <Card 
          key={dynamic.id} 
          className="overflow-hidden hover:shadow-md transition-shadow"
        >
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{dynamic.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{dynamic.objective}</p>
              </div>
              <Badge>{dynamic.category}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {dynamic.description}
              </p>
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
