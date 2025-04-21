
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ActivityType = 'Exposição' | 'Dinâmica' | 'Prática' | 'Avaliação';
export type LessonStatus = 'Fazer' | 'Fazendo' | 'Finalizando';
export type CourseStatus = 'Rascunho' | 'Em andamento' | 'Concluído';

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
  departmentId?: string; // Department this course belongs to
  createdBy: string; // User ID of the creator
  collaborators: string[]; // User IDs of collaborators
}

interface CourseStore {
  courses: Course[];
  
  // Course CRUD
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'collaborators'> & { collaborators?: string[] }) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  
  // Module CRUD
  addModule: (courseId: string, module: Omit<Module, 'id' | 'lessons'>) => void;
  updateModule: (courseId: string, moduleId: string, module: Partial<Module>) => void;
  deleteModule: (courseId: string, moduleId: string) => void;
  
  // Lesson CRUD
  addLesson: (courseId: string, moduleId: string, lesson: Omit<Lesson, 'id' | 'status'>) => void;
  updateLesson: (courseId: string, moduleId: string, lessonId: string, lesson: Partial<Lesson>) => void;
  deleteLesson: (courseId: string, moduleId: string, lessonId: string) => void;
  
  // Reordering
  reorderModule: (courseId: string, sourceIndex: number, destinationIndex: number) => void;
  reorderLesson: (courseId: string, moduleId: string, sourceIndex: number, destinationIndex: number) => void;
  
  // Tags
  addTagToCourse: (courseId: string, tag: string) => void;
  removeTagFromCourse: (courseId: string, tag: string) => void;
  
  // Status
  updateCourseStatus: (courseId: string, status: CourseStatus) => void;
  updateLessonStatus: (courseId: string, moduleId: string, lessonId: string, status: LessonStatus) => void;
  
  // Collaborators
  addCollaborator: (courseId: string, userId: string) => void;
  removeCollaborator: (courseId: string, userId: string) => void;
  
  // Access control
  getAccessibleCourses: (userId: string, userDepartment?: string) => Course[];
  isUserAuthorized: (userId: string, courseId: string, userDepartment?: string) => boolean;
  
  // Statistics
  getCourseProgress: (courseId: string) => { 
    total: number; 
    fazer: number; 
    fazendo: number; 
    finalizando: number;
    percentage: number;
  };
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

// Update course duration based on lessons
const updateCourseDuration = (course: Course): Course => {
  const calculatedDuration = calculateCourseDuration(course.modules);
  return {
    ...course,
    estimatedDuration: calculatedDuration
  };
};

export const useCourseStore = create<CourseStore>()(
  persist(
    (set, get) => ({
      courses: [],
      
      addCourse: (courseData) => set((state) => {
        const now = new Date();
        const newCourse: Course = {
          ...courseData,
          id: generateId(),
          modules: courseData.modules || [],
          createdAt: now,
          updatedAt: now,
          tags: courseData.tags || [],
          status: 'Rascunho' as CourseStatus, // Default status
          collaborators: courseData.collaborators || [], // Default empty collaborators
          createdBy: courseData.createdBy, // Ensure createdBy is passed through
        };
        return { courses: [...state.courses, newCourse] };
      }),
      
      updateCourse: (id, courseData) => set((state) => ({
        courses: state.courses.map((course) => 
          course.id === id 
            ? { ...course, ...courseData, updatedAt: new Date() } 
            : course
        ),
      })),
      
      deleteCourse: (id) => set((state) => ({
        courses: state.courses.filter((course) => course.id !== id),
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
            course.id === courseId ? updateCourseDuration(course) : course
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
            course.id === courseId ? updateCourseDuration(course) : course
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
            course.id === courseId ? updateCourseDuration(course) : course
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
            course.id === courseId ? updateCourseDuration(course) : course
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
        
        // Recalculate course duration if duration was updated
        return { 
          courses: updatedCourses.map(course => 
            course.id === courseId ? updateCourseDuration(course) : course
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
            course.id === courseId ? updateCourseDuration(course) : course
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
      
      // New methods for collaborators
      addCollaborator: (courseId, userId) => set((state) => ({
        courses: state.courses.map((course) =>
          course.id === courseId
            ? {
                ...course,
                collaborators: course.collaborators 
                  ? (course.collaborators.includes(userId) 
                      ? course.collaborators 
                      : [...course.collaborators, userId])
                  : [userId],
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
                collaborators: course.collaborators 
                  ? course.collaborators.filter(id => id !== userId)
                  : [],
                updatedAt: new Date(),
              }
            : course
        ),
      })),
      
      // Access control methods
      getAccessibleCourses: (userId, userDepartment) => {
        const courses = get().courses;
        
        return courses.filter(course => 
          // User is creator
          course.createdBy === userId ||
          // User is collaborator
          (course.collaborators && course.collaborators.includes(userId)) ||
          // Course is in user's department
          (userDepartment && course.departmentId === userDepartment)
        );
      },
      
      isUserAuthorized: (userId, courseId, userDepartment) => {
        const course = get().courses.find(c => c.id === courseId);
        if (!course) return false;
        
        return (
          // User is creator
          course.createdBy === userId ||
          // User is collaborator
          (course.collaborators && course.collaborators.includes(userId)) ||
          // Course is in user's department
          (userDepartment && course.departmentId === userDepartment)
        );
      },
      
      // Course progress statistics
      getCourseProgress: (courseId) => {
        const course = get().courses.find(c => c.id === courseId);
        if (!course) return { total: 0, fazer: 0, fazendo: 0, finalizando: 0, percentage: 0 };
        
        let total = 0;
        let fazer = 0;
        let fazendo = 0;
        let finalizando = 0;
        
        course.modules.forEach(module => {
          module.lessons.forEach(lesson => {
            total++;
            if (lesson.status === 'Fazer') fazer++;
            else if (lesson.status === 'Fazendo') fazendo++;
            else if (lesson.status === 'Finalizando') finalizando++;
          });
        });
        
        const percentage = total > 0 
          ? Math.round((finalizando / total) * 100) 
          : 0;
        
        return { total, fazer, fazendo, finalizando, percentage };
      },
    }),
    {
      name: 'course-storage',
    }
  )
);
