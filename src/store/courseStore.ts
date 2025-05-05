import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Course, Module, Lesson, ActivityType, CourseFormat } from "@/types/course";
import { sampleCourses } from "@/utils/sampleData";

export type CourseStatus = "Rascunho" | "Revisão" | "Publicado";
export type LessonStatus = "Fazer" | "Em Progresso" | "Concluído";
export type ApprovalStatus = "Pendente" | "Aprovado" | "Rejeitado";
export type ApprovalItemType = "curso_completo" | "estrutura" | "modulo" | "aula";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  activityType: ActivityType;
  status: LessonStatus;
  notes: string;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface ApprovalRequest {
  id: string;
  courseId: string;
  requestedBy: string;
  approverId: string;
  requestDate: Date;
  approvalType: ApprovalItemType;
  itemId?: string;
  status: ApprovalStatus;
  comments?: string;
  reviewDate?: Date;
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
  tags?: string[];
  status: CourseStatus;
  createdBy: string;
  department?: string;
  modules: Module[];
  collaborators: string[];
  approvalRequests?: ApprovalRequest[];
  format?: CourseFormat;
}

interface CourseStore {
  courses: Course[];
  loadingCourses: boolean;
  initialized: boolean;
  initializeCourses: (userId: string) => Promise<void>;
  addCourse: (course: Partial<Course>) => Promise<string>;
  updateCourse: (id: string, updates: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  addModule: (courseId: string, module: Partial<Module>) => Promise<void>;
  updateModule: (courseId: string, moduleId: string, updates: Partial<Module>) => Promise<void>;
  deleteModule: (courseId: string, moduleId: string) => Promise<void>;
  addLesson: (courseId: string, moduleId: string, lesson: Partial<Lesson>) => Promise<void>;
  updateLesson: (courseId: string, moduleId: string, lessonId: string, updates: Partial<Lesson>) => Promise<void>;
  deleteLesson: (courseId: string, moduleId: string, lessonId: string) => Promise<void>;
  updateLessonStatus: (courseId: string, moduleId: string, lessonId: string, status: LessonStatus) => Promise<void>;
  updateCourseStatus: (courseId: string, status: CourseStatus) => Promise<void>;
  addCollaborator: (courseId: string, userId: string) => Promise<void>;
  removeCollaborator: (courseId: string, userId: string) => Promise<void>;
  submitForApproval: (
    courseId: string,
    requestedBy: string,
    approverId: string,
    approvalType: ApprovalItemType,
    itemId?: string,
    comments?: string
  ) => Promise<void>;
  updateApprovalStatus: (
    courseId: string,
    approvalId: string,
    status: ApprovalStatus,
    comments?: string
  ) => Promise<void>;
  reorderModule: (courseId: string, oldIndex: number, newIndex: number) => Promise<void>;
  reorderLesson: (courseId: string, moduleId: string, oldIndex: number, newIndex: number) => Promise<void>;
  getVisibleCoursesForUser: (userId: string, userDepartment?: string) => Course[];
}

export const useCourseStore = create<CourseStore>()(
  devtools(
    (set, get) => ({
      courses: [],
      loadingCourses: true,
      initialized: false,

      initializeCourses: async (userId: string) => {
        set({ loadingCourses: true });

        try {
          // Fetch courses from Supabase
          const { data: supabaseCourses, error } = await supabase
            .from('courses')
            .select(`
              *,
              modules (
                *,
                lessons (*)
              ),
              course_collaborators (
                user_id
              ),
              approval_requests (*)
            `)
            .order('created_at', { ascending: false });

          if (error) {
            throw error;
          }

          if (supabaseCourses && supabaseCourses.length > 0) {
            // Transform Supabase data to our Course type
            const transformedCourses: Course[] = supabaseCourses.map(course => {
              const modules: Module[] = (course.modules || []).map((module: any) => {
                const lessons: Lesson[] = (module.lessons || []).map((lesson: any) => ({
                  id: lesson.id,
                  title: lesson.title,
                  description: lesson.description,
                  duration: lesson.duration,
                  activityType: lesson.activity_type as ActivityType,
                  status: lesson.status as LessonStatus,
                  notes: lesson.notes || '',
                }));

                return {
                  id: module.id,
                  title: module.title,
                  description: module.description || '',
                  lessons,
                };
              });

              const collaborators = (course.course_collaborators || []).map((collab: any) => collab.user_id);

              const approvalRequests = (course.approval_requests || []).map((req: any) => ({
                id: req.id,
                courseId: req.course_id,
                requestedBy: req.requested_by,
                approverId: req.approver_id || '',
                requestDate: new Date(req.request_date),
                approvalType: req.approval_type as ApprovalItemType,
                itemId: req.item_id || undefined,
                status: req.status as ApprovalStatus,
                comments: req.comments || undefined,
                reviewDate: req.review_date ? new Date(req.review_date) : undefined,
              }));

              return {
                id: course.id,
                name: course.name,
                description: course.description,
                objectives: course.objectives,
                targetAudience: course.target_audience,
                estimatedDuration: course.estimated_duration,
                thumbnail: course.thumbnail || undefined,
                createdAt: new Date(course.created_at),
                updatedAt: new Date(course.updated_at),
                tags: course.tags || [],
                status: course.status as CourseStatus,
                createdBy: course.created_by,
                department: course.department || undefined,
                modules,
                collaborators,
                approvalRequests,
                format: course.format as CourseFormat || 'EAD',
              };
            });

            set({ 
              courses: transformedCourses, 
              loadingCourses: false,
              initialized: true
            });
          } else {
            // If no courses found in Supabase, use sample courses for demo
            console.log("No courses found in Supabase. Using sample courses.");
            // Create sample courses in Supabase
            for (const course of sampleCourses) {
              const courseData = {
                name: course.name,
                description: course.description,
                objectives: course.objectives,
                target_audience: course.targetAudience,
                estimated_duration: course.estimatedDuration,
                thumbnail: course.thumbnail,
                created_by: userId,
                tags: course.tags || [],
                department: course.department,
                format: course.format || 'EAD',
              };

              // Insert course
              const { data: newCourse, error: courseError } = await supabase
                .from('courses')
                .insert(courseData)
                .select('id')
                .single();

              if (courseError) {
                throw courseError;
              }

              if (newCourse) {
                // Insert modules and lessons
                for (const module of course.modules) {
                  const moduleData = {
                    course_id: newCourse.id,
                    title: module.title,
                    description: module.description || '',
                  };

                  const { data: newModule, error: moduleError } = await supabase
                    .from('modules')
                    .insert(moduleData)
                    .select('id')
                    .single();

                  if (moduleError) {
                    throw moduleError;
                  }

                  if (newModule && module.lessons.length > 0) {
                    const lessonInserts = module.lessons.map(lesson => ({
                      module_id: newModule.id,
                      title: lesson.title,
                      description: lesson.description,
                      duration: lesson.duration,
                      activity_type: lesson.activityType,
                      notes: lesson.notes || '',
                      status: lesson.status
                    }));

                    const { error: lessonsError } = await supabase
                      .from('lessons')
                      .insert(lessonInserts);

                    if (lessonsError) {
                      throw lessonsError;
                    }
                  }
                }
              }
            }

            // Now fetch the newly created courses
            await get().initializeCourses(userId);
          }
        } catch (error: any) {
          console.error("Error initializing courses:", error.message);
          toast.error(`Erro ao carregar cursos: ${error.message}`);
          set({ loadingCourses: false, initialized: true });
        }
      },

      addCourse: async (courseData) => {
        try {
          const { id, createdAt, updatedAt, status, modules, collaborators, ...rest } = courseData as any;
          
          const supabaseData = {
            name: rest.name,
            description: rest.description,
            objectives: rest.objectives,
            target_audience: rest.targetAudience,
            estimated_duration: rest.estimatedDuration,
            thumbnail: rest.thumbnail,
            tags: rest.tags || [],
            created_by: rest.createdBy,
            department: rest.department,
            format: rest.format || 'EAD'
          };

          const { data, error } = await supabase
            .from('courses')
            .insert(supabaseData)
            .select('id')
            .single();

          if (error) throw error;

          const newCourseId = data.id;

          const newCourse: Course = {
            id: newCourseId,
            name: rest.name,
            description: rest.description,
            objectives: rest.objectives,
            targetAudience: rest.targetAudience,
            estimatedDuration: rest.estimatedDuration,
            thumbnail: rest.thumbnail,
            createdAt: new Date(),
            updatedAt: new Date(),
            tags: rest.tags || [],
            status: "Rascunho",
            createdBy: rest.createdBy,
            department: rest.department,
            modules: [],
            collaborators: [],
            format: rest.format || 'EAD',
          };

          set((state) => ({
            courses: [newCourse, ...state.courses],
          }));

          return newCourseId;
        } catch (error: any) {
          console.error("Error adding course:", error);
          toast.error(`Erro ao criar curso: ${error.message}`);
          throw error;
        }
      },

      updateCourse: async (id, updates) => {
        try {
          const supabaseUpdates: any = {};
          
          // Map our properties to Supabase column names
          if (updates.name !== undefined) supabaseUpdates.name = updates.name;
          if (updates.description !== undefined) supabaseUpdates.description = updates.description;
          if (updates.objectives !== undefined) supabaseUpdates.objectives = updates.objectives;
          if (updates.targetAudience !== undefined) supabaseUpdates.target_audience = updates.targetAudience;
          if (updates.estimatedDuration !== undefined) supabaseUpdates.estimated_duration = updates.estimatedDuration;
          if (updates.thumbnail !== undefined) supabaseUpdates.thumbnail = updates.thumbnail;
          if (updates.tags !== undefined) supabaseUpdates.tags = updates.tags;
          if (updates.status !== undefined) supabaseUpdates.status = updates.status;
          if (updates.department !== undefined) supabaseUpdates.department = updates.department;
          if (updates.format !== undefined) supabaseUpdates.format = updates.format;

          const { error } = await supabase
            .from('courses')
            .update(supabaseUpdates)
            .eq('id', id);

          if (error) throw error;

          set((state) => ({
            courses: state.courses.map((course) =>
              course.id === id
                ? { ...course, ...updates, updatedAt: new Date() }
                : course
            ),
          }));
        } catch (error: any) {
          console.error("Error updating course:", error);
          toast.error(`Erro ao atualizar curso: ${error.message}`);
          throw error;
        }
      },

      deleteCourse: async (id) => {
        try {
          // Delete from Supabase - cascade will take care of modules/lessons
          const { error } = await supabase
            .from('courses')
            .delete()
            .eq('id', id);

          if (error) throw error;

          set((state) => ({
            courses: state.courses.filter((course) => course.id !== id),
          }));
        } catch (error: any) {
          console.error("Error deleting course:", error);
          toast.error(`Erro ao excluir curso: ${error.message}`);
          throw error;
        }
      },

      addModule: async (courseId, module) => {
        try {
          const supabaseModule = {
            course_id: courseId,
            title: module.title,
            description: module.description || ''
          };

          // Insert into Supabase
          const { data, error } = await supabase
            .from('modules')
            .insert(supabaseModule)
            .select('id')
            .single();

          if (error) throw error;

          const newModuleId = data.id;

          set((state) => ({
            courses: state.courses.map((course) =>
              course.id === courseId
                ? {
                    ...course,
                    modules: [
                      ...course.modules,
                      { ...module, id: newModuleId, lessons: [] },
                    ],
                    updatedAt: new Date(),
                  }
                : course
            ),
          }));
        } catch (error: any) {
          console.error("Error adding module:", error);
          toast.error(`Erro ao adicionar módulo: ${error.message}`);
          throw error;
        }
      },

      updateModule: async (courseId, moduleId, updates) => {
        try {
          const supabaseUpdates: any = {};
          
          if (updates.title !== undefined) supabaseUpdates.title = updates.title;
          if (updates.description !== undefined) supabaseUpdates.description = updates.description;

          // Update in Supabase
          const { error } = await supabase
            .from('modules')
            .update(supabaseUpdates)
            .eq('id', moduleId);

          if (error) throw error;

          set((state) => ({
            courses: state.courses.map((course) =>
              course.id === courseId
                ? {
                    ...course,
                    modules: course.modules.map((module) =>
                      module.id === moduleId
                        ? { ...module, ...updates }
                        : module
                    ),
                    updatedAt: new Date(),
                  }
                : course
            ),
          }));
        } catch (error: any) {
          console.error("Error updating module:", error);
          toast.error(`Erro ao atualizar módulo: ${error.message}`);
          throw error;
        }
      },

      deleteModule: async (courseId, moduleId) => {
        try {
          // Delete from Supabase
          const { error } = await supabase
            .from('modules')
            .delete()
            .eq('id', moduleId);

          if (error) throw error;

          set((state) => ({
            courses: state.courses.map((course) =>
              course.id === courseId
                ? {
                    ...course,
                    modules: course.modules.filter(
                      (module) => module.id !== moduleId
                    ),
                    updatedAt: new Date(),
                  }
                : course
            ),
          }));
        } catch (error: any) {
          console.error("Error deleting module:", error);
          toast.error(`Erro ao excluir módulo: ${error.message}`);
          throw error;
        }
      },

      addLesson: async (courseId, moduleId, lesson) => {
        try {
          const supabaseLesson = {
            module_id: moduleId,
            title: lesson.title,
            description: lesson.description,
            duration: lesson.duration,
            activity_type: lesson.activityType,
            notes: lesson.notes || '',
            status: 'Fazer' as LessonStatus
          };

          // Insert into Supabase
          const { data, error } = await supabase
            .from('lessons')
            .insert(supabaseLesson)
            .select('id')
            .single();

          if (error) throw error;

          const newLessonId = data.id;

          set((state) => ({
            courses: state.courses.map((course) =>
              course.id === courseId
                ? {
                    ...course,
                    modules: course.modules.map((module) =>
                      module.id === moduleId
                        ? {
                            ...module,
                            lessons: [
                              ...module.lessons,
                              {
                                ...lesson,
                                id: newLessonId,
                                status: "Fazer",
                                notes: lesson.notes || "",
                              },
                            ],
                          }
                        : module
                    ),
                    updatedAt: new Date(),
                  }
                : course
            ),
          }));
        } catch (error: any) {
          console.error("Error adding lesson:", error);
          toast.error(`Erro ao adicionar aula: ${error.message}`);
          throw error;
        }
      },

      updateLesson: async (courseId, moduleId, lessonId, updates) => {
        try {
          const supabaseUpdates: any = {};
          
          if (updates.title !== undefined) supabaseUpdates.title = updates.title;
          if (updates.description !== undefined) supabaseUpdates.description = updates.description;
          if (updates.duration !== undefined) supabaseUpdates.duration = updates.duration;
          if (updates.activityType !== undefined) supabaseUpdates.activity_type = updates.activityType;
          if (updates.status !== undefined) supabaseUpdates.status = updates.status;
          if (updates.notes !== undefined) supabaseUpdates.notes = updates.notes;

          // Update in Supabase
          const { error } = await supabase
            .from('lessons')
            .update(supabaseUpdates)
            .eq('id', lessonId);

          if (error) throw error;

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
                                ? { ...lesson, ...updates }
                                : lesson
                            ),
                          }
                        : module
                    ),
                    updatedAt: new Date(),
                  }
                : course
            ),
          }));
        } catch (error: any) {
          console.error("Error updating lesson:", error);
          toast.error(`Erro ao atualizar aula: ${error.message}`);
          throw error;
        }
      },

      deleteLesson: async (courseId, moduleId, lessonId) => {
        try {
          // Delete from Supabase
          const { error } = await supabase
            .from('lessons')
            .delete()
            .eq('id', lessonId);

          if (error) throw error;

          set((state) => ({
            courses: state.courses.map((course) =>
              course.id === courseId
                ? {
                    ...course,
                    modules: course.modules.map((module) =>
                      module.id === moduleId
                        ? {
                            ...module,
                            lessons: module.lessons.filter(
                              (lesson) => lesson.id !== lessonId
                            ),
                          }
                        : module
                    ),
                    updatedAt: new Date(),
                  }
                : course
            ),
          }));
        } catch (error: any) {
          console.error("Error deleting lesson:", error);
          toast.error(`Erro ao excluir aula: ${error.message}`);
          throw error;
        }
      },

      updateLessonStatus: async (courseId, moduleId, lessonId, status) => {
        try {
          // Update in Supabase
          const { error } = await supabase
            .from('lessons')
            .update({ status })
            .eq('id', lessonId);

          if (error) throw error;

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
                            ),
                          }
                        : module
                    ),
                    updatedAt: new Date(),
                  }
                : course
            ),
          }));
        } catch (error: any) {
          console.error("Error updating lesson status:", error);
          toast.error(`Erro ao atualizar status da aula: ${error.message}`);
          throw error;
        }
      },

      updateCourseStatus: async (courseId, status) => {
        try {
          // Update in Supabase
          const { error } = await supabase
            .from('courses')
            .update({ status })
            .eq('id', courseId);

          if (error) throw error;

          set((state) => ({
            courses: state.courses.map((course) =>
              course.id === courseId
                ? { ...course, status, updatedAt: new Date() }
                : course
            ),
          }));
        } catch (error: any) {
          console.error("Error updating course status:", error);
          toast.error(`Erro ao atualizar status do curso: ${error.message}`);
          throw error;
        }
      },

      addCollaborator: async (courseId, userId) => {
        try {
          const collaboratorData = {
            course_id: courseId,
            user_id: userId
          };

          // Insert into Supabase
          const { error } = await supabase
            .from('course_collaborators')
            .insert(collaboratorData);

          if (error) throw error;

          set((state) => ({
            courses: state.courses.map((course) =>
              course.id === courseId
                ? {
                    ...course,
                    collaborators: course.collaborators
                      ? [...course.collaborators, userId]
                      : [userId],
                    updatedAt: new Date(),
                  }
                : course
            ),
          }));
        } catch (error: any) {
          console.error("Error adding collaborator:", error);
          toast.error(`Erro ao adicionar colaborador: ${error.message}`);
          throw error;
        }
      },

      removeCollaborator: async (courseId, userId) => {
        try {
          // Delete from Supabase
          const { error } = await supabase
            .from('course_collaborators')
            .delete()
            .eq('course_id', courseId)
            .eq('user_id', userId);

          if (error) throw error;

          set((state) => ({
            courses: state.courses.map((course) =>
              course.id === courseId
                ? {
                    ...course,
                    collaborators: course.collaborators
                      ? course.collaborators.filter((id) => id !== userId)
                      : [],
                    updatedAt: new Date(),
                  }
                : course
            ),
          }));
        } catch (error: any) {
          console.error("Error removing collaborator:", error);
          toast.error(`Erro ao remover colaborador: ${error.message}`);
          throw error;
        }
      },

      submitForApproval: async (
        courseId,
        requestedBy,
        approverId,
        approvalType,
        itemId,
        comments
      ) => {
        try {
          const approvalData = {
            course_id: courseId,
            requested_by: requestedBy,
            approver_id: approverId,
            approval_type: approvalType,
            item_id: itemId,
            comments,
            status: 'Pendente'
          };

          // Insert into Supabase
          const { data, error } = await supabase
            .from('approval_requests')
            .insert(approvalData)
            .select('id')
            .single();

          if (error) throw error;

          const newApprovalId = data.id;

          const newApproval: ApprovalRequest = {
            id: newApprovalId,
            courseId,
            requestedBy,
            approverId,
            requestDate: new Date(),
            approvalType,
            itemId,
            status: "Pendente",
            comments,
          };

          set((state) => ({
            courses: state.courses.map((course) =>
              course.id === courseId
                ? {
                    ...course,
                    approvalRequests: course.approvalRequests
                      ? [...course.approvalRequests, newApproval]
                      : [newApproval],
                    updatedAt: new Date(),
                  }
                : course
            ),
          }));
        } catch (error: any) {
          console.error("Error submitting for approval:", error);
          toast.error(`Erro ao solicitar aprovação: ${error.message}`);
          throw error;
        }
      },

      updateApprovalStatus: async (courseId, approvalId, status, comments) => {
        try {
          const updates = {
            status,
            comments: comments !== undefined ? comments : undefined,
            review_date: new Date().toISOString()
          };

          // Update in Supabase
          const { error } = await supabase
            .from('approval_requests')
            .update(updates)
            .eq('id', approvalId);

          if (error) throw error;

          set((state) => ({
            courses: state.courses.map((course) =>
              course.id === courseId
                ? {
                    ...course,
                    approvalRequests: course.approvalRequests
                      ? course.approvalRequests.map((approval) =>
                          approval.id === approvalId
                            ? {
                                ...approval,
                                status,
                                comments:
                                  comments !== undefined
                                    ? comments
                                    : approval.comments,
                                reviewDate: new Date(),
                              }
                            : approval
                        )
                      : [],
                    updatedAt: new Date(),
                  }
                : course
            ),
          }));
        } catch (error: any) {
          console.error("Error updating approval status:", error);
          toast.error(`Erro ao atualizar status da aprovação: ${error.message}`);
          throw error;
        }
      },
      
      reorderModule: async (courseId, oldIndex, newIndex) => {
        try {
          set((state) => {
            const course = state.courses.find(c => c.id === courseId);
            if (!course) return state;
            
            const modules = [...course.modules];
            const [movedModule] = modules.splice(oldIndex, 1);
            modules.splice(newIndex, 0, movedModule);
            
            // Update positions in Supabase - done as background task
            modules.forEach((module, index) => {
              supabase
                .from('modules')
                .update({ position: index })
                .eq('id', module.id)
                .then(({ error }) => {
                  if (error) console.error("Error updating module position:", error);
                });
            });
            
            return {
              courses: state.courses.map((c) =>
                c.id === courseId ? { ...c, modules, updatedAt: new Date() } : c
              ),
            };
          });
        } catch (error: any) {
          console.error("Error reordering modules:", error);
          toast.error(`Erro ao reordenar módulos: ${error.message}`);
        }
      },
      
      reorderLesson: async (courseId, moduleId, oldIndex, newIndex) => {
        try {
          set((state) => {
            const course = state.courses.find(c => c.id === courseId);
            if (!course) return state;
            
            const moduleIndex = course.modules.findIndex(m => m.id === moduleId);
            if (moduleIndex === -1) return state;
            
            const lessons = [...course.modules[moduleIndex].lessons];
            const [movedLesson] = lessons.splice(oldIndex, 1);
            lessons.splice(newIndex, 0, movedLesson);
            
            // Update positions in Supabase - done as background task
            lessons.forEach((lesson, index) => {
              supabase
                .from('lessons')
                .update({ position: index })
                .eq('id', lesson.id)
                .then(({ error }) => {
                  if (error) console.error("Error updating lesson position:", error);
                });
            });
            
            const updatedModules = [...course.modules];
            updatedModules[moduleIndex] = {
              ...updatedModules[moduleIndex],
              lessons
            };
            
            return {
              courses: state.courses.map((c) =>
                c.id === courseId ? { ...c, modules: updatedModules, updatedAt: new Date() } : c
              ),
            };
          });
        } catch (error: any) {
          console.error("Error reordering lessons:", error);
          toast.error(`Erro ao reordenar aulas: ${error.message}`);
        }
      },
      
      getVisibleCoursesForUser: (userId, userDepartment) => {
        const state = get();
        return state.courses.filter(course => {
          // User is creator
          if (course.createdBy === userId) return true;
          
          // User is collaborator
          if (course.collaborators && course.collaborators.includes(userId)) return true;
          
          // Course is in user's department
          if (userDepartment && course.department === userDepartment) return true;
          
          return false;
        });
      }
    }),
    { name: "course-store" }
  )
);
