
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
      // Try to fetch from 'users' table first, then fall back to 'profiles' if needed
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.log("Failed to fetch from profiles, trying users table instead");
        // If profiles table failed, try users table
        const response = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (response.error) throw response.error;
        data = response.data;
      }

      return data;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const searchUsers = async (query: string) => {
    try {
      // Try to search in 'profiles' table first, then fall back to 'users' if needed
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(10);

      if (error) {
        console.log("Failed to search in profiles, trying users table instead");
        // If profiles table failed, try users table
        const response = await supabase
          .from('users')
          .select('*')
          .ilike('name', `%${query}%`)
          .limit(10);
          
        if (response.error) throw response.error;
        data = response.data;
      }

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
