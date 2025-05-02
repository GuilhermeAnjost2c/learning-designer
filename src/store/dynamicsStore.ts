
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

export interface DynamicsCategory {
  id: string;
  name: string;
}

export interface DynamicsActivity {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: number; 
  teamSize: number;
  format: string;
}

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
  dynamicsActivities: DynamicsActivity[];
  dynamicsCategories: DynamicsCategory[];
  addDynamic: (dynamic: Omit<Dynamic, 'id' | 'createdAt'>) => string;
  updateDynamic: (id: string, dynamic: Partial<Omit<Dynamic, 'id' | 'createdAt'>>) => void;
  deleteDynamic: (id: string) => void;
  getDynamicsByCategory: (category: DynamicCategory) => Dynamic[];
  searchDynamics: (term: string) => Dynamic[];
}

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Sample categories
const sampleCategories = [
  { id: 'quebra-gelo', name: 'Quebra-gelo' },
  { id: 'integracao', name: 'Integração' },
  { id: 'energizacao', name: 'Energização' },
  { id: 'trabalho-equipe', name: 'Trabalho em equipe' },
  { id: 'comunicacao', name: 'Comunicação' },
  { id: 'lideranca', name: 'Liderança' },
  { id: 'criatividade', name: 'Criatividade' },
  { id: 'resolucao-problemas', name: 'Resolução de problemas' },
  { id: 'tomada-decisao', name: 'Tomada de decisão' },
  { id: 'feedback', name: 'Feedback' },
  { id: 'reflexao', name: 'Reflexão' },
];

// Sample activities for visualization
const sampleActivities = [
  {
    id: '1',
    title: 'Dois Verdades e Uma Mentira',
    category: 'quebra-gelo',
    description: 'Cada participante compartilha três informações sobre si: duas verdadeiras e uma falsa. Os demais devem tentar identificar qual é a mentira.',
    duration: 15,
    teamSize: 4,
    format: 'Presencial'
  },
  {
    id: '2',
    title: 'Bingo Humano',
    category: 'quebra-gelo',
    description: 'Distribua cartões com diferentes características. Os participantes circulam buscando pessoas que se encaixem nas descrições e coletam assinaturas.',
    duration: 20,
    teamSize: 8,
    format: 'Presencial'
  },
  {
    id: '3',
    title: 'Construção de Torre',
    category: 'integracao',
    description: 'Divida em equipes. Cada grupo deve construir a torre mais alta possível usando apenas os materiais fornecidos, dentro do tempo determinado.',
    duration: 30,
    teamSize: 5,
    format: 'Presencial'
  }
];

export const useDynamicsStore = create<DynamicsState>()(
  persist(
    (set, get) => ({
      dynamics: [],
      dynamicsActivities: sampleActivities,
      dynamicsCategories: sampleCategories,
      
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
