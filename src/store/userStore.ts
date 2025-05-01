
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'manager' | 'instructor' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string | null;
  avatar?: string | null;
}

interface UserState {
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  
  setCurrentUser: (user: User | null) => void;
  addUser: (user: User) => void;
  updateUser: (userId: string, userData: Partial<User>) => void;
  removeUser: (userId: string) => void;
  
  setUsers: (users: User[]) => void;
  getAllManagers: () => User[];
  
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,
      isAuthenticated: false,

      setCurrentUser: (user) => set({ 
        currentUser: user,
        isAuthenticated: !!user
      }),
      
      addUser: (user) => set((state) => ({
        users: [...state.users, user]
      })),
      
      updateUser: (userId, userData) => set((state) => ({
        users: state.users.map(user =>
          user.id === userId ? { ...user, ...userData } : user
        ),
        // If we're updating the current user, also update the currentUser state
        currentUser: state.currentUser?.id === userId
          ? { ...state.currentUser, ...userData }
          : state.currentUser
      })),
      
      removeUser: (userId) => set((state) => ({
        users: state.users.filter(user => user.id !== userId)
      })),
      
      setUsers: (users) => set({ users }),
      
      getAllManagers: () => {
        const { users } = get();
        return users.filter(
          user => user.role === 'manager' || user.role === 'admin'
        );
      },
      
      logout: async () => {
        await supabase.auth.signOut();
        set({ currentUser: null, isAuthenticated: false });
      }
    }),
    {
      name: 'user-storage',
    }
  )
);
