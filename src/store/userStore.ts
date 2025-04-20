
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'instructor' | 'student';
export type DepartmentName = 'Marketing' | 'Vendas' | 'RH' | 'TI' | 'Operações';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this would be hashed
  role: UserRole;
  department?: DepartmentName;
  assignedCourses?: string[]; // Course IDs
  createdAt: Date;
}

interface UserState {
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Authentication
  login: (email: string, password: string) => boolean;
  logout: () => void;
  
  // User management
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  // Course assignments
  assignUserToCourse: (userId: string, courseId: string) => void;
  removeUserFromCourse: (userId: string, courseId: string) => void;
  
  // Helper methods
  getUsersInDepartment: (department?: DepartmentName) => User[];
  getUsersByIds: (userIds: string[]) => User[];
  getCourseCollaborators: (courseId: string) => User[];
}

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

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
        }
      ],
      currentUser: null,
      isAuthenticated: false,
      
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
        const now = new Date();
        const newUser: User = {
          ...userData,
          id: generateId(),
          createdAt: now,
        };
        
        // Check if email already exists
        const emailExists = get().users.some(user => user.email === userData.email);
        if (emailExists) {
          throw new Error("Email já está em uso");
        }
        
        set((state) => ({
          users: [...state.users, newUser],
        }));
      },
      
      updateUser: (id, userData) => {
        // Check if updating email and if it already exists
        if (userData.email) {
          const emailExists = get().users.some(
            user => user.email === userData.email && user.id !== id
          );
          
          if (emailExists) {
            throw new Error("Email já está em uso");
          }
        }
        
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...userData } : user
          ),
          // Update currentUser if it's the one being updated
          currentUser: state.currentUser?.id === id 
            ? { ...state.currentUser, ...userData } 
            : state.currentUser
        }));
      },
      
      deleteUser: (id) => {
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        }));
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
      },
      
      // Helper methods
      getUsersInDepartment: (department) => {
        if (!department) return [];
        return get().users.filter(user => user.department === department);
      },
      
      getUsersByIds: (userIds) => {
        return get().users.filter(user => userIds.includes(user.id));
      },
      
      getCourseCollaborators: (courseId) => {
        return get().users.filter(user => 
          user.assignedCourses && user.assignedCourses.includes(courseId)
        );
      },
    }),
    {
      name: 'user-storage',
    }
  )
);
