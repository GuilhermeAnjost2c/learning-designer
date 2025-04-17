
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ActivityType = 'Exposição' | 'Dinâmica' | 'Prática' | 'Avaliação';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  activityType: ActivityType;
  notes?: string;
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
}

interface CourseStore {
  courses: Course[];
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addModule: (courseId: string, module: Omit<Module, 'id' | 'lessons'>) => void;
  updateModule: (courseId: string, moduleId: string, module: Partial<Module>) => void;
  deleteModule: (courseId: string, moduleId: string) => void;
  addLesson: (courseId: string, moduleId: string, lesson: Omit<Lesson, 'id'>) => void;
  updateLesson: (courseId: string, moduleId: string, lessonId: string, lesson: Partial<Lesson>) => void;
  deleteLesson: (courseId: string, moduleId: string, lessonId: string) => void;
  reorderModule: (courseId: string, sourceIndex: number, destinationIndex: number) => void;
  reorderLesson: (courseId: string, moduleId: string, sourceIndex: number, destinationIndex: number) => void;
  addTagToCourse: (courseId: string, tag: string) => void;
  removeTagFromCourse: (courseId: string, tag: string) => void;
}

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

export const useCourseStore = create<CourseStore>()(
  persist(
    (set) => ({
      courses: [],
      
      addCourse: (courseData) => set((state) => {
        const now = new Date();
        const newCourse: Course = {
          ...courseData,
          id: generateId(),
          modules: [],
          createdAt: now,
          updatedAt: now,
          tags: courseData.tags || [],
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
      
      addModule: (courseId, moduleData) => set((state) => ({
        courses: state.courses.map((course) => 
          course.id === courseId 
            ? { 
                ...course, 
                modules: [...course.modules, { id: generateId(), ...moduleData, lessons: [] }],
                updatedAt: new Date(),
              } 
            : course
        ),
      })),
      
      updateModule: (courseId, moduleId, moduleData) => set((state) => ({
        courses: state.courses.map((course) => 
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
        ),
      })),
      
      deleteModule: (courseId, moduleId) => set((state) => ({
        courses: state.courses.map((course) => 
          course.id === courseId 
            ? { 
                ...course, 
                modules: course.modules.filter((module) => module.id !== moduleId),
                updatedAt: new Date(),
              } 
            : course
        ),
      })),
      
      addLesson: (courseId, moduleId, lessonData) => set((state) => ({
        courses: state.courses.map((course) => 
          course.id === courseId 
            ? { 
                ...course, 
                modules: course.modules.map((module) => 
                  module.id === moduleId 
                    ? { 
                        ...module, 
                        lessons: [...module.lessons, { id: generateId(), ...lessonData }] 
                      } 
                    : module
                ),
                updatedAt: new Date(),
              } 
            : course
        ),
      })),
      
      updateLesson: (courseId, moduleId, lessonId, lessonData) => set((state) => ({
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
                            ? { ...lesson, ...lessonData } 
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
      
      deleteLesson: (courseId, moduleId, lessonId) => set((state) => ({
        courses: state.courses.map((course) => 
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
        ),
      })),
      
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
    }),
    {
      name: 'course-storage',
    }
  )
);
