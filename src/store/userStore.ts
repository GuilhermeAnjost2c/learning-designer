
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCourseStore } from './courseStore';

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: UserRole;
  createdAt: Date;
  invitedCourses: string[];
  lessonsProgress: LessonProgress[];
}

export interface CurrentUser {
  id: string | null;
  role: UserRole | null;
  department: string | null;
  name: string | null;
  isAuthenticated: boolean;
}

interface LessonProgress {
  lessonId: string;
  status: LessonStatus;
  updatedAt: Date;
}

export type LessonStatus = 'to-do' | 'in-progress' | 'completed';

interface UserStore {
  users: User[];
  departments: string[];
  currentUser: CurrentUser;
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'invitedCourses' | 'lessonsProgress'>) => void;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addDepartment: (department: string) => void;
  removeDepartment: (department: string) => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  inviteUserToCourse: (userId: string, courseId: string) => void;
  removeUserFromCourse: (userId: string, courseId: string) => void;
  getUsersWithAccessToCourse: (courseId: string, courseDepartment: string) => User[];
  hasAccessToCourse: (courseId: string, courseDepartment: string) => boolean;
  updateLessonStatus: (userId: string, lessonId: string, status: LessonStatus) => void;
  getLessonStatus: (lessonId: string) => LessonStatus;
  getStatistics: () => {
    totalUsers: number;
    totalCourses: number;
    completedLessons: number;
    inProgressLessons: number;
  };
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const initialAdminUser: User = {
  id: "admin-01",
  name: "Admin",
  email: "admin@example.com",
  department: "Management",
  role: "admin",
  createdAt: new Date(),
  invitedCourses: [],
  lessonsProgress: [],
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
          lessonsProgress: [],
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
        
        if (!courseDepartment) {
          return user.department === courseDepartment || 
                 user.invitedCourses.includes(courseId);
        }
        
        return user.department === courseDepartment || 
               user.invitedCourses.includes(courseId);
      },
      
      updateLessonStatus: (userId, lessonId, status) => set((state) => ({
        users: state.users.map((user) => 
          user.id === userId
            ? {
                ...user,
                lessonsProgress: [
                  ...user.lessonsProgress.filter(p => p.lessonId !== lessonId),
                  { lessonId, status, updatedAt: new Date() }
                ]
              }
            : user
        )
      })),
      
      getLessonStatus: (lessonId) => {
        try {
          const { users, currentUser } = get();
          if (!currentUser.id) return 'to-do';
          if (!users || !Array.isArray(users)) return 'to-do';
          
          const user = users.find(u => u.id === currentUser.id);
          if (!user) return 'to-do';
          
          if (!user.lessonsProgress || !Array.isArray(user.lessonsProgress)) return 'to-do';
          
          const progress = user.lessonsProgress.find(p => p.lessonId === lessonId);
          return progress?.status || 'to-do';
        } catch (error) {
          console.error("Error in getLessonStatus:", error);
          return 'to-do';
        }
      },
      
      getStatistics: () => {
        const { users } = get();
        const currentDate = new Date();
        const thirtyDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 30));
        
        let completedLessons = 0;
        let inProgressLessons = 0;
        
        if (users && Array.isArray(users)) {
          users.forEach(user => {
            if (user.lessonsProgress && Array.isArray(user.lessonsProgress)) {
              user.lessonsProgress.forEach(progress => {
                if (progress.status === 'completed') completedLessons++;
                if (progress.status === 'in-progress') inProgressLessons++;
              });
            }
          });
        }
        
        // Import the course store to get the courses count
        const totalCourses = useCourseStore.getState().courses.length;
        
        return {
          totalUsers: users?.length || 0,
          totalCourses,
          completedLessons,
          inProgressLessons,
        };
      },
    }),
    {
      name: 'user-storage',
    }
  )
);
