
import { create } from "zustand";
import { useSupabase } from "@/hooks/useSupabase";

// Types for the course store
export type CourseStatus = 'Rascunho' | 'Em andamento' | 'Concluído' | 'Arquivado';
export type LessonStatus = 'Fazer' | 'Fazendo' | 'Finalizando';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  activityType: string;
  status: LessonStatus;
  notes: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  name: string;
  description: string;
  objectives: string;
  targetAudience: string;
  estimatedDuration: number;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  status: CourseStatus;
  createdBy: string;
  department?: string;
  modules: Module[];
  collaborators: string[];
  approvalRequests: ApprovalRequest[];
  format?: string;
}

export interface ApprovalRequest {
  id: string;
  courseId: string;
  requestedBy: string;
  approverId: string;
  requestDate: Date;
  reviewDate?: Date;
  approvalType: string;
  status: string;
  comments?: string;
  itemId?: string;
}

// Type for the course store
interface CourseStore {
  courses: Course[];
  loadingCourses: boolean;
  initialized: boolean;
  initializeCourses: (userId: string) => Promise<void>;
  addCourse: (course: Partial<Course>) => Promise<void>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  addModule: (courseId: string, module: Partial<Module>) => Promise<void>;
  updateModule: (courseId: string, moduleId: string, module: Partial<Module>) => Promise<void>;
  deleteModule: (courseId: string, moduleId: string) => Promise<void>;
  addLesson: (courseId: string, moduleId: string, lesson: Partial<Lesson>) => Promise<void>;
  updateLesson: (courseId: string, moduleId: string, lessonId: string, lesson: Partial<Lesson>) => Promise<void>;
  deleteLesson: (courseId: string, moduleId: string, lessonId: string) => Promise<void>;
  updateLessonStatus: (courseId: string, moduleId: string, lessonId: string, status: LessonStatus) => Promise<void>;
  addCollaborator: (courseId: string, userId: string) => Promise<void>;
  submitForApproval: (courseId: string, requesterId: string, approverId: string, approvalType: string) => Promise<void>;
}

