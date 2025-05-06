
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'instructor' | 'student' | 'manager';
export type DepartmentName = 'Marketing' | 'Vendas' | 'RH' | 'TI' | 'Operações';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: DepartmentName;
  createdAt?: Date;
}

interface UserState {
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Authentication
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setCurrentUser: (user: User) => void;
  
  // User management
  fetchUsers: () => Promise<User[]>;
  getUserById: (id: string) => User | undefined;
  getUsersByDepartment: (department: DepartmentName) => User[];
  getAllManagers: () => User[];
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,
      isAuthenticated: false,
      
      login: async (email, password) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (error) throw error;
          
          if (data?.user) {
            // Fetch profile data
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();
            
            const userData: User = {
              id: data.user.id,
              name: profileData?.name || email,
              email: data.user.email!,
              role: (profileData?.role as UserRole) || 'student',
              department: profileData?.department as DepartmentName,
              createdAt: data.user.created_at ? new Date(data.user.created_at) : new Date(),
            };
            
            set({ 
              currentUser: userData,
              isAuthenticated: true
            });
            
            return true;
          }
          
          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },
      
      logout: async () => {
        await supabase.auth.signOut();
        set({ currentUser: null, isAuthenticated: false });
      },
      
      setCurrentUser: (user) => {
        set({ currentUser: user, isAuthenticated: true });
      },
      
      fetchUsers: async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*');
          
          if (error) throw error;
          
          const users = data.map(profile => ({
            id: profile.id,
            name: profile.name || profile.email || 'Unknown',
            email: profile.email || '',
            role: profile.role as UserRole,
            department: profile.department as DepartmentName,
          }));
          
          set({ users });
          return users;
        } catch (error) {
          console.error('Error fetching users:', error);
          return [];
        }
      },
      
      getUserById: (id) => {
        return get().users.find(user => user.id === id);
      },
      
      getUsersByDepartment: (department) => {
        return get().users.filter(user => user.department === department);
      },
      
      getAllManagers: () => {
        return get().users.filter(user => user.role === 'manager' || user.role === 'admin');
      },
    }),
    {
      name: 'user-storage',
    }
  )
);
