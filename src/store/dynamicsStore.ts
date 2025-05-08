
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { useDynamics } from '@/hooks/useDynamics';
import { supabase } from '@/integrations/supabase/client';

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
  isInitialized: boolean;
  isLoading: boolean;
  addDynamic: (dynamic: Omit<Dynamic, 'id' | 'createdAt'>) => Promise<string | null>;
  updateDynamic: (id: string, dynamic: Partial<Omit<Dynamic, 'id' | 'createdAt'>>) => Promise<boolean>;
  deleteDynamic: (id: string) => Promise<boolean>;
  getDynamicsByCategory: (category: DynamicCategory) => Dynamic[];
  searchDynamics: (term: string) => Dynamic[];
  addDynamicToModule: (courseId: string, moduleId: string, dynamicId: string) => void;
  fetchAllDynamics: () => Promise<void>;
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
      isInitialized: false,
      isLoading: false,
      
      fetchAllDynamics: async () => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase
            .from('dynamics')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error fetching dynamics:', error);
            toast.error('Erro ao carregar dinâmicas: ' + error.message);
            return;
          }

          // Transform database data to match our Dynamic interface
          const dynamicsData: Dynamic[] = data.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category as DynamicCategory,
            objective: item.objective,
            materials: item.materials,
            description: item.description,
            duration: item.duration,
            minimumParticipants: item.minimum_participants,
            maximumParticipants: item.maximum_participants,
            createdAt: new Date(item.created_at)
          }));

          set({ 
            dynamics: dynamicsData,
            isInitialized: true,
            isLoading: false
          });
        } catch (error: any) {
          console.error('Error in fetchAllDynamics:', error);
          set({ isLoading: false });
        }
      },
      
      addDynamic: async (dynamicData) => {
        try {
          set({ isLoading: true });
          const { currentUser } = useUserStore.getState();
          
          if (!currentUser) {
            toast.error('Você precisa estar logado para adicionar dinâmicas');
            set({ isLoading: false });
            return null;
          }

          const { data, error } = await supabase
            .from('dynamics')
            .insert({
              name: dynamicData.name,
              category: dynamicData.category,
              objective: dynamicData.objective,
              materials: dynamicData.materials,
              description: dynamicData.description,
              duration: dynamicData.duration,
              minimum_participants: dynamicData.minimumParticipants,
              maximum_participants: dynamicData.maximumParticipants,
              created_by: currentUser.id
            })
            .select();

          if (error) {
            console.error('Error adding dynamic:', error);
            toast.error('Erro ao adicionar dinâmica: ' + error.message);
            set({ isLoading: false });
            return null;
          }

          // Add to local state
          const newDynamic: Dynamic = {
            id: data[0].id,
            name: dynamicData.name,
            category: dynamicData.category,
            objective: dynamicData.objective,
            materials: dynamicData.materials,
            description: dynamicData.description,
            duration: dynamicData.duration,
            minimumParticipants: dynamicData.minimumParticipants,
            maximumParticipants: dynamicData.maximumParticipants,
            createdAt: new Date()
          };

          set(state => ({
            dynamics: [newDynamic, ...state.dynamics],
            isLoading: false
          }));

          toast.success('Dinâmica adicionada com sucesso!');
          return newDynamic.id;
        } catch (error: any) {
          console.error('Error in addDynamic:', error);
          toast.error('Erro ao adicionar dinâmica');
          set({ isLoading: false });
          return null;
        }
      },
      
      updateDynamic: async (id, dynamicData) => {
        try {
          set({ isLoading: true });
          
          const updateData: any = {};
          
          if (dynamicData.name !== undefined) updateData.name = dynamicData.name;
          if (dynamicData.category !== undefined) updateData.category = dynamicData.category;
          if (dynamicData.objective !== undefined) updateData.objective = dynamicData.objective;
          if (dynamicData.materials !== undefined) updateData.materials = dynamicData.materials;
          if (dynamicData.description !== undefined) updateData.description = dynamicData.description;
          if (dynamicData.duration !== undefined) updateData.duration = dynamicData.duration;
          if (dynamicData.minimumParticipants !== undefined) updateData.minimum_participants = dynamicData.minimumParticipants;
          if (dynamicData.maximumParticipants !== undefined) updateData.maximum_participants = dynamicData.maximumParticipants;

          const { error } = await supabase
            .from('dynamics')
            .update(updateData)
            .eq('id', id);

          if (error) {
            console.error('Error updating dynamic:', error);
            toast.error('Erro ao atualizar dinâmica: ' + error.message);
            set({ isLoading: false });
            return false;
          }

          // Update local state
          set(state => ({
            dynamics: state.dynamics.map(dynamic => 
              dynamic.id === id ? { ...dynamic, ...dynamicData } : dynamic
            ),
            isLoading: false
          }));

          toast.success('Dinâmica atualizada com sucesso!');
          return true;
        } catch (error: any) {
          console.error('Error in updateDynamic:', error);
          toast.error('Erro ao atualizar dinâmica');
          set({ isLoading: false });
          return false;
        }
      },
      
      deleteDynamic: async (id) => {
        try {
          set({ isLoading: true });
          
          const { error } = await supabase
            .from('dynamics')
            .delete()
            .eq('id', id);

          if (error) {
            console.error('Error deleting dynamic:', error);
            toast.error('Erro ao remover dinâmica: ' + error.message);
            set({ isLoading: false });
            return false;
          }

          // Update local state
          set(state => ({
            dynamics: state.dynamics.filter(dynamic => dynamic.id !== id),
            isLoading: false
          }));

          toast.success('Dinâmica removida com sucesso!');
          return true;
        } catch (error: any) {
          console.error('Error in deleteDynamic:', error);
          toast.error('Erro ao remover dinâmica');
          set({ isLoading: false });
          return false;
        }
      },
      
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

      addDynamicToModule: (courseId, moduleId, dynamicId) => {
        const { dynamics } = get();
        const dynamic = dynamics.find(d => d.id === dynamicId);
        
        if (!dynamic) return;

        try {
          // Get the courseStore to add a lesson
          const courseStore = require('./courseStore').useCourseStore.getState();
          
          courseStore.addLesson(courseId, moduleId, {
            title: `Dinâmica: ${dynamic.name}`,
            description: `**Objetivo:** ${dynamic.objective}\n\n**Descrição:** ${dynamic.description}\n\n**Materiais:** ${dynamic.materials}\n\n**Participantes:** ${dynamic.minimumParticipants} a ${dynamic.maximumParticipants}`,
            duration: dynamic.duration,
            activityType: "Dinâmica",
            notes: `Dinâmica importada do Banco de Dinâmicas: ${dynamic.name} (${dynamic.category})`
          });
          
          toast.success('Dinâmica adicionada ao módulo com sucesso!');
        } catch (error: any) {
          console.error('Error adding dynamic to module:', error);
          toast.error('Erro ao adicionar dinâmica ao módulo');
        }
      }
    }),
    {
      name: 'dynamics-storage',
    }
  )
);
