
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
      // Use the correct table name or ensure 'profiles' exists in your Supabase instance
      const { data, error } = await supabase
        .from('users') // Changed from 'profiles' to 'users'
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const searchUsers = async (query: string) => {
    try {
      // Use the correct table name or ensure 'profiles' exists in your Supabase instance
      const { data, error } = await supabase
        .from('users') // Changed from 'profiles' to 'users'
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(10);

      if (error) throw error;
      return data || [];
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
    searchUsers,
  };
};
