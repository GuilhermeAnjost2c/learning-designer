
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSupabase = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          modules (
            *,
            lessons (*)
          ),
          course_collaborators (
            user_id
          ),
          approval_requests (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao buscar cursos: ' + err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = async (userId: string) => {
    try {
      // Buscar informações do usuário através da edge function
      const { data, error } = await supabase.functions.invoke('manage-users', {
        body: {
          action: 'getUserById',
          userId
        }
      });

      if (error) throw error;
      return data?.user;
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao buscar dados do usuário: ' + err.message);
      return null;
    }
  };

  // Adicionar função para criar um usuário (para admin criar contas)
  const createUser = async (email: string, password: string, userData: { role: string, department?: string, name: string }) => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-users', {
        body: {
          action: 'createUser',
          email,
          password,
          userData
        }
      });

      if (error) throw error;
      toast.success('Usuário criado com sucesso');
      return data;
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao criar usuário: ' + err.message);
      return null;
    }
  };

  // Função para atualizar um usuário
  const updateUser = async (userId: string, userData: { password?: string, userData?: object }) => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-users', {
        body: {
          action: 'updateUser',
          userId,
          updates: userData
        }
      });

      if (error) throw error;
      toast.success('Usuário atualizado com sucesso');
      return data;
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao atualizar usuário: ' + err.message);
      return null;
    }
  };

  // Função para buscar usuários por nome (para adicionar colaboradores)
  const searchUsersByName = async (query: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-users', {
        body: {
          action: 'searchUsers',
          query
        }
      });

      if (error) throw error;
      return data?.data || [];
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao buscar usuários: ' + err.message);
      return [];
    }
  };

  return {
    isLoading,
    error,
    fetchCourses,
    fetchUserData,
    createUser,
    updateUser,
    searchUsersByName,
  };
};
