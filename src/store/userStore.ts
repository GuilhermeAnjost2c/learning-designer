import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { DepartmentName } from '@/types/course';

export type UserRole = 'admin' | 'instructor' | 'student' | 'manager';

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
  
  // User management functions
  fetchUsers: () => Promise<User[]>;
  getUserById: (id: string) => User | undefined;
  getUsersByDepartment: (department: DepartmentName) => User[];
  getAllManagers: () => User[];
  
  // Additional user management methods
  addUser: (userData: Omit<User, 'id'>) => Promise<boolean>;
  updateUser: (id: string, userData: Partial<User>) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
}

// Re-export DepartmentName as a type
export type { DepartmentName };

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,
      isAuthenticated: false,
      
      login: async (email, password) => {
        try {
          console.log("Login attempt with:", email);
          
          // Try to authenticate with Supabase
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (error) {
            console.error("Supabase auth error:", error);
            return false;
          }
          
          console.log("Auth data from Supabase:", data);
          
          if (data?.user) {
            // Fetch profile data
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();
            
            console.log("Profile data from Supabase:", profileData, "Error:", profileError);
            
            if (profileError) {
              console.error("Profile fetch error:", profileError);
            }
            
            const userRole = profileData?.role as UserRole || 'student';
            const userDept = profileData?.department as DepartmentName;
            
            const userData: User = {
              id: data.user.id,
              name: profileData?.name || email,
              email: data.user.email!,
              role: userRole,
              department: userDept,
              createdAt: data.user.created_at ? new Date(data.user.created_at) : new Date(),
            };
            
            set({ 
              currentUser: userData,
              isAuthenticated: true
            });
            
            console.log("Login successful:", userData);
            return true;
          }
          
          console.log("Login failed: Invalid credentials");
          return false;
        } catch (error: any) {
          console.error('Login error:', error);
          return false;
        }
      },
      
      logout: async () => {
        try {
          console.log("Logging out user");
          await supabase.auth.signOut();
          set({ currentUser: null, isAuthenticated: false });
          toast.info("Logout realizado");
        } catch (error: any) {
          console.error("Error during logout:", error);
          toast.error("Erro ao fazer logout: " + error.message);
        }
      },
      
      setCurrentUser: (user) => {
        console.log("Setting current user:", user);
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
        } catch (error: any) {
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
      
      // Implementação completa dos métodos de gerenciamento de usuários
      addUser: async (userData) => {
        try {
          console.log("Adding new user:", userData);
          // Em um app real, chamaríamos Supabase para criar um usuário
          // Por enquanto, apenas adicionamos ao armazenamento local
          const newUser = {
            ...userData,
            id: Math.random().toString(36).substring(2, 9),
            createdAt: new Date()
          };
          
          set(state => ({
            users: [...state.users, newUser]
          }));
          
          return true;
        } catch (error) {
          console.error('Error adding user:', error);
          return false;
        }
      },
      
      updateUser: async (id, userData) => {
        try {
          console.log("Updating user:", id, userData);
          set(state => ({
            users: state.users.map(user => 
              user.id === id ? { ...user, ...userData } : user
            )
          }));
          
          return true;
        } catch (error) {
          console.error('Error updating user:', error);
          return false;
        }
      },
      
      deleteUser: async (id) => {
        try {
          console.log("Deleting user:", id);
          set(state => ({
            users: state.users.filter(user => user.id !== id)
          }));
          
          return true;
        } catch (error) {
          console.error('Error deleting user:', error);
          return false;
        }
      },
    }),
    {
      name: 'user-storage',
    }
  )
);
