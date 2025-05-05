
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type DynamicCategory = 
  'Quebra-gelo' | 
  'Energizador' | 
  'Trabalho em Equipe' | 
  'Comunicação' | 
  'Liderança' | 
  'Resolução de Problemas' | 
  'Criatividade' | 
  'Confiança' | 
  'Reflexão' | 
  'Avaliação' |
  'Outro';

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
  createdAt: Date;
  userId?: string;
}

interface DynamicsState {
  dynamics: Dynamic[];
  filteredDynamics: Dynamic[];
  selectedCategory: string | null;
  searchTerm: string;
  isLoading: boolean;
  error: string | null;
  fetchDynamics: () => Promise<void>;
  addDynamic: (dynamic: Omit<Dynamic, 'id' | 'createdAt'>) => Promise<void>;
  updateDynamic: (id: string, dynamic: Partial<Dynamic>) => Promise<void>;
  deleteDynamic: (id: string) => Promise<void>;
  selectCategory: (category: string | null) => void;
  setSearchTerm: (term: string) => void;
}

export const useDynamicsStore = create<DynamicsState>((set, get) => ({
  dynamics: [],
  filteredDynamics: [],
  selectedCategory: null,
  searchTerm: '',
  isLoading: false,
  error: null,
  
  fetchDynamics: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('dynamics')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      // Convert the Supabase data to our Dynamic type
      const formattedDynamics: Dynamic[] = data.map(item => ({
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
        userId: item.user_id
      }));
      
      set({ 
        dynamics: formattedDynamics, 
        filteredDynamics: formattedDynamics,
        isLoading: false 
      });
      
      // Apply any existing filters
      const { selectedCategory, searchTerm } = get();
      if (selectedCategory || searchTerm) {
        get().selectCategory(selectedCategory);
        get().setSearchTerm(searchTerm);
      }
      
    } catch (error: any) {
      console.error('Error fetching dynamics:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  addDynamic: async (dynamic) => {
    try {
      set({ isLoading: true, error: null });
      
      // Convert to snake_case for Supabase
      const { data, error } = await supabase
        .from('dynamics')
        .insert({
          name: dynamic.name,
          category: dynamic.category,
          objective: dynamic.objective,
          materials: dynamic.materials,
          description: dynamic.description,
          duration: dynamic.duration,
          minimum_participants: dynamic.minimumParticipants,
          maximum_participants: dynamic.maximumParticipants,
          user_id: dynamic.userId
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Format the returned dynamic
      const newDynamic: Dynamic = {
        id: data.id,
        name: data.name,
        category: data.category as DynamicCategory,
        objective: data.objective,
        materials: data.materials,
        description: data.description,
        duration: data.duration,
        minimumParticipants: data.minimum_participants,
        maximumParticipants: data.maximum_participants,
        createdAt: new Date(data.created_at),
        userId: data.user_id
      };
      
      // Update the store
      set(state => ({
        dynamics: [...state.dynamics, newDynamic],
        filteredDynamics: get().selectedCategory
          ? [...state.filteredDynamics, newDynamic].filter(d => d.category === get().selectedCategory)
          : [...state.filteredDynamics, newDynamic],
        isLoading: false
      }));
      
      toast.success('Dinâmica adicionada com sucesso!');
      
    } catch (error: any) {
      console.error('Error adding dynamic:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Erro ao adicionar dinâmica');
    }
  },
  
  updateDynamic: async (id, dynamicUpdates) => {
    try {
      set({ isLoading: true, error: null });
      
      // Convert to snake_case for Supabase
      const updates: any = {};
      if (dynamicUpdates.name) updates.name = dynamicUpdates.name;
      if (dynamicUpdates.category) updates.category = dynamicUpdates.category;
      if (dynamicUpdates.objective) updates.objective = dynamicUpdates.objective;
      if (dynamicUpdates.materials) updates.materials = dynamicUpdates.materials;
      if (dynamicUpdates.description) updates.description = dynamicUpdates.description;
      if (dynamicUpdates.duration) updates.duration = dynamicUpdates.duration;
      if (dynamicUpdates.minimumParticipants) updates.minimum_participants = dynamicUpdates.minimumParticipants;
      if (dynamicUpdates.maximumParticipants) updates.maximum_participants = dynamicUpdates.maximumParticipants;
      
      const { error } = await supabase
        .from('dynamics')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      // Update the store
      set(state => {
        const updatedDynamics = state.dynamics.map(d => 
          d.id === id ? { ...d, ...dynamicUpdates } : d
        );
        
        return {
          dynamics: updatedDynamics,
          filteredDynamics: get().selectedCategory
            ? updatedDynamics.filter(d => d.category === get().selectedCategory)
            : updatedDynamics,
          isLoading: false
        };
      });
      
      toast.success('Dinâmica atualizada com sucesso!');
      
    } catch (error: any) {
      console.error('Error updating dynamic:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Erro ao atualizar dinâmica');
    }
  },
  
  deleteDynamic: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('dynamics')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update the store
      set(state => ({
        dynamics: state.dynamics.filter(d => d.id !== id),
        filteredDynamics: state.filteredDynamics.filter(d => d.id !== id),
        isLoading: false
      }));
      
      toast.success('Dinâmica excluída com sucesso!');
      
    } catch (error: any) {
      console.error('Error deleting dynamic:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Erro ao excluir dinâmica');
    }
  },
  
  selectCategory: (category) => {
    set(state => ({
      selectedCategory: category,
      filteredDynamics: category
        ? state.dynamics.filter(d => 
            d.category === category &&
            (state.searchTerm
              ? d.name.toLowerCase().includes(state.searchTerm.toLowerCase())
              : true)
          )
        : state.searchTerm
          ? state.dynamics.filter(d => 
              d.name.toLowerCase().includes(state.searchTerm.toLowerCase())
            )
          : state.dynamics
    }));
  },
  
  setSearchTerm: (term) => {
    set(state => {
      const searchTerm = term.toLowerCase();
      return {
        searchTerm,
        filteredDynamics: state.dynamics.filter(d => 
          (state.selectedCategory ? d.category === state.selectedCategory : true) &&
          (searchTerm ? d.name.toLowerCase().includes(searchTerm) : true)
        )
      };
    });
  }
}));

