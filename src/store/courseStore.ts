
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from './userStore';
import { useSupabase } from '@/hooks/useSupabase';

export type ActivityType = 'Exposição' | 'Dinâmica' | 'Prática' | 'Avaliação';
export type LessonStatus = 'Fazer' | 'Fazendo' | 'Finalizando';
export type CourseStatus = 'Rascunho' | 'Em andamento' | 'Concluído' | 'Em aprovação' | 'Aprovado' | 'Revisão solicitada';
export type ApprovalItemType = 'curso_completo' | 'estrutura' | 'modulo' | 'aula';

export interface ApprovalRequest {
  id: string;
  courseId: string;
  requestDate: Date;
  requestedBy: string; // user ID
  approverId: string; // user ID
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
  
  fetchCoursesFromSupabase: () => void;
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
      
      fetchCoursesFromSupabase: async () => {
        // We need to instantiate the hook first
        const supabaseHook = useSupabase();
        const courses = await supabaseHook.fetchCourses();
        set({ courses });
      },
      
      addCourse: (courseData) => {
        const now = new Date();
        const newCourse: Course = {
          ...courseData,
          id: generateId(), // This will be replaced by the ID from Supabase
          modules: [],
          createdAt: now,
          updatedAt: now,
          tags: courseData.tags || [],
          status: 'Rascunho', // Default status
          collaborators: courseData.collaborators || [],
          estimatedDuration: courseData.estimatedDuration || 0
        };
        
        // Add to local state
        set((state) => ({ courses: [...state.courses, newCourse] }));
        
        // Save to Supabase
        const supabaseHook = useSupabase();
        supabaseHook.createCourse(courseData).then(courseId => {
          if (courseId) {
            // Update our local copy with the actual ID from Supabase
            set((state) => ({
              courses: state.courses.map(course => 
                course.name === newCourse.name && course.createdAt === newCourse.createdAt
                  ? { ...course, id: courseId }
                  : course
              )
            }));
          }
        });
      },
      
      updateCourse: (id, courseData) => {
        // Update local state
        set((state) => {
          const updatedCourses = state.courses.map((course) => 
            course.id === id 
              ? { ...course, ...courseData, updatedAt: new Date() } 
              : course
          );
          
          return { courses: updatedCourses };
        });
        
        // Update in Supabase
        const supabaseHook = useSupabase();
        supabaseHook.updateCourse(id, { ...courseData, updatedAt: new Date() });
      },
      
      deleteCourse: (id) => {
        // Delete from local state
        set((state) => ({
          courses: state.courses.filter((course) => course.id !== id),
          approvalRequests: state.approvalRequests.filter((request) => request.courseId !== id)
        }));
        
        // Delete from Supabase
        const supabaseHook = useSupabase();
        supabaseHook.deleteCourse(id);
      },
      
