
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: UserRole;
  createdAt: Date;
  invitedCourses: string[]; // Course IDs the user has explicit access to
}

export interface CurrentUser {
  id: string | null;
  role: UserRole | null;
  department: string | null;
  name: string | null;
  isAuthenticated: boolean;
}

interface UserStore {
  users: User[];
  departments: string[];
  currentUser: CurrentUser;
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'invitedCourses'>) => void;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addDepartment: (department: string) => void;
  removeDepartment: (department: string) => void;
  login: (email: string, password: string) => boolean; // Simplified login without real auth
  logout: () => void;
  inviteUserToCourse: (userId: string, courseId: string) => void;
  removeUserFromCourse: (userId: string, courseId: string) => void;
  getUsersWithAccessToCourse: (courseId: string, courseDepartment: string) => User[];
  hasAccessToCourse: (courseId: string, courseDepartment: string) => boolean;
}

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Initial admin user
const initialAdminUser: User = {
  id: "admin-01",
  name: "Admin",
  email: "admin@example.com",
  department: "Management",
  role: "admin",
  createdAt: new Date(),
  invitedCourses: [],
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: [initialAdminUser],
      departments: ["Management", "HR", "IT", "Marketing", "Sales"],
      currentUser: {
        id: null,
        role: null,
        department: null,
        name: null,
        isAuthenticated: false,
      },
      
      addUser: (userData) => set((state) => {
        const newUser: User = {
          ...userData,
          id: generateId(),
          createdAt: new Date(),
          invitedCourses: [],
        };
        return { users: [...state.users, newUser] };
      }),
      
      updateUser: (id, userData) => set((state) => ({
        users: state.users.map((user) => 
          user.id === id 
            ? { ...user, ...userData } 
            : user
        ),
      })),
      
      deleteUser: (id) => set((state) => ({
        users: state.users.filter((user) => user.id !== id),
      })),
      
      addDepartment: (department) => set((state) => {
        if (state.departments.includes(department)) return state;
        return { departments: [...state.departments, department] };
      }),
      
      removeDepartment: (department) => set((state) => ({
        departments: state.departments.filter((d) => d !== department),
      })),
      
      login: (email, _password) => {
        // Simple mock login without real authentication
        const user = get().users.find((u) => u.email === email);
        if (user) {
          set({
            currentUser: {
              id: user.id,
              role: user.role,
              department: user.department,
              name: user.name,
              isAuthenticated: true,
            }
          });
          return true;
        }
        return false;
      },
      
      logout: () => set({
        currentUser: {
          id: null,
          role: null,
          department: null,
          name: null,
          isAuthenticated: false,
        }
      }),
      
      inviteUserToCourse: (userId, courseId) => set((state) => ({
        users: state.users.map((user) => 
          user.id === userId
            ? { 
                ...user, 
                invitedCourses: user.invitedCourses.includes(courseId)
                  ? user.invitedCourses
                  : [...user.invitedCourses, courseId] 
              }
            : user
        ),
      })),
      
      removeUserFromCourse: (userId, courseId) => set((state) => ({
        users: state.users.map((user) => 
          user.id === userId
            ? { 
                ...user, 
                invitedCourses: user.invitedCourses.filter(id => id !== courseId)
              }
            : user
        ),
      })),
      
      getUsersWithAccessToCourse: (courseId, courseDepartment) => {
        const { users } = get();
        return users.filter(user => 
          user.department === courseDepartment || 
          user.invitedCourses.includes(courseId) ||
          user.role === 'admin'
        );
      },
      
      hasAccessToCourse: (courseId, courseDepartment) => {
        const { currentUser, users } = get();
        
        if (!currentUser.isAuthenticated) return false;
        if (currentUser.role === 'admin') return true;
        
        const user = users.find(u => u.id === currentUser.id);
        if (!user) return false;
        
        // If the filter is empty, show all courses the user has access to
        if (!courseDepartment) {
          return user.department === courseDepartment || 
                 user.invitedCourses.includes(courseId);
        }
        
        return user.department === courseDepartment || 
               user.invitedCourses.includes(courseId);
      },
    }),
    {
      name: 'user-storage',
    }
  )
);