// Initialize with sample data if needed for development
export const initializeWithSampleData = async () => {
  const { dynamics } = useDynamicsStore.getState();
  
  if (dynamics.length === 0) {
    try {
      // Check if we already have dynamics in the database
      const { data, error } = await supabase
        .from('dynamics')
        .select('id')
        .limit(1);
      
      if (error) throw error;
      
      // If no dynamics exist, add sample data
      if (data.length === 0) {
        const sampleDynamics = [
          {
            name: "Construção de Torre",
            category: "Trabalho em Equipe" as DynamicCategory,
            objective: "Desenvolver habilidades de trabalho em equipe e comunicação",
            materials: "Espaguete cru, fita adesiva, barbante, marshmallow",
            description: "Equipes competem para construir a torre mais alta usando apenas os materiais fornecidos. O marshmallow deve estar no topo.",
            duration: 30,
            minimumParticipants: 4,
            maximumParticipants: 20,
          },
          {
            name: "Dois Verdadeiros e Um Falso",
            category: "Quebra-gelo" as DynamicCategory,
            objective: "Conhecer os participantes de forma divertida",
            materials: "Nenhum",
            description: "Cada participante compartilha três declarações sobre si mesmo - duas verdadeiras e uma falsa. Os outros tentam adivinhar qual é a falsa.",
            duration: 20,
            minimumParticipants: 5,
            maximumParticipants: 30,
          },
          {
            name: "Desafio do Marshmallow",
            category: "Resolução de Problemas" as DynamicCategory,
            objective: "Estimular a criatividade e resolução rápida de problemas",
            materials: "Espaguete cru, fita adesiva, barbante, marshmallow",
            description: "Equipes competem para construir a torre mais alta usando apenas os materiais fornecidos. O marshmallow deve estar no topo.",
            duration: 30,
            minimumParticipants: 4,
            maximumParticipants: 20,
          },
          {
            name: "Feedback em Post-it",
            category: "Avaliação" as DynamicCategory,
            objective: "Coletar feedback dos participantes de maneira estruturada",
            materials: "Post-its de diferentes cores, canetas, quadro ou parede",
            description: "Participantes escrevem feedback em post-its seguindo categorias específicas (ex: positivo, negativo, sugestões) e colam no quadro para discussão.",
            duration: 15,
            minimumParticipants: 3,
            maximumParticipants: 50,
          },
          {
            name: "Chá de Sabedoria",
            category: "Reflexão" as DynamicCategory,
            objective: "Promover reflexão e compartilhamento de conhecimento",
            materials: "Cartões com perguntas reflexivas, cadeiras em círculo",
            description: "Participantes sentam em círculo e respondem a perguntas reflexivas, compartilhando experiências e aprendizados.",
            duration: 40,
            minimumParticipants: 6,
            maximumParticipants: 20,
          }
        ];
        
        for (const dynamic of sampleDynamics) {
          await useDynamicsStore.getState().addDynamic(dynamic);
        }
      }
    } catch (error) {
      console.error('Error initializing dynamics:', error);
    }
  }
};
