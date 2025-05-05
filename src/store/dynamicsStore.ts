
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { nanoid } from "nanoid";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { sampleDynamics } from "@/utils/sampleDynamics";

// Types for the dynamics
export type DynamicActivityType = 'Energizer' | 'IceBreaker' | 'TeamBuilding' | 'Reflection' | 'Problem Solving';
export type DynamicCategory = 'Comunicação' | 'Liderança' | 'Criatividade' | 'Colaboração' | 'Inovação';

export interface DynamicActivity {
  id: string;
  name: string;
  category: DynamicCategory;
  objective: string;
  materials: string;
  description: string;
  duration: number;
  minimumParticipants: number;
  maximumParticipants: number;
  steps: string[];
  tags: string[];
  createdBy: string;
  createdAt: Date;
}

export interface DynamicsState {
  activities: DynamicActivity[];
  categories: DynamicCategory[];
  loading: boolean;
  initialized: boolean;
  initializeDynamics: (userId: string) => Promise<void>;
  addActivity: (activity: Omit<DynamicActivity, 'id' | 'createdAt'>) => void;
  updateActivity: (id: string, updates: Partial<DynamicActivity>) => void;
  deleteActivity: (id: string) => void;
  filterByCategory: (category: DynamicCategory | null) => DynamicActivity[];
  searchActivities: (query: string) => DynamicActivity[];
}

export const useDynamicsStore = create<DynamicsState>()(
  devtools(
    (set, get) => ({
      activities: [],
      categories: ['Comunicação', 'Liderança', 'Criatividade', 'Colaboração', 'Inovação'],
      loading: true,
      initialized: false,

      initializeDynamics: async (userId: string) => {
        set({ loading: true });

        try {
          // This should be updated when we have an actual dynamics table in the database
          // For now it's using sampleDynamics from utils
          const dynamicsData = sampleDynamics.map((dynamic) => ({
            ...dynamic,
            createdBy: userId,
            createdAt: new Date(),
          }));

          set({
            activities: dynamicsData,
            loading: false,
            initialized: true,
          });
        } catch (error: any) {
          console.error("Error initializing dynamics:", error.message);
          toast.error(`Erro ao carregar dinâmicas: ${error.message}`);
          set({ loading: false, initialized: true });
        }
      },

      addActivity: (activity) => {
        const newActivity = {
          ...activity,
          id: nanoid(),
          createdAt: new Date(),
        };

        set((state) => ({
          activities: [newActivity, ...state.activities],
        }));
      },

      updateActivity: (id, updates) => {
        set((state) => ({
          activities: state.activities.map((activity) =>
            activity.id === id ? { ...activity, ...updates } : activity
          ),
        }));
      },

      deleteActivity: (id) => {
        set((state) => ({
          activities: state.activities.filter((activity) => activity.id !== id),
        }));
      },

      filterByCategory: (category) => {
        const { activities } = get();
        if (!category) return activities;
        return activities.filter((activity) => activity.category === category);
      },

      searchActivities: (query) => {
        const { activities } = get();
        const lowercaseQuery = query.toLowerCase();
        
        return activities.filter(
          (activity) =>
            activity.name.toLowerCase().includes(lowercaseQuery) ||
            activity.description.toLowerCase().includes(lowercaseQuery) ||
            activity.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
        );
      },
    }),
    { name: "dynamics-store" }
  )
);
