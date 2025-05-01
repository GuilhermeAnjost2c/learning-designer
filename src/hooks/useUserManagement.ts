
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/store/userStore';

export const useUserManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = async (email: string, password: string, userData: { 
    role: string, 
    department?: string, 
    name: string 
  }) => {
    setIsLoading(true);
    setError(null);
    
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
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error creating user:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const listUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('manage-users', {
        body: {
          action: 'listUsers'
        }
      });

      if (error) throw error;
      
      // Format users to match our User interface
      const formattedUsers = data?.data?.users?.map(user => ({
        id: user.id,
        name: user.user_metadata?.name || 'Sem nome',
        email: user.email,
        role: user.user_metadata?.role || 'user',
        department: user.user_metadata?.department || null,
        avatar: user.user_metadata?.avatar || null
      })) || [];

      return formattedUsers;
    } catch (err) {
      setError(err.message);
      console.error('Error listing users:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const searchUsers = async (query: string): Promise<User[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('manage-users', {
        body: {
          action: 'searchUsers',
          query
        }
      });

      if (error) throw error;
      
      // Format users to match our User interface
      const formattedUsers = data?.data?.map(user => ({
        id: user.id,
        name: user.user_metadata?.name || 'Sem nome',
        email: user.email,
        role: user.user_metadata?.role || 'user',
        department: user.user_metadata?.department || null,
        avatar: user.user_metadata?.avatar || null
      })) || [];

      return formattedUsers;
    } catch (err) {
      setError(err.message);
      console.error('Error searching users:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createUser,
    listUsers,
    searchUsers
  };
};
