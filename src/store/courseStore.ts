import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from './userStore';

export type ActivityType = 'Exposição' | 'Dinâmica' | 'Prática' | 'Avaliação';
export type LessonStatus = 'Fazer' | 'Fazendo' | 'Finalizando';
export type CourseStatus = 'Rascunho' | 'Em andamento' | 'Concluído' | 'Em aprovação' | 'Aprovado' | 'Revisão solicitada';
export type ApprovalItemType = 'curso_completo' | 'estrutura' | 'modulo' | 'aula';

export interface ApprovalRequest {
  id: string;
  courseId: string;
  requestDate: Date;
  requestedBy: string; // user ID
  approverId: string; // user ID (admin ID)
  approvalType: ApprovalItemType;
  itemId?: string; // moduleId or lessonId if applicable
  status: 'pendente' | 'aprovado' | 'rejeitado';
  comments?: string;
  reviewDate?: Date;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  activityType: ActivityType;
  notes?: string;
  status: LessonStatus;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  name: string;
  description: string;
  objectives: string;
  targetAudience: string;
  estimatedDuration: number; // in minutes
  thumbnail?: string;
  modules: Module[];
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  status: CourseStatus;
  createdBy: string; // user ID
  department?: string; // department name
  collaborators: string[]; // array of user IDs
  approvalRequests?: string[]; // array of approval request IDs
}

interface CourseStore {
  courses: Course[];
  approvalRequests: ApprovalRequest[];
  
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'collaborators'> & { collaborators?: string[] }) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  
  addModule: (courseId: string, module: Omit<Module, 'id' | 'lessons'>) => void;
  updateModule: (courseId: string, moduleId: string, module: Partial<Module>) => void;
  deleteModule: (courseId: string, moduleId: string) => void;
  
  addLesson: (courseId: string, moduleId: string, lesson: Omit<Lesson, 'id' | 'status'>) => void;
  updateLesson: (courseId: string, moduleId: string, lessonId: string, lesson: Partial<Lesson>) => void;
  deleteLesson: (courseId: string, moduleId: string, lessonId: string) => void;
  
  reorderModule: (courseId: string, sourceIndex: number, destinationIndex: number) => void;
  reorderLesson: (courseId: string, moduleId: string, sourceIndex: number, destinationIndex: number) => void;
  
  addTagToCourse: (courseId: string, tag: string) => void;
  removeTagFromCourse: (courseId: string, tag: string) => void;
  
  updateCourseStatus: (courseId: string, status: CourseStatus) => void;
  updateLessonStatus: (courseId: string, moduleId: string, lessonId: string, status: LessonStatus) => void;
  
  addCollaborator: (courseId: string, userId: string) => void;
  removeCollaborator: (courseId: string, userId: string) => void;
  
  submitForApproval: (courseId: string, requestedById: string, approvalType: ApprovalItemType, itemId?: string, comments?: string) => void;
  respondToApprovalRequest: (approvalRequestId: string, isApproved: boolean, comments?: string) => void;
  
  getVisibleCoursesForUser: (userId: string, userDepartment?: string) => Course[];
  getCourseById: (courseId: string) => Course | undefined;
  getPendingApprovals: (approverId: string) => ApprovalRequest[];
}

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Calculate total duration of all lessons in a course
const calculateCourseDuration = (modules: Module[]): number => {
  return modules.reduce((totalDuration, module) => {
    return totalDuration + module.lessons.reduce((moduleDuration, lesson) => {
      return moduleDuration + (lesson.duration || 0);
    }, 0);
  }, 0);
};

