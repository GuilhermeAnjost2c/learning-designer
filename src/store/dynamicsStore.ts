
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DynamicCategory = 
  | 'Quebra-gelo' 
  | 'Integração' 
  | 'Energização' 
  | 'Trabalho em equipe' 
  | 'Comunicação' 
  | 'Liderança' 
  | 'Criatividade' 
  | 'Resolução de problemas' 
  | 'Tomada de decisão'
  | 'Feedback'
  | 'Reflexão';

export interface Dynamic {
  id: string;
  name: string;
  category: DynamicCategory;
  objective: string;
  materials: string;
  description: string;
  duration: number; // em minutos
  minimumParticipants: number;
  maximumParticipants: number;
  createdAt: Date;
}

interface DynamicsState {
  dynamics: Dynamic[];
  addDynamic: (dynamic: Omit<Dynamic, 'id' | 'createdAt'>) => string;
  updateDynamic: (id: string, dynamic: Partial<Omit<Dynamic, 'id' | 'createdAt'>>) => void;
  deleteDynamic: (id: string) => void;
  getDynamicsByCategory: (category: DynamicCategory) => Dynamic[];
  searchDynamics: (term: string) => Dynamic[];
}

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

export const useDynamicsStore = create<DynamicsState>()(
  persist(
    (set, get) => ({
      dynamics: [],
      
      addDynamic: (dynamicData) => {
        const id = generateId();
        set((state) => ({
          dynamics: [
            ...state.dynamics,
            {
              ...dynamicData,
              id,
              createdAt: new Date(),
            }
          ]
        }));
        return id;
      },
      
      updateDynamic: (id, dynamicData) => set((state) => ({
        dynamics: state.dynamics.map((dynamic) => 
          dynamic.id === id 
            ? { ...dynamic, ...dynamicData } 
            : dynamic
        ),
      })),
      
      deleteDynamic: (id) => set((state) => ({
        dynamics: state.dynamics.filter((dynamic) => dynamic.id !== id),
      })),
      
      getDynamicsByCategory: (category) => {
        const { dynamics } = get();
        return dynamics.filter((dynamic) => dynamic.category === category);
      },
      
      searchDynamics: (term) => {
        const { dynamics } = get();
        const lowerCaseTerm = term.toLowerCase();
        return dynamics.filter((dynamic) => 
          dynamic.name.toLowerCase().includes(lowerCaseTerm) ||
          dynamic.description.toLowerCase().includes(lowerCaseTerm) ||
          dynamic.objective.toLowerCase().includes(lowerCaseTerm)
        );
      },
    }),
    {
      name: 'dynamics-storage',
    }
  )
);