// Create the store
export const useCourseStore = create<CourseStore>((set, get) => ({
  courses: [],
  loadingCourses: false,
  initialized: false,

  // Initialize courses
  initializeCourses: async (userId: string) => {
    try {
      set({ loadingCourses: true });
      
      // Use the Supabase hook to fetch data
      const { fetchCourses } = useSupabase();
      const courses = await fetchCourses();
      
      // Set the courses in the store
      set({ 
        courses: courses, 
        loadingCourses: false,
        initialized: true
      });
      
    } catch (error) {
      console.error("Error initializing courses:", error);
      set({ loadingCourses: false });
    }
  },

  // Add a new course
  addCourse: async (course: Partial<Course>) => {
    try {
      const { createCourse } = useSupabase();

      // Format course data for Supabase
      const courseData = {
        name: course.name || '',
        description: course.description || '',
        objectives: course.objectives || '',
        target_audience: course.targetAudience || '',
        estimated_duration: course.estimatedDuration || 0,
        department: course.department,
        created_by: course.createdBy || '',
        tags: course.tags || [],
        format: course.format || 'EAD',
      };

      // Create course in Supabase
      const newCourseId = await createCourse(courseData);

      // Add the new course to the store
      if (newCourseId) {
        const newCourse: Course = {
          id: newCourseId,
          name: course.name || '',
          description: course.description || '',
          objectives: course.objectives || '',
          targetAudience: course.targetAudience || '',
          estimatedDuration: course.estimatedDuration || 0,
          thumbnail: course.thumbnail,
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: course.tags || [],
          status: 'Rascunho',
          createdBy: course.createdBy || '',
          department: course.department,
          modules: [],
          collaborators: [],
          approvalRequests: [],
          format: course.format || 'EAD',
        };

        set(state => ({
          courses: [...state.courses, newCourse]
        }));
      }
    } catch (error) {
      console.error("Error adding course:", error);
      throw error;
    }
  },

  // Update a course
  updateCourse: async (id: string, course: Partial<Course>) => {
    try {
      const { updateCourse } = useSupabase();

      // Format course data for Supabase
      const courseData = {
        name: course.name,
        description: course.description,
        objectives: course.objectives,
        target_audience: course.targetAudience,
        estimated_duration: course.estimatedDuration,
        department: course.department,
        tags: course.tags,
        status: course.status,
        format: course.format,
        // We don't update created_by from here
      };

      // Filter out undefined values
      const filteredData = Object.entries(courseData)
        .filter(([_, value]) => value !== undefined)
        .reduce((acc: Record<string, any>, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      // Update course in Supabase
      await updateCourse(id, filteredData);

      // Update the course in the store
      set(state => ({
        courses: state.courses.map(c => 
          c.id === id 
            ? { ...c, ...course, updatedAt: new Date() } 
            : c
        )
      }));
    } catch (error) {
      console.error("Error updating course:", error);
      throw error;
    }
  },

  // Delete a course
  deleteCourse: async (id: string) => {
    try {
      const { deleteCourse } = useSupabase();

      // Delete course in Supabase
      await deleteCourse(id);

      // Remove the course from the store
      set(state => ({
        courses: state.courses.filter(course => course.id !== id)
      }));
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
  },

  // Add a module to a course
  addModule: async (courseId: string, module: Partial<Module>) => {
    try {
      const { createModule } = useSupabase();

      // Format module data for Supabase
      const moduleData = {
        course_id: courseId,
        title: module.title || '',
        description: module.description || '',
        position: 0, // Default position at the end
      };

      // Create module in Supabase
      const newModuleId = await createModule(moduleData);

      // Add the new module to the store
      if (newModuleId) {
        const newModule: Module = {
          id: newModuleId,
          title: module.title || '',
          description: module.description || '',
          lessons: [],
        };

        set(state => ({
          courses: state.courses.map(course => 
            course.id === courseId 
              ? { 
                  ...course, 
                  modules: [...course.modules, newModule],
                  updatedAt: new Date(),
                } 
              : course
          )
        }));
      }
    } catch (error) {
      console.error("Error adding module:", error);
      throw error;
    }
  },

  // Update a module
  updateModule: async (courseId: string, moduleId: string, module: Partial<Module>) => {
    try {
      // Update module in Supabase (to be implemented)
      // For now, just update the store
      set(state => ({
        courses: state.courses.map(course => 
          course.id === courseId 
            ? { 
                ...course, 
                modules: course.modules.map(m => 
                  m.id === moduleId 
                    ? { ...m, ...module } 
                    : m
                ),
                updatedAt: new Date(),
              } 
            : course
        )
      }));
    } catch (error) {
      console.error("Error updating module:", error);
      throw error;
    }
  },

  // Delete a module
  deleteModule: async (courseId: string, moduleId: string) => {
    try {
      // Delete module in Supabase (to be implemented)
      // For now, just update the store
      set(state => ({
        courses: state.courses.map(course => 
          course.id === courseId 
            ? { 
                ...course, 
                modules: course.modules.filter(m => m.id !== moduleId),
                updatedAt: new Date(),
              } 
            : course
        )
      }));
    } catch (error) {
      console.error("Error deleting module:", error);
      throw error;
    }
  },

  // Add a lesson to a module
  addLesson: async (courseId: string, moduleId: string, lesson: Partial<Lesson>) => {
    try {
      const { createLesson } = useSupabase();

      // Format lesson data for Supabase
      const lessonData = {
        module_id: moduleId,
        title: lesson.title || '',
        description: lesson.description || '',
        duration: lesson.duration || 0,
        activity_type: lesson.activityType || 'Exposição',
        notes: lesson.notes || '',
        status: lesson.status || 'Fazer',
        position: 0, // Default position at the end
      };

      // Create lesson in Supabase
      const newLessonId = await createLesson(lessonData);

      // Add the new lesson to the store
      if (newLessonId) {
        const newLesson: Lesson = {
          id: newLessonId,
          title: lesson.title || '',
          description: lesson.description || '',
          duration: lesson.duration || 0,
          activityType: lesson.activityType || 'Exposição',
          notes: lesson.notes || '',
          status: lesson.status || 'Fazer',
        };

        set(state => ({
          courses: state.courses.map(course => 
            course.id === courseId 
              ? { 
                  ...course, 
                  modules: course.modules.map(m => 
                    m.id === moduleId 
                      ? { ...m, lessons: [...m.lessons, newLesson] } 
                      : m
                  ),
                  updatedAt: new Date(),
                } 
              : course
          )
        }));
      }
    } catch (error) {
      console.error("Error adding lesson:", error);
      throw error;
    }
  },

  // Update a lesson
  updateLesson: async (courseId: string, moduleId: string, lessonId: string, lesson: Partial<Lesson>) => {
    try {
      // Update lesson in Supabase (to be implemented)
      // For now, just update the store
      set(state => ({
        courses: state.courses.map(course => 
          course.id === courseId 
            ? { 
                ...course, 
                modules: course.modules.map(m => 
                  m.id === moduleId 
                    ? { 
                        ...m, 
                        lessons: m.lessons.map(l => 
                          l.id === lessonId 
                            ? { ...l, ...lesson } 
                            : l
                        ) 
                      } 
                    : m
                ),
                updatedAt: new Date(),
              } 
            : course
        )
      }));
    } catch (error) {
      console.error("Error updating lesson:", error);
      throw error;
    }
  },

  // Delete a lesson
  deleteLesson: async (courseId: string, moduleId: string, lessonId: string) => {
    try {
      // Delete lesson in Supabase (to be implemented)
      // For now, just update the store
      set(state => ({
        courses: state.courses.map(course => 
          course.id === courseId 
            ? { 
                ...course, 
                modules: course.modules.map(m => 
                  m.id === moduleId 
                    ? { 
                        ...m, 
                        lessons: m.lessons.filter(l => l.id !== lessonId) 
                      } 
                    : m
                ),
                updatedAt: new Date(),
              } 
            : course
        )
      }));
    } catch (error) {
      console.error("Error deleting lesson:", error);
      throw error;
    }
  },

  // Update lesson status
  updateLessonStatus: async (courseId: string, moduleId: string, lessonId: string, status: LessonStatus) => {
    try {
      // Update lesson status in Supabase (to be implemented)
      // For now, just update the store
      set(state => ({
        courses: state.courses.map(course => 
          course.id === courseId 
            ? { 
                ...course, 
                modules: course.modules.map(m => 
                  m.id === moduleId 
                    ? { 
                        ...m, 
                        lessons: m.lessons.map(l => 
                          l.id === lessonId 
                            ? { ...l, status } 
                            : l
                        ) 
                      } 
                    : m
                ),
                updatedAt: new Date(),
              } 
            : course
        )
      }));
    } catch (error) {
      console.error("Error updating lesson status:", error);
      throw error;
    }
  },

  // Add a collaborator to a course
  addCollaborator: async (courseId: string, userId: string) => {
    try {
      // Add collaborator in Supabase (to be implemented)
      // For now, just update the store
      set(state => ({
        courses: state.courses.map(course => 
          course.id === courseId 
            ? { 
                ...course, 
                collaborators: [...course.collaborators, userId],
                updatedAt: new Date(),
              } 
            : course
        )
      }));
    } catch (error) {
      console.error("Error adding collaborator:", error);
      throw error;
    }
  },

  // Submit a course for approval
  submitForApproval: async (courseId: string, requesterId: string, approverId: string, approvalType: string) => {
    try {
      const newApprovalRequest: ApprovalRequest = {
        id: Math.random().toString(36).substring(2, 15),
        courseId,
        requestedBy: requesterId,
        approverId,
        requestDate: new Date(),
        approvalType,
        status: 'Pendente',
      };

      // Add approval request in Supabase (to be implemented)
      // For now, just update the store
      set(state => ({
        courses: state.courses.map(course => 
          course.id === courseId 
            ? { 
                ...course, 
                approvalRequests: [...course.approvalRequests, newApprovalRequest],
                updatedAt: new Date(),
              } 
            : course
        )
      }));
    } catch (error) {
      console.error("Error submitting for approval:", error);
      throw error;
    }
  },
}));