export const useCourseStore = create<CourseStore>()(
  persist(
    (set, get) => ({
      courses: [],
      approvalRequests: [],
      
      addCourse: (courseData) => set((state) => {
        const now = new Date();
        const newCourse: Course = {
          ...courseData,
          id: generateId(),
          modules: [],
          createdAt: now,
          updatedAt: now,
          tags: courseData.tags || [],
          status: 'Rascunho', // Default status
          collaborators: courseData.collaborators || [],
          estimatedDuration: courseData.estimatedDuration || 0
        };
        return { courses: [...state.courses, newCourse] };
      }),
      
      updateCourse: (id, courseData) => set((state) => {
        const updatedCourses = state.courses.map((course) => 
          course.id === id 
            ? { ...course, ...courseData, updatedAt: new Date() } 
            : course
        );
        
        return { courses: updatedCourses };
      }),
      
      deleteCourse: (id) => set((state) => ({
        courses: state.courses.filter((course) => course.id !== id),
        approvalRequests: state.approvalRequests.filter((request) => request.courseId !== id)
      })),
      
      addModule: (courseId, moduleData) => set((state) => {
        const updatedCourses = state.courses.map((course) => 
          course.id === courseId 
            ? { 
                ...course, 
                modules: [...course.modules, { id: generateId(), ...moduleData, lessons: [] }],
                updatedAt: new Date(),
              } 
            : course
        );
        
        // Recalculate course duration
        return { 
          courses: updatedCourses.map(course => 
            course.id === courseId 
              ? { ...course, estimatedDuration: calculateCourseDuration(course.modules) } 
              : course
          )
        };
      }),
      
      updateModule: (courseId, moduleId, moduleData) => set((state) => {
        const updatedCourses = state.courses.map((course) => 
          course.id === courseId 
            ? { 
                ...course, 
                modules: course.modules.map((module) => 
                  module.id === moduleId 
                    ? { ...module, ...moduleData } 
                    : module
                ),
                updatedAt: new Date(),
              } 
            : course
        );
        
        // Recalculate course duration
        return { 
          courses: updatedCourses.map(course => 
            course.id === courseId 
              ? { ...course, estimatedDuration: calculateCourseDuration(course.modules) } 
              : course
          )
        };
      }),
      
      deleteModule: (courseId, moduleId) => set((state) => {
        const updatedCourses = state.courses.map((course) => 
          course.id === courseId 
            ? { 
                ...course, 
                modules: course.modules.filter((module) => module.id !== moduleId),
                updatedAt: new Date(),
              } 
            : course
        );
        
        // Recalculate course duration
        return { 
          courses: updatedCourses.map(course => 
            course.id === courseId 
              ? { ...course, estimatedDuration: calculateCourseDuration(course.modules) } 
              : course
          )
        };
      }),
      
      addLesson: (courseId, moduleId, lessonData) => set((state) => {
        const updatedCourses = state.courses.map((course) => 
          course.id === courseId 
            ? { 
                ...course, 
                modules: course.modules.map((module) => 
                  module.id === moduleId 
                    ? { 
                        ...module, 
                        lessons: [...module.lessons, { id: generateId(), ...lessonData, status: 'Fazer' as LessonStatus }] 
                      } 
                    : module
                ),
                updatedAt: new Date(),
              } 
            : course
        );
        
        // Recalculate course duration
        return { 
          courses: updatedCourses.map(course => 
            course.id === courseId 
              ? { ...course, estimatedDuration: calculateCourseDuration(course.modules) } 
              : course
          )
        };
      }),
      
      updateLesson: (courseId, moduleId, lessonId, lessonData) => set((state) => {
        const updatedCourses = state.courses.map((course) => 
          course.id === courseId 
            ? { 
                ...course, 
                modules: course.modules.map((module) => 
                  module.id === moduleId 
                    ? { 
                        ...module, 
                        lessons: module.lessons.map((lesson) => 
                          lesson.id === lessonId 
                            ? { ...lesson, ...lessonData } 
                            : lesson
                        ) 
                      } 
                    : module
                ),
                updatedAt: new Date(),
              } 
            : course
        );
        
        // Recalculate course duration
        return { 
          courses: updatedCourses.map(course => 
            course.id === courseId 
              ? { ...course, estimatedDuration: calculateCourseDuration(course.modules) } 
              : course
          )
        };
      }),
      
      deleteLesson: (courseId, moduleId, lessonId) => set((state) => {
        const updatedCourses = state.courses.map((course) => 
          course.id === courseId 
            ? { 
                ...course, 
                modules: course.modules.map((module) => 
                  module.id === moduleId 
                    ? { 
                        ...module, 
                        lessons: module.lessons.filter((lesson) => lesson.id !== lessonId) 
                      } 
                    : module
                ),
                updatedAt: new Date(),
              } 
            : course
        );
        
        // Recalculate course duration
        return { 
          courses: updatedCourses.map(course => 
            course.id === courseId 
              ? { ...course, estimatedDuration: calculateCourseDuration(course.modules) } 
              : course
          )
        };
      }),
      
      reorderModule: (courseId, sourceIndex, destinationIndex) => set((state) => {
        const course = state.courses.find((c) => c.id === courseId);
        if (!course) return state;
        
        const newModules = [...course.modules];
        const [movedModule] = newModules.splice(sourceIndex, 1);
        newModules.splice(destinationIndex, 0, movedModule);
        
        return {
          courses: state.courses.map((c) => 
            c.id === courseId 
              ? { ...c, modules: newModules, updatedAt: new Date() } 
              : c
          ),
        };
      }),
      
      reorderLesson: (courseId, moduleId, sourceIndex, destinationIndex) => set((state) => {
        const course = state.courses.find((c) => c.id === courseId);
        if (!course) return state;
        
        const module = course.modules.find((m) => m.id === moduleId);
        if (!module) return state;
        
        const newLessons = [...module.lessons];
        const [movedLesson] = newLessons.splice(sourceIndex, 1);
        newLessons.splice(destinationIndex, 0, movedLesson);
        
        return {
          courses: state.courses.map((c) => 
            c.id === courseId 
              ? { 
                  ...c, 
                  modules: c.modules.map((m) => 
                    m.id === moduleId 
                      ? { ...m, lessons: newLessons } 
                      : m
                  ),
                  updatedAt: new Date(),
                } 
              : c
          ),
        };
      }),
      
      addTagToCourse: (courseId, tag) => set((state) => ({
        courses: state.courses.map((course) =>
          course.id === courseId
            ? {
                ...course,
                tags: course.tags ? 
                  (course.tags.includes(tag) ? course.tags : [...course.tags, tag]) 
                  : [tag],
                updatedAt: new Date(),
              }
            : course
        ),
      })),
      
      removeTagFromCourse: (courseId, tag) => set((state) => ({
        courses: state.courses.map((course) =>
          course.id === courseId
            ? {
                ...course,
                tags: course.tags ? course.tags.filter(t => t !== tag) : [],
                updatedAt: new Date(),
              }
            : course
        ),
      })),

      updateCourseStatus: (courseId, status) => set((state) => ({
        courses: state.courses.map((course) =>
          course.id === courseId
            ? {
                ...course,
                status,
                updatedAt: new Date(),
              }
            : course
        ),
      })),

      updateLessonStatus: (courseId, moduleId, lessonId, status) => set((state) => ({
        courses: state.courses.map((course) => 
          course.id === courseId 
            ? { 
                ...course, 
                modules: course.modules.map((module) => 
                  module.id === moduleId 
                    ? { 
                        ...module, 
                        lessons: module.lessons.map((lesson) => 
                          lesson.id === lessonId 
                            ? { ...lesson, status } 
                            : lesson
                        ) 
                      } 
                    : module
                ),
                updatedAt: new Date(),
              } 
            : course
        ),
      })),
      
      addCollaborator: (courseId, userId) => set((state) => ({
        courses: state.courses.map((course) =>
          course.id === courseId
            ? {
                ...course,
                collaborators: course.collaborators.includes(userId) 
                  ? course.collaborators 
                  : [...course.collaborators, userId],
                updatedAt: new Date(),
              }
            : course
        ),
      })),
      
      removeCollaborator: (courseId, userId) => set((state) => ({
        courses: state.courses.map((course) =>
          course.id === courseId
            ? {
                ...course,
                collaborators: course.collaborators.filter(id => id !== userId),
                updatedAt: new Date(),
              }
            : course
        ),
      })),
      
      submitForApproval: (courseId, requestedById, approvalType, itemId, comments) => set((state) => {
        // Encontrar usuários administradores
        // Como não temos acesso direto ao userStore, vamos criar um ID fictício para o admin
        const adminId = "admin"; // Isso será substituído pelo ID do admin em componentes que usam essa função
        
        const newApprovalRequest: ApprovalRequest = {
          id: generateId(),
          courseId,
          requestDate: new Date(),
          requestedBy: requestedById,
          approverId: adminId, // Administrador padrão
          approvalType,
          itemId,
          status: 'pendente',
          comments
        };
        
        // Update course status to 'Em aprovação'
        const updatedCourses = state.courses.map(course => 
          course.id === courseId 
            ? { 
                ...course, 
                status: 'Em aprovação' as CourseStatus,
                approvalRequests: course.approvalRequests 
                  ? [...course.approvalRequests, newApprovalRequest.id]
                  : [newApprovalRequest.id],
                updatedAt: new Date() 
              } 
            : course
        );
        
        return {
          courses: updatedCourses,
          approvalRequests: [...state.approvalRequests, newApprovalRequest]
        };
      }),
      
      respondToApprovalRequest: (approvalRequestId, isApproved, comments) => set((state) => {
        const approvalRequest = state.approvalRequests.find(request => request.id === approvalRequestId);
        
        if (!approvalRequest) return state;
        
        const updatedApprovalRequests = state.approvalRequests.map(request => 
          request.id === approvalRequestId
            ? { 
                ...request, 
                status: isApproved ? 'aprovado' as const : 'rejeitado' as const,
                comments: comments || request.comments,
                reviewDate: new Date()
              }
            : request
        );
        
        // Update course status based on approval result
        const updatedCourses = state.courses.map(course => 
          course.id === approvalRequest.courseId
            ? { 
                ...course, 
                status: isApproved ? 'Aprovado' as CourseStatus : 'Revisão solicitada' as CourseStatus,
                updatedAt: new Date() 
              } 
            : course
        );
        
        return {
          approvalRequests: updatedApprovalRequests,
          courses: updatedCourses
        };
      }),
      
      getVisibleCoursesForUser: (userId, userDepartment) => {
        const { courses } = get();
        return courses.filter(course => 
          course.createdBy === userId || 
          (userDepartment && course.department === userDepartment) ||
          (course.collaborators && course.collaborators.includes(userId))
        );
      },
      
      getCourseById: (courseId) => {
        const { courses } = get();
        return courses.find(course => course.id === courseId);
      },
      
      getPendingApprovals: (approverId) => {
        const { approvalRequests } = get();
        return approvalRequests.filter(request => 
          request.approverId === approverId && 
          request.status === 'pendente'
        );
      }
    }),
    {
      name: 'course-storage',
    }
  )
);
