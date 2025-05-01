
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = async (userId: string) => {
    try {
      // Usaremos a tabela de auth.users em vez de profiles
      const { data: userData, error } = await supabase.auth.admin.getUserById(userId);

      if (error) throw error;
      return userData?.user;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  // Adicionar função para criar um usuário (para admin criar contas)
  const createUser = async (email: string, password: string, userData: { role: string, department?: string, name: string }) => {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          role: userData.role,
          department: userData.department || null,
          name: userData.name
        }
      });

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  // Função para atualizar um usuário
  const updateUser = async (userId: string, userData: { password?: string, userData?: object }) => {
    try {
      const { data, error } = await supabase.auth.admin.updateUserById(
        userId,
        userData
      );

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  // Função para buscar usuários por nome (para adicionar colaboradores)
  const searchUsersByName = async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('auth.users')
        .select('id, email, raw_user_meta_data')
        .filter('raw_user_meta_data->name', 'ilike', `%${query}%`)
        .limit(10);

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
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
