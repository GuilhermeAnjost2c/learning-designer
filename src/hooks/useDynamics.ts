
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useUserStore } from '@/store/userStore';
import { Dynamic, DynamicCategory } from '@/store/dynamicsStore';

export const useDynamics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useUserStore();

  const fetchDynamics = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('dynamics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching dynamics:', error);
        throw error;
      }

      // Transform data to match our Dynamic interface
      const dynamics: Dynamic[] = data.map(item => ({
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

      return dynamics;
    } catch (err: any) {
      setError(err.message);
      console.error('Error in fetchDynamics:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addDynamic = async (dynamic: Omit<Dynamic, 'id' | 'createdAt'>) => {
    setLoading(true);
    setError(null);
    try {
      if (!currentUser) {
        throw new Error('Você precisa estar logado para adicionar dinâmicas');
      }

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
          created_by: currentUser.id
        })
        .select();

      if (error) {
        console.error('Error adding dynamic:', error);
        throw error;
      }

      toast.success('Dinâmica adicionada com sucesso!');
      return data[0].id;
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao adicionar dinâmica: ' + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateDynamic = async (id: string, dynamic: Partial<Omit<Dynamic, 'id' | 'createdAt'>>) => {
    setLoading(true);
    setError(null);
    try {
      const updateData: any = {};
      
      if (dynamic.name) updateData.name = dynamic.name;
      if (dynamic.category) updateData.category = dynamic.category;
      if (dynamic.objective) updateData.objective = dynamic.objective;
      if (dynamic.materials) updateData.materials = dynamic.materials;
      if (dynamic.description) updateData.description = dynamic.description;
      if (dynamic.duration) updateData.duration = dynamic.duration;
      if (dynamic.minimumParticipants) updateData.minimum_participants = dynamic.minimumParticipants;
      if (dynamic.maximumParticipants) updateData.maximum_participants = dynamic.maximumParticipants;

      const { error } = await supabase
        .from('dynamics')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating dynamic:', error);
        throw error;
      }

      toast.success('Dinâmica atualizada com sucesso!');
      return true;
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao atualizar dinâmica: ' + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteDynamic = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('dynamics')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting dynamic:', error);
        throw error;
      }

      toast.success('Dinâmica removida com sucesso!');
      return true;
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao remover dinâmica: ' + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchDynamics,
    addDynamic,
    updateDynamic,
    deleteDynamic
  };
};
