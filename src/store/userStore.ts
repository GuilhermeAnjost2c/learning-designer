
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

export type UserRole = 'admin' | 'instructor' | 'student' | 'manager';
export type DepartmentName = 'Marketing' | 'Vendas' | 'RH' | 'TI' | 'Operações';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // In a real app, this would be hashed
  role: UserRole;
  department?: DepartmentName;
  assignedCourses?: string[]; // Course IDs
  createdAt?: Date;
  managedUsers?: string[]; // User IDs of people managed by this user
  avatar?: string; // URL para avatar do usuário
}

interface UserState {
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Authentication
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setCurrentUser: (user: User | null) => void;
  
  // User management
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUserById: (id: string) => User | undefined;
  getUsersByDepartment: (department: DepartmentName) => User[];
  
  // Course assignments
  assignUserToCourse: (userId: string, courseId: string) => void;
  removeUserFromCourse: (userId: string, courseId: string) => void;
  
  // Manager assignments
  assignUserToManager: (userId: string, managerId: string) => void;
  removeUserFromManager: (userId: string, managerId: string) => void;
  getManagedUsers: (managerId: string) => User[];
  getManagersForUser: (userId: string) => User[];
  getAllManagers: () => User[];
}

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Email validation helper
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [
        // Default admin user
        {
          id: 'admin-1',
          name: 'Administrador',
          email: 'admin@example.com',
          password: 'admin123', // In a real app, this would be hashed
          role: 'admin',
          createdAt: new Date(),
        },
        // Default manager
        {
          id: 'manager-1',
          name: 'Gerente de TI',
          email: 'manager@example.com',
          password: 'manager123', // In a real app, this would be hashed
          role: 'manager',
          department: 'TI',
          createdAt: new Date(),
          managedUsers: []
        },
        // Default instructor
        {
          id: 'instructor-1',
          name: 'Instrutor',
          email: 'instructor@example.com',
          password: 'instructor123', // In a real app, this would be hashed
          role: 'instructor',
          department: 'TI',
          createdAt: new Date(),
        }
      ],
      currentUser: null,
      isAuthenticated: false,
      
      setCurrentUser: (user) => set({ currentUser: user, isAuthenticated: !!user }),
      
      login: (email, password) => {
        const user = get().users.find(
          (u) => u.email === email && u.password === password
        );
        
        if (user) {
          set({ currentUser: user, isAuthenticated: true });
          return true;
        }
        
        return false;
      },
      
      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },
      
      addUser: (userData) => {
        // Validate user data
        if (!userData.name || userData.name.trim() === '') {
          toast.error('O nome do usuário é obrigatório');
          return;
        }
        
        if (!userData.email || !isValidEmail(userData.email)) {
          toast.error('Email inválido');
          return;
        }
        
        if (!userData.password || userData.password.length < 6) {
          toast.error('A senha deve ter pelo menos 6 caracteres');
          return;
        }
        
        // Check if email is already in use
        const existingUser = get().users.find(user => user.email === userData.email);
        if (existingUser) {
          toast.error('Este email já está em uso');
          return;
        }
        
        const now = new Date();
        const newUser: User = {
          ...userData,
          id: generateId(),
          createdAt: now,
        };
        
        set((state) => ({
          users: [...state.users, newUser],
        }));
        
        toast.success('Usuário criado com sucesso');
      },
      
      updateUser: (id, userData) => {
        // Validate email if it's being updated
        if (userData.email && !isValidEmail(userData.email)) {
          toast.error('Email inválido');
          return;
        }
        
        // Check if the new email is already in use by another user
        if (userData.email) {
          const existingUser = get().users.find(
            user => user.email === userData.email && user.id !== id
          );
          if (existingUser) {
            toast.error('Este email já está em uso');
            return;
          }
        }
        
        // Validate password if it's being updated
        if (userData.password && userData.password.length < 6) {
          toast.error('A senha deve ter pelo menos 6 caracteres');
          return;
        }
        
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...userData } : user
          ),
          // If we're updating the current user, update that too
          currentUser: state.currentUser?.id === id 
            ? { ...state.currentUser, ...userData }
            : state.currentUser
        }));
        
        toast.success('Usuário atualizado com sucesso');
      },
      
      deleteUser: (id) => {
        // Check if we're trying to delete the current user
        if (get().currentUser?.id === id) {
          toast.error('Você não pode excluir sua própria conta');
          return;
        }
        
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        }));
        
        toast.success('Usuário excluído com sucesso');
      },
      
      getUserById: (id) => {
        return get().users.find(user => user.id === id);
      },
      
      getUsersByDepartment: (department) => {
        return get().users.filter(user => user.department === department);
      },
      
      assignUserToCourse: (userId, courseId) => {
        set((state) => ({
          users: state.users.map((user) => {
            if (user.id === userId) {
              const assignedCourses = user.assignedCourses || [];
              if (!assignedCourses.includes(courseId)) {
                return {
                  ...user,
                  assignedCourses: [...assignedCourses, courseId],
                };
              }
            }
            return user;
          }),
        }));
        
        toast.success('Usuário atribuído ao curso com sucesso');
      },
      
      removeUserFromCourse: (userId, courseId) => {
        set((state) => ({
          users: state.users.map((user) => {
            if (user.id === userId && user.assignedCourses) {
              return {
                ...user,
                assignedCourses: user.assignedCourses.filter((id) => id !== courseId),
              };
            }
            return user;
          }),
        }));
        
        toast.success('Usuário removido do curso com sucesso');
      },
      
      assignUserToManager: (userId, managerId) => {
        // Don't allow self-assignment
        if (userId === managerId) {
          toast.error('Um usuário não pode gerenciar a si mesmo');
          return;
        }
        
        set((state) => ({
          users: state.users.map((user) => {
            if (user.id === managerId) {
              const managedUsers = user.managedUsers || [];
              if (!managedUsers.includes(userId)) {
                return {
                  ...user,
                  managedUsers: [...managedUsers, userId],
                };
              }
            }
            return user;
          }),
        }));
        
        toast.success('Usuário atribuído ao gerente com sucesso');
      },
      
      removeUserFromManager: (userId, managerId) => {
        set((state) => ({
          users: state.users.map((user) => {
            if (user.id === managerId && user.managedUsers) {
              return {
                ...user,
                managedUsers: user.managedUsers.filter((id) => id !== userId),
              };
            }
            return user;
          }),
        }));
        
        toast.success('Usuário removido do gerente com sucesso');
      },
      
      getManagedUsers: (managerId) => {
        const manager = get().users.find(user => user.id === managerId);
        if (!manager || !manager.managedUsers) return [];
        
        return get().users.filter(user => 
          manager.managedUsers?.includes(user.id)
        );
      },
      
      getManagersForUser: (userId) => {
        return get().users.filter(user => 
          user.managedUsers?.includes(userId)
        );
      },
      
      getAllManagers: () => {
        return get().users.filter(user => 
          user.role === 'manager'
        );
      },
    }),
    {
      name: 'user-storage',
    }
  )
);