      addModule: (courseId, moduleData) => {
        // Add to local state
        const newModuleId = generateId(); // Temporary ID
        
        set((state) => {
          const updatedCourses = state.courses.map((course) => 
            course.id === courseId 
              ? { 
                  ...course, 
                  modules: [...course.modules, { id: newModuleId, ...moduleData, lessons: [] }],
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
        });
        
        // Add to Supabase
        const supabaseHook = useSupabase();
        supabaseHook.addModule(courseId, moduleData).then(moduleId => {
          if (moduleId) {
            // Update our local module with the actual ID from Supabase
            set((state) => ({
              courses: state.courses.map(course => 
                course.id === courseId 
                  ? {
                      ...course,
                      modules: course.modules.map(module => 
                        module.id === newModuleId
                          ? { ...module, id: moduleId }
                          : module
                      )
                    }
                  : course
              )
            }));
          }
        });
      },
      
      updateModule: (courseId, moduleId, moduleData) => {
        // Update locally
        set((state) => {
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
          
          // Recalculate course duration if needed
          return { 
            courses: updatedCourses.map(course => 
              course.id === courseId 
                ? { ...course, estimatedDuration: calculateCourseDuration(course.modules) } 
                : course
            )
          };
        });
        
        // Update in Supabase
        const supabaseHook = useSupabase();
        supabaseHook.updateModule(courseId, moduleId, moduleData);
      },
      
      deleteModule: (courseId, moduleId) => {
        // Delete locally
        set((state) => {
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
        });
        
        // Delete from Supabase
        const supabaseHook = useSupabase();
        supabaseHook.deleteModule(courseId, moduleId);
      },
      
      addLesson: (courseId, moduleId, lessonData) => {
        // Add locally
        const newLessonId = generateId(); // Temporary ID
        
        set((state) => {
          const updatedCourses = state.courses.map((course) => 
            course.id === courseId 
              ? { 
                  ...course, 
                  modules: course.modules.map((module) => 
                    module.id === moduleId 
                      ? { 
                          ...module, 
                          lessons: [...module.lessons, { id: newLessonId, ...lessonData, status: 'Fazer' as LessonStatus }] 
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
        });
        
        // Add to Supabase
        const supabaseHook = useSupabase();
        supabaseHook.addLesson(moduleId, lessonData).then(lessonId => {
          if (lessonId) {
            // Update with real ID
            set((state) => ({
              courses: state.courses.map(course =>
                course.id === courseId
                  ? {
                      ...course,
                      modules: course.modules.map(module =>
                        module.id === moduleId
                          ? {
                              ...module,
                              lessons: module.lessons.map(lesson =>
                                lesson.id === newLessonId
                                  ? { ...lesson, id: lessonId }
                                  : lesson
                              )
                            }
                          : module
                      )
                    }
                  : course
              )
            }));
          }
        });
      },
      
      updateLesson: (courseId, moduleId, lessonId, lessonData) => {
        // Update locally
        set((state) => {
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
          
          // Recalculate course duration if needed
          return { 
            courses: updatedCourses.map(course => 
              course.id === courseId 
                ? { ...course, estimatedDuration: calculateCourseDuration(course.modules) } 
                : course
            )
          };
        });
        
        // Update in Supabase
        const supabaseHook = useSupabase();
        supabaseHook.updateLesson(moduleId, lessonId, lessonData);
      },
      
      deleteLesson: (courseId, moduleId, lessonId) => {
        // Delete locally
        set((state) => {
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
        });
        
        // Delete from Supabase
        const supabaseHook = useSupabase();
        supabaseHook.deleteLesson(moduleId, lessonId);
      },
      
      reorderModule: (courseId, sourceIndex, destinationIndex) => {
        const course = get().courses.find((c) => c.id === courseId);
        if (!course) return;
        
        const newModules = [...course.modules];
        const [movedModule] = newModules.splice(sourceIndex, 1);
        newModules.splice(destinationIndex, 0, movedModule);
        
        // Update local state
        set({
          courses: get().courses.map((c) => 
            c.id === courseId 
              ? { ...c, modules: newModules, updatedAt: new Date() } 
              : c
          ),
        });
        
        // Update in Supabase
        const supabaseHook = useSupabase();
        supabaseHook.reorderModules(courseId, newModules.map(module => module.id));
      },
      
      reorderLesson: (courseId, moduleId, sourceIndex, destinationIndex) => {
        const course = get().courses.find((c) => c.id === courseId);
        if (!course) return;
        
        const module = course.modules.find((m) => m.id === moduleId);
        if (!module) return;
        
        const newLessons = [...module.lessons];
        const [movedLesson] = newLessons.splice(sourceIndex, 1);
        newLessons.splice(destinationIndex, 0, movedLesson);
        
        // Update local state
        set({
          courses: get().courses.map((c) => 
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
        });
        
        // Update in Supabase
        const supabaseHook = useSupabase();
        supabaseHook.reorderLessons(moduleId, newLessons.map(lesson => lesson.id));
      },
      
      addTagToCourse: (courseId, tag) => {
        // Find the course to update
        const course = get().courses.find(c => c.id === courseId);
        if (!course) return;
        
        // Only add if tag doesn't already exist
        if (course.tags.includes(tag)) return;
        
        const updatedTags = [...course.tags, tag];
        
        // Update local state
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  tags: updatedTags,
                  updatedAt: new Date(),
                }
              : course
          ),
        }));
        
        // Update in Supabase
        const supabaseHook = useSupabase();
        supabaseHook.updateCourse(courseId, { tags: updatedTags });
      },
      
      removeTagFromCourse: (courseId, tag) => {
        // Find the course to update
        const course = get().courses.find(c => c.id === courseId);
        if (!course) return;
        
        const updatedTags = course.tags.filter(t => t !== tag);
        
        // Update local state
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  tags: updatedTags,
                  updatedAt: new Date(),
                }
              : course
          ),
        }));
        
        // Update in Supabase
        const supabaseHook = useSupabase();
        supabaseHook.updateCourse(courseId, { tags: updatedTags });
      },

      updateCourseStatus: (courseId, status) => {
        // Update local state
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  status,
                  updatedAt: new Date(),
                }
              : course
          ),
        }));
        
        // Update in Supabase
        const supabaseHook = useSupabase();
        supabaseHook.updateCourse(courseId, { status });
      },

      updateLessonStatus: (courseId, moduleId, lessonId, status) => {
        // Update local state
        set((state) => ({
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
        }));
        
        // Update in Supabase
        const supabaseHook = useSupabase();
        const module = get().courses
          .find(c => c.id === courseId)?.modules
          .find(m => m.id === moduleId);
          
        if (module) {
          supabaseHook.updateLesson(moduleId, lessonId, { status });
        }
      },
      
      // Add a collaborator to a course
      addCollaborator: (courseId, userId) => {
        const course = get().courses.find(c => c.id === courseId);
        if (!course) return;
        
        // Don't add if already a collaborator
        if (course.collaborators.includes(userId)) return;
        
        const updatedCollaborators = [...course.collaborators, userId];
        
        // Update local state
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  collaborators: updatedCollaborators,
                  updatedAt: new Date(),
                }
              : course
          ),
        }));
        
        // Update in Supabase
        const supabaseHook = useSupabase();
        supabaseHook.updateCourse(courseId, { collaborators: updatedCollaborators });
      },
      
      // Remove a collaborator from a course
      removeCollaborator: (courseId, userId) => {
        const course = get().courses.find(c => c.id === courseId);
        if (!course) return;
        
        const updatedCollaborators = course.collaborators.filter(id => id !== userId);
        
        // Update local state
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  collaborators: updatedCollaborators,
                  updatedAt: new Date(),
                }
              : course
          ),
        }));
        
        // Update in Supabase
        const supabaseHook = useSupabase();
        supabaseHook.updateCourse(courseId, { collaborators: updatedCollaborators });
      },
      
      // Submit a course for approval
      submitForApproval: (courseId, requestedById, approvalType, itemId, comments) => {
        // Submit to Supabase
        const supabaseHook = useSupabase();
        supabaseHook.submitForApproval(courseId, requestedById, approvalType, itemId, comments)
          .then(approvalRequestId => {
            if (!approvalRequestId) return;
            
            // Create new approval request
            const newApprovalRequest: ApprovalRequest = {
              id: approvalRequestId,
              courseId,
              requestDate: new Date(),
              requestedBy: requestedById,
              approverId: '', // Will be set by the backend
              approvalType,
              itemId,
              status: 'pendente',
              comments
            };
            
            // Update local state
            set(state => {
              // Update course status
              const updatedCourses = state.courses.map(course => 
                course.id === courseId 
                  ? { 
                      ...course, 
                      status: 'Em aprovação' as CourseStatus,
                      approvalRequests: course.approvalRequests 
                        ? [...course.approvalRequests, approvalRequestId]
                        : [approvalRequestId],
                      updatedAt: new Date() 
                    } 
                  : course
              );
              
              return {
                courses: updatedCourses,
                approvalRequests: [...state.approvalRequests, newApprovalRequest]
              };
            });
          });
      },
      
      // Respond to an approval request
      respondToApprovalRequest: (approvalRequestId, isApproved, comments) => {
        // Update in Supabase first
        const supabaseHook = useSupabase();
        supabaseHook.respondToApprovalRequest(approvalRequestId, isApproved, comments)
          .then(success => {
            if (!success) return;
            
            // Update local state if successful
            const approvalRequest = get().approvalRequests.find(request => request.id === approvalRequestId);
            
            if (!approvalRequest) return;
            
            set(state => {
              const updatedApprovalRequests = state.approvalRequests.map(request => 
                request.id === approvalRequestId
                  ? { 
                      ...request, 
                      status: isApproved ? 'aprovado' : 'rejeitado',
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
            });
          });
      },
      
      // Get courses visible to a specific user (created by them, in their department, or where they're a collaborator)
      getVisibleCoursesForUser: (userId, userDepartment) => {
        const { courses } = get();
        return courses.filter(course => 
          course.createdBy === userId || 
          (userDepartment && course.department === userDepartment) ||
          (course.collaborators && course.collaborators.includes(userId))
        );
      },
      
      // Get a specific course by ID
      getCourseById: (courseId) => {
        const { courses } = get();
        return courses.find(course => course.id === courseId);
      },
      
      // Get pending approval requests for a specific approver
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
