
import { create } from "zustand";

export type DynamicCategory = string;
export type DynamicActivity = {
  id: string;
  name: string;
  description: string;
  category: DynamicCategory;
  duration: number;
  materials?: string[];
  instructions?: string;
  objectives?: string[];
  targetAudience?: string[];
};

interface DynamicsState {
  activities: DynamicActivity[];
  categories: DynamicCategory[];
  initializeDynamics: (userId: string) => void;
  addDynamic: (dynamic: DynamicActivity) => void;
  filterByCategory: (category: DynamicCategory) => DynamicActivity[];
  searchActivities: (term: string) => DynamicActivity[];
}

export const useDynamicsStore = create<DynamicsState>((set, get) => ({
  activities: [
    {
      id: "1",
      name: "Brainstorming",
      description: "Uma técnica para gerar ideias em grupo.",
      category: "Criatividade",
      duration: 30,
    },
    {
      id: "2",
      name: "Mapa Mental",
      description: "Técnica para organizar pensamentos e ideias visualmente.",
      category: "Organização",
      duration: 45,
    },
    {
      id: "3",
      name: "Design Thinking",
      description: "Abordagem focada em soluções com empatia pelo usuário.",
      category: "Metodologia",
      duration: 90,
    },
    {
      id: "4",
      name: "World Café",
      description: "Método para criar conversas em grupo sobre temas específicos.",
      category: "Colaboração",
      duration: 60,
    },
  ],
  categories: ["Criatividade", "Organização", "Metodologia", "Colaboração"],

  initializeDynamics: (userId: string) => {
    // In a real app, this would fetch from an API or database
    console.log("Initializing dynamics for user:", userId);
    // For now, we'll use the default data
  },

  addDynamic: (dynamic: DynamicActivity) => {
    set((state) => ({
      activities: [...state.activities, dynamic],
      categories: state.categories.includes(dynamic.category)
        ? state.categories
        : [...state.categories, dynamic.category],
    }));
  },

  filterByCategory: (category: DynamicCategory) => {
    const state = get();
    return state.activities.filter((activity) => activity.category === category);
  },

  searchActivities: (term: string) => {
    const state = get();
    const lowerTerm = term.toLowerCase();
    return state.activities.filter(
      (activity) =>
        activity.name.toLowerCase().includes(lowerTerm) ||
        activity.description.toLowerCase().includes(lowerTerm)
    );
  },
}));
