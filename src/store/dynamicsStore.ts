
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { nanoid } from "nanoid";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type DynamicCategory =
  | "Quebra-gelo"
  | "Integração"
  | "Energização"
  | "Trabalho em equipe"
  | "Comunicação"
  | "Liderança"
  | "Criatividade"
  | "Resolução de problemas"
  | "Tomada de decisão"
  | "Feedback"
  | "Reflexão";

export interface Dynamic {
  id: string;
  name: string;
  category: DynamicCategory;
  objective: string;
  materials: string;
  description: string;
  duration: number;
  minimumParticipants: number;
  maximumParticipants: number;
  createdAt?: Date;
  createdBy?: string;
}

interface DynamicsState {
  dynamics: Dynamic[];
  loading: boolean;
  error: string | null;
  fetchDynamics: () => Promise<void>;
  addDynamic: (dynamic: Omit<Dynamic, "id" | "createdAt">) => string;
  updateDynamic: (id: string, dynamic: Partial<Dynamic>) => void;
  deleteDynamic: (id: string) => void;
}

export const useDynamicsStore = create<DynamicsState>()(
  devtools((set, get) => ({
    dynamics: [],
    loading: false,
    error: null,

    fetchDynamics: async () => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from("dynamics")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Transform the data to match our Dynamic interface
        const dynamics = data.map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category as DynamicCategory,
          objective: item.objective,
          materials: item.materials,
          description: item.description,
          duration: item.duration,
          minimumParticipants: item.minimum_participants,
          maximumParticipants: item.maximum_participants,
          createdAt: new Date(item.created_at),
          createdBy: item.created_by,
        }));

        set({ dynamics, loading: false });
      } catch (error: any) {
        console.error("Error fetching dynamics:", error);
        set({ error: error.message, loading: false });
      }
    },

    addDynamic: (dynamicData) => {
      const id = nanoid(7);
      const { currentUser } = require("@/store/userStore").useUserStore.getState();
      
      const newDynamic: Dynamic = {
        ...dynamicData,
        id,
        createdAt: new Date(),
        createdBy: currentUser?.id,
      };

      set((state) => ({ dynamics: [...state.dynamics, newDynamic] }));

      // Save to Supabase in the background
      supabase
        .from("dynamics")
        .insert({
          name: dynamicData.name,
          category: dynamicData.category,
          objective: dynamicData.objective,
          materials: dynamicData.materials,
          description: dynamicData.description,
          duration: dynamicData.duration,
          minimum_participants: dynamicData.minimumParticipants,
          maximum_participants: dynamicData.maximumParticipants,
          created_by: currentUser?.id,
        })
        .then(({ error }) => {
          if (error) {
            console.error("Error saving dynamic to Supabase:", error);
            toast.error("Falha ao salvar dinâmica no banco de dados");
          } else {
            console.log("Dynamic saved to Supabase successfully");
          }
        });

      return id;
    },

    updateDynamic: (id, dynamicData) => {
      set((state) => ({
        dynamics: state.dynamics.map((dynamic) =>
          dynamic.id === id ? { ...dynamic, ...dynamicData } : dynamic
        ),
      }));

      // Update in Supabase
      const snakeCaseData = Object.entries(dynamicData).reduce(
        (acc, [key, value]) => {
          if (key === "minimumParticipants") {
            acc.minimum_participants = value;
          } else if (key === "maximumParticipants") {
            acc.maximum_participants = value;
          } else if (key === "createdAt" || key === "createdBy" || key === "id") {
            // Skip these fields
          } else {
            // @ts-ignore
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, any>
      );

      supabase
        .from("dynamics")
        .update(snakeCaseData)
        .eq("id", id)
        .then(({ error }) => {
          if (error) {
            console.error("Error updating dynamic in Supabase:", error);
            toast.error("Falha ao atualizar dinâmica no banco de dados");
          }
        });
    },

    deleteDynamic: (id) => {
      set((state) => ({
        dynamics: state.dynamics.filter((dynamic) => dynamic.id !== id),
      }));

      // Delete from Supabase
      supabase
        .from("dynamics")
        .delete()
        .eq("id", id)
        .then(({ error }) => {
          if (error) {
            console.error("Error deleting dynamic from Supabase:", error);
            toast.error("Falha ao excluir dinâmica do banco de dados");
          }
        });
    },
  }))
);
