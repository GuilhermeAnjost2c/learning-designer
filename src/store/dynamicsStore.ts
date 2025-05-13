
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
  addDynamicToModule: (courseId: string, moduleId: string, dynamicId: string) => void;
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

// Sample dynamics data with proper typing for category
const sampleDynamics: Dynamic[] = [
  {
    id: generateId(),
    name: 'Círculo de Apresentação',
    category: 'Quebra-gelo',
    objective: 'Promover a integração do grupo e conhecimento mútuo',
    materials: 'Nenhum material necessário',
    description: 'Os participantes ficam em círculo e cada um se apresenta dizendo nome, função e uma curiosidade pessoal.',
    duration: 20,
    minimumParticipants: 5,
    maximumParticipants: 20,
    createdAt: new Date()
  },
  {
    id: generateId(),
    name: 'Desafio dos Marshmallows',
    category: 'Trabalho em equipe',
    objective: 'Desenvolver trabalho em equipe e pensamento criativo',
    materials: 'Marshmallows, espaguete cru, fita adesiva, barbante',
    description: 'Em grupos, os participantes devem construir a estrutura mais alta possível usando apenas os materiais fornecidos.',
    duration: 30,
    minimumParticipants: 8,
    maximumParticipants: 24,
    createdAt: new Date()
  },
  {
    id: generateId(),
    name: 'Feedback em Post-its',
    category: 'Feedback',
    objective: 'Promover a cultura de feedback construtivo',
    materials: 'Post-its de três cores diferentes, canetas',
    description: 'Cada participante escreve em post-its diferentes aspectos positivos, pontos a melhorar e sugestões para os colegas.',
    duration: 25,
    minimumParticipants: 4,
    maximumParticipants: 15,
    createdAt: new Date()
  }
];

export const useDynamicsStore = create<DynamicsState>()(
  persist(
    (set, get) => ({
      dynamics: sampleDynamics,
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

      // New method to add a dynamic to a module as a lesson
      addDynamicToModule: (courseId, moduleId, dynamicId) => {
        const { dynamics } = get();
        const dynamic = dynamics.find(d => d.id === dynamicId);
        
        if (!dynamic) return;

        // We need to import the course store and add a lesson
        // This is a simple implementation - you would integrate with the courseStore
        const courseStore = require('./courseStore').useCourseStore.getState();
        
        courseStore.addLesson(courseId, moduleId, {
          title: `Dinâmica: ${dynamic.name}`,
          description: `**Objetivo:** ${dynamic.objective}\n\n**Descrição:** ${dynamic.description}\n\n**Materiais:** ${dynamic.materials}\n\n**Participantes:** ${dynamic.minimumParticipants} a ${dynamic.maximumParticipants}`,
          duration: dynamic.duration,
          activityType: "Dinâmica",
          notes: `Dinâmica importada do Banco de Dinâmicas: ${dynamic.name} (${dynamic.category})`
        });
      }
    }),
    {
      name: 'dynamics-storage',
    }
  )
);
