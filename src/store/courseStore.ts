
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

// Define types
export type CourseStatus = 'Rascunho' | 'Em aprovação' | 'Aprovado' | 'Publicado' | 'Revisão solicitada';
export type ActivityType = 'Exposição' | 'Dinâmica' | 'Debate' | 'Avaliação' | 'Outro';
export type LessonStatus = 'Fazer' | 'Fazendo' | 'Finalizando';
export type ApprovalItemType = 'curso_completo' | 'modulo' | 'aula';
export type ApprovalStatus = 'pendente' | 'aprovado' | 'rejeitado';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  activityType: ActivityType;
  notes: string;
  status: LessonStatus;
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
  thumbnail: string;
  modules: Module[];
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  status: CourseStatus;
  createdBy: string;
  department?: string;
  collaborators?: string[];
}

export interface ApprovalRequest {
  id: string;
  courseId: string;
  requestedBy: string;
  approverId: string;
  approvalType: ApprovalItemType;
  itemId?: string;
  comments: string;
  requestDate: Date;
  status: ApprovalStatus;
  reviewDate: Date;
}

export interface CourseStore {
  courses: Course[];
  approvalRequests: ApprovalRequest[];
  
  // Course CRUD operations
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateCourse: (courseId: string, courseData: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
  
  // Module operations
  addModule: (courseId: string, moduleData: Omit<Module, 'id' | 'lessons'>) => string;
  updateModule: (courseId: string, moduleId: string, moduleData: Partial<Module>) => void;
  deleteModule: (courseId: string, moduleId: string) => void;
  reorderModules: (courseId: string, moduleIds: string[]) => void;
  
  // Lesson operations
  addLesson: (courseId: string, moduleId: string, lessonData: Omit<Lesson, 'id' | 'status'>) => string;
  updateLesson: (courseId: string, moduleId: string, lessonId: string, lessonData: Partial<Lesson>) => void;
  updateLessonStatus: (courseId: string, moduleId: string, lessonId: string, status: LessonStatus) => void;
  deleteLesson: (courseId: string, moduleId: string, lessonId: string) => void;
  reorderLessons: (courseId: string, moduleId: string, lessonIds: string[]) => void;
  
  // Status operations
  updateCourseStatus: (courseId: string, status: CourseStatus) => void;
  
  // Collaborator operations
  addCollaborator: (courseId: string, userId: string) => void;
  removeCollaborator: (courseId: string, userId: string) => void;
  
  // Approval operations
  submitForApproval: (courseId: string, requestedById: string, approverId: string, approvalType: ApprovalItemType, itemId?: string, comments?: string) => string;
  respondToApprovalRequest: (approvalRequestId: string, isApproved: boolean, comments?: string) => void;
  
  // Getters
  getApprovalRequestsForCourse: (courseId: string) => ApprovalRequest[];
  getVisibleCoursesForUser: (userId: string, userDepartment?: string | null) => Course[];

  // Supabase sync functions
  fetchCoursesFromSupabase: () => Promise<void>;
}

export const useCourseStore = create<CourseStore>()(
  persist(
    (set, get) => ({
      courses: [],
      approvalRequests: [],
      
      // Course CRUD operations
      addCourse: (courseData) => {
        const now = new Date();
        const newCourse: Course = {
          id: crypto.randomUUID(),
          ...courseData,
          status: courseData.status || 'Rascunho',
          createdAt: now,
          updatedAt: now,
          modules: []
        };

        set((state) => ({
          courses: [...state.courses, newCourse]
        }));
        
        // Sync with Supabase
        const { fetchCoursesFromSupabase } = get();
        supabase.from('courses').insert({
          id: newCourse.id,
          name: newCourse.name,
          description: newCourse.description,
          objectives: newCourse.objectives,
          target_audience: newCourse.targetAudience,
          estimated_duration: newCourse.estimatedDuration,
          thumbnail: newCourse.thumbnail,
          tags: newCourse.tags,
          status: newCourse.status,
          created_by: newCourse.createdBy,
          department: newCourse.department
        }).then(({ error }) => {
          if (error) {
            console.error("Error saving course to Supabase:", error);
          } else if (courseData.collaborators && courseData.collaborators.length > 0) {
            // Add collaborators
            const collaboratorsData = courseData.collaborators.map(userId => ({
              course_id: newCourse.id,
              user_id: userId
            }));
            
            supabase.from('course_collaborators').insert(collaboratorsData)
              .then(({ error }) => {
                if (error) console.error("Error saving collaborators:", error);
              });
          }
          
          // Refresh courses from Supabase to ensure consistency
          fetchCoursesFromSupabase();
        });
        
        return newCourse.id;
      },

      updateCourse: (courseId, courseData) => {
        set((state) => ({
          courses: state.courses.map(course =>
            course.id === courseId
              ? { ...course, ...courseData, updatedAt: new Date() }
              : course
          )
        }));
        
        // Sync with Supabase
        const updateData: any = { updated_at: new Date() };
        if (courseData.name) updateData.name = courseData.name;
        if (courseData.description) updateData.description = courseData.description;
        if (courseData.objectives) updateData.objectives = courseData.objectives;
        if (courseData.targetAudience) updateData.target_audience = courseData.targetAudience;
        if (courseData.estimatedDuration) updateData.estimated_duration = courseData.estimatedDuration;
        if (courseData.thumbnail) updateData.thumbnail = courseData.thumbnail;
        if (courseData.tags) updateData.tags = courseData.tags;
        if (courseData.status) updateData.status = courseData.status;
        if (courseData.department) updateData.department = courseData.department;
        
        supabase.from('courses').update(updateData).eq('id', courseId).then(({ error }) => {
          if (error) console.error("Error updating course in Supabase:", error);
          
          // Update collaborators if provided
          if (courseData.collaborators) {
            // Get the course to access current collaborators
            const course = get().courses.find(c => c.id === courseId);
            if (course) {
              const currentCollabs = course.collaborators || [];
              const newCollabs = courseData.collaborators;
              
              // Collaborators to add
              const toAdd = newCollabs.filter(id => !currentCollabs.includes(id));
              
              // Collaborators to remove
              const toRemove = currentCollabs.filter(id => !newCollabs.includes(id));
              
              // Add new collaborators
              if (toAdd.length > 0) {
                const addData = toAdd.map(userId => ({
                  course_id: courseId,
                  user_id: userId
                }));
                
                supabase.from('course_collaborators').insert(addData)
                  .then(({ error }) => {
                    if (error) console.error("Error adding collaborators:", error);
                  });
              }
              
              // Remove old collaborators
              if (toRemove.length > 0) {
                supabase.from('course_collaborators')
                  .delete()
                  .eq('course_id', courseId)
                  .in('user_id', toRemove)
                  .then(({ error }) => {
                    if (error) console.error("Error removing collaborators:", error);
                  });
              }
            }
          }
          
          // Refresh courses from Supabase
          get().fetchCoursesFromSupabase();
        });
      },

      deleteCourse: (courseId) => {
        set((state) => ({
          courses: state.courses.filter(course => course.id !== courseId)
        }));
        
        // Sync with Supabase
        supabase.from('courses').delete().eq('id', courseId).then(({ error }) => {
          if (error) console.error("Error deleting course from Supabase:", error);
        });
      },
      
      // Module operations
      addModule: (courseId, moduleData) => {
        const moduleId = crypto.randomUUID();
        
        set((state) => ({
          courses: state.courses.map(course => {
            if (course.id === courseId) {
              return {
                ...course,
                modules: [
                  ...course.modules,
                  {
                    id: moduleId,
                    ...moduleData,
                    lessons: []
                  }
                ],
                updatedAt: new Date()
              };
            }
            return course;
          })
        }));
        
        // Sync with Supabase
        // Get the position (next index)
        const position = get().courses.find(c => c.id === courseId)?.modules.length || 0;
        
        supabase.from('modules').insert({
          id: moduleId,
          course_id: courseId,
          title: moduleData.title,
          description: moduleData.description,
          position: position - 1 // We already added the module locally
        }).then(({ error }) => {
          if (error) console.error("Error saving module to Supabase:", error);
          
          // Refresh courses from Supabase
          get().fetchCoursesFromSupabase();
        });
        
        return moduleId;
      },

      updateModule: (courseId, moduleId, moduleData) => {
        set((state) => ({
          courses: state.courses.map(course => {
            if (course.id === courseId) {
              return {
                ...course,
                modules: course.modules.map(module =>
                  module.id === moduleId
                    ? { ...module, ...moduleData }
                    : module
                ),
                updatedAt: new Date()
              };
            }
            return course;
          })
        }));
        
        // Sync with Supabase
        const updateData: any = {};
        if (moduleData.title) updateData.title = moduleData.title;
        if (moduleData.description !== undefined) updateData.description = moduleData.description;
        
        supabase.from('modules').update(updateData).eq('id', moduleId).eq('course_id', courseId)
          .then(({ error }) => {
            if (error) console.error("Error updating module in Supabase:", error);
            
            // Refresh courses from Supabase
            get().fetchCoursesFromSupabase();
          });
      },

      deleteModule: (courseId, moduleId) => {
        set((state) => ({
          courses: state.courses.map(course => {
            if (course.id === courseId) {
              return {
                ...course,
                modules: course.modules.filter(module => module.id !== moduleId),
                updatedAt: new Date()
              };
            }
            return course;
          })
        }));
        
        // Sync with Supabase
        supabase.from('modules').delete().eq('id', moduleId).eq('course_id', courseId)
          .then(({ error }) => {
            if (error) console.error("Error deleting module from Supabase:", error);
            
            // Get remaining modules to update positions
            const { courses } = get();
            const course = courses.find(c => c.id === courseId);
            if (course) {
              // Update positions of remaining modules
              const modules = course.modules;
              
              // Use Promise.all to wait for all updates
              Promise.all(modules.map((module, index) => 
                supabase.from('modules').update({ position: index }).eq('id', module.id)
              )).then(() => {
                // Refresh courses from Supabase
                get().fetchCoursesFromSupabase();
              });
            }
          });
      },

      reorderModules: (courseId, moduleIds) => {
        set((state) => ({
          courses: state.courses.map(course => {
            if (course.id === courseId) {
              const reorderedModules = moduleIds.map(moduleId => 
                course.modules.find(module => module.id === moduleId)!
              );
              return { ...course, modules: reorderedModules, updatedAt: new Date() };
            }
            return course;
          })
        }));
        
        // Sync with Supabase
        moduleIds.forEach((moduleId, index) => {
          supabase.from('modules').update({ position: index }).eq('id', moduleId)
            .then(({ error }) => {
              if (error) console.error(`Error reordering module ${moduleId} in Supabase:`, error);
            });
        });
      },
      
      // Lesson operations
      addLesson: (courseId, moduleId, lessonData) => {
        const lessonId = crypto.randomUUID();
        
        set((state) => ({
          courses: state.courses.map(course => {
            if (course.id === courseId) {
              return {
                ...course,
                modules: course.modules.map(module => {
                  if (module.id === moduleId) {
                    return {
                      ...module,
                      lessons: [
                        ...module.lessons,
                        {
                          id: lessonId,
                          ...lessonData,
                          status: 'Fazer' as LessonStatus
                        }
                      ]
                    };
                  }
                  return module;
                }),
                updatedAt: new Date()
              };
            }
            return course;
          })
        }));
        
        // Sync with Supabase
        // Get the position (next index)
        const position = get().courses
          .find(c => c.id === courseId)
          ?.modules.find(m => m.id === moduleId)
          ?.lessons.length || 0;
        
        supabase.from('lessons').insert({
          id: lessonId,
          module_id: moduleId,
          title: lessonData.title,
          description: lessonData.description,
          duration: lessonData.duration,
          activity_type: lessonData.activityType,
          notes: lessonData.notes,
          status: 'Fazer',
          position: position - 1 // We already added the lesson locally
        }).then(({ error }) => {
          if (error) console.error("Error saving lesson to Supabase:", error);
          
          // Refresh courses from Supabase
          get().fetchCoursesFromSupabase();
        });
        
        return lessonId;
      },

      updateLesson: (courseId, moduleId, lessonId, lessonData) => {
        set((state) => ({
          courses: state.courses.map(course => {
            if (course.id === courseId) {
              return {
                ...course,
                modules: course.modules.map(module => {
                  if (module.id === moduleId) {
                    return {
                      ...module,
                      lessons: module.lessons.map(lesson =>
                        lesson.id === lessonId
                          ? { ...lesson, ...lessonData }
                          : lesson
                      )
                    };
                  }
                  return module;
                }),
                updatedAt: new Date()
              };
            }
            return course;
          })
        }));
        
        // Sync with Supabase
        const updateData: any = {};
        if (lessonData.title) updateData.title = lessonData.title;
        if (lessonData.description !== undefined) updateData.description = lessonData.description;
        if (lessonData.duration !== undefined) updateData.duration = lessonData.duration;
        if (lessonData.activityType) updateData.activity_type = lessonData.activityType;
        if (lessonData.notes !== undefined) updateData.notes = lessonData.notes;
        if (lessonData.status) updateData.status = lessonData.status;
        
        supabase.from('lessons').update(updateData).eq('id', lessonId).eq('module_id', moduleId)
          .then(({ error }) => {
            if (error) console.error("Error updating lesson in Supabase:", error);
            
            // Refresh courses from Supabase
            get().fetchCoursesFromSupabase();
          });
      },

      updateLessonStatus: (courseId, moduleId, lessonId, status) => {
        set((state) => ({
          courses: state.courses.map(course => {
            if (course.id === courseId) {
              return {
                ...course,
                modules: course.modules.map(module => {
                  if (module.id === moduleId) {
                    return {
                      ...module,
                      lessons: module.lessons.map(lesson =>
                        lesson.id === lessonId
                          ? { ...lesson, status }
                          : lesson
                      )
                    };
                  }
                  return module;
                }),
                updatedAt: new Date()
              };
            }
            return course;
          })
        }));
        
        // Sync with Supabase
        supabase.from('lessons').update({ status }).eq('id', lessonId).eq('module_id', moduleId)
          .then(({ error }) => {
            if (error) console.error("Error updating lesson status in Supabase:", error);
            
            // Refresh courses from Supabase
            get().fetchCoursesFromSupabase();
          });
      },

      deleteLesson: (courseId, moduleId, lessonId) => {
        set((state) => ({
          courses: state.courses.map(course => {
            if (course.id === courseId) {
              return {
                ...course,
                modules: course.modules.map(module => {
                  if (module.id === moduleId) {
                    return {
                      ...module,
                      lessons: module.lessons.filter(lesson => lesson.id !== lessonId)
                    };
                  }
                  return module;
                }),
                updatedAt: new Date()
              };
            }
            return course;
          })
        }));
        
        // Sync with Supabase
        supabase.from('lessons').delete().eq('id', lessonId).eq('module_id', moduleId)
          .then(({ error }) => {
            if (error) console.error("Error deleting lesson from Supabase:", error);
            
            // Get remaining lessons to update positions
            const { courses } = get();
            const course = courses.find(c => c.id === courseId);
            if (course) {
              const module = course.modules.find(m => m.id === moduleId);
              if (module) {
                // Update positions of remaining lessons
                const lessons = module.lessons;
                
                // Use Promise.all to wait for all updates
                Promise.all(lessons.map((lesson, index) => 
                  supabase.from('lessons').update({ position: index }).eq('id', lesson.id)
                )).then(() => {
                  // Refresh courses from Supabase
                  get().fetchCoursesFromSupabase();
                });
              }
            }
          });
      },

      reorderLessons: (courseId, moduleId, lessonIds) => {
        set((state) => ({
          courses: state.courses.map(course => {
            if (course.id === courseId) {
              return {
                ...course,
                modules: course.modules.map(module => {
                  if (module.id === moduleId) {
                    const reorderedLessons = lessonIds.map(lessonId => 
                      module.lessons.find(lesson => lesson.id === lessonId)!
                    );
                    return { ...module, lessons: reorderedLessons };
                  }
                  return module;
                }),
                updatedAt: new Date()
              };
            }
            return course;
          })
        }));
        
        // Sync with Supabase
        lessonIds.forEach((lessonId, index) => {
          supabase.from('lessons').update({ position: index }).eq('id', lessonId)
            .then(({ error }) => {
              if (error) console.error(`Error reordering lesson ${lessonId} in Supabase:`, error);
            });
        });
      },
      
      // Status operations
      updateCourseStatus: (courseId, status) => {
        set((state) => ({
          courses: state.courses.map(course => 
            course.id === courseId
              ? { ...course, status, updatedAt: new Date() }
              : course
          )
        }));
        
        // Sync with Supabase
        supabase.from('courses').update({ status }).eq('id', courseId)
          .then(({ error }) => {
            if (error) console.error("Error updating course status in Supabase:", error);
            
            // Refresh courses from Supabase
            get().fetchCoursesFromSupabase();
          });
      },
      
      // Collaborator operations
      addCollaborator: (courseId, userId) => {
        set((state) => ({
          courses: state.courses.map(course => {
            if (course.id === courseId) {
              const collaborators = course.collaborators || [];
              if (!collaborators.includes(userId)) {
                return {
                  ...course,
                  collaborators: [...collaborators, userId],
                  updatedAt: new Date()
                };
              }
            }
            return course;
          })
        }));
        
        // Sync with Supabase
        supabase.from('course_collaborators').insert({
          course_id: courseId,
          user_id: userId
        }).then(({ error }) => {
          if (error) console.error("Error adding collaborator to Supabase:", error);
          
          // Refresh courses from Supabase
          get().fetchCoursesFromSupabase();
        });
      },

      removeCollaborator: (courseId, userId) => {
        set((state) => ({
          courses: state.courses.map(course => {
            if (course.id === courseId && course.collaborators) {
              return {
                ...course,
                collaborators: course.collaborators.filter(id => id !== userId),
                updatedAt: new Date()
              };
            }
            return course;
          })
        }));
        
        // Sync with Supabase
        supabase.from('course_collaborators')
          .delete()
          .eq('course_id', courseId)
          .eq('user_id', userId)
          .then(({ error }) => {
            if (error) console.error("Error removing collaborator from Supabase:", error);
            
            // Refresh courses from Supabase
            get().fetchCoursesFromSupabase();
          });
      },
      
      // Approval operations
      submitForApproval: (courseId, requestedById, approverId, approvalType, itemId, comments) => {
        const approvalRequestId = crypto.randomUUID();
        const now = new Date();
        
        const newApprovalRequest: ApprovalRequest = {
          id: approvalRequestId,
          courseId: courseId,
          requestedBy: requestedById,
          approverId: approverId,
          approvalType: approvalType,
          itemId: itemId,
          comments: comments || '',
          requestDate: now,
          status: 'pendente',
          reviewDate: now // This will be updated when approved/rejected
        };
        
        set((state) => ({
          approvalRequests: [...state.approvalRequests, newApprovalRequest],
          courses: state.courses.map(course =>
            course.id === courseId
              ? { ...course, status: 'Em aprovação' as CourseStatus }
              : course
          )
        }));
        
        // Sync with Supabase
        supabase.from('approval_requests').insert({
          id: approvalRequestId,
          course_id: courseId,
          requested_by: requestedById,
          approver_id: approverId,
          approval_type: approvalType,
          item_id: itemId,
          comments: comments,
          request_date: now.toISOString(),
          status: 'pendente'
        }).then(({ error }) => {
          if (error) {
            console.error("Error submitting for approval to Supabase:", error);
          } else {
            // Update course status
            supabase.from('courses')
              .update({ status: 'Em aprovação' })
              .eq('id', courseId)
              .then(({ error: courseError }) => {
                if (courseError) console.error("Error updating course status in Supabase:", courseError);
                
                // Refresh courses from Supabase
                get().fetchCoursesFromSupabase();
              });
          }
        });
        
        return approvalRequestId;
      },

      respondToApprovalRequest: (approvalRequestId, isApproved, comments) => {
        const now = new Date();
        
        set((state) => {
          const approvalRequest = state.approvalRequests.find(
            req => req.id === approvalRequestId
          );
          
          if (!approvalRequest) return state;
          
          const courseId = approvalRequest.courseId;
          
          return {
            approvalRequests: state.approvalRequests.map(req =>
              req.id === approvalRequestId
                ? {
                    ...req,
                    status: isApproved ? 'aprovado' : 'rejeitado',
                    comments: comments || req.comments,
                    reviewDate: now
                  }
                : req
            ),
            courses: state.courses.map(course =>
              course.id === courseId
                ? {
                    ...course,
                    status: isApproved
                      ? 'Aprovado'
                      : 'Revisão solicitada'
                  }
                : course
            )
          };
        });
        
        // Sync with Supabase
        // First get the approval request to know which course to update
        supabase.from('approval_requests')
          .select('course_id')
          .eq('id', approvalRequestId)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error("Error getting approval request from Supabase:", error);
              return;
            }
            
            // Update the approval request
            supabase.from('approval_requests')
              .update({
                status: isApproved ? 'aprovado' : 'rejeitado',
                comments: comments,
                review_date: now.toISOString()
              })
              .eq('id', approvalRequestId)
              .then(({ error: updateError }) => {
                if (updateError) {
                  console.error("Error responding to approval in Supabase:", updateError);
                  return;
                }
                
                // Update course status
                if (data && data.course_id) {
                  supabase.from('courses')
                    .update({
                      status: isApproved ? 'Aprovado' : 'Revisão solicitada'
                    })
                    .eq('id', data.course_id)
                    .then(({ error: courseError }) => {
                      if (courseError) console.error("Error updating course status in Supabase:", courseError);
                      
                      // Refresh courses from Supabase
                      get().fetchCoursesFromSupabase();
                    });
                }
              });
          });
      },
      
      // Getters
      getApprovalRequestsForCourse: (courseId) => {
        return get().approvalRequests.filter(req => req.courseId === courseId);
      },

      getVisibleCoursesForUser: (userId, userDepartment) => {
        const { courses } = get();
        
        if (!userId) return [];
        
        return courses.filter(course => {
          // Course creator can see their courses
          if (course.createdBy === userId) return true;
          
          // Department members can see their department's courses
          if (userDepartment && course.department === userDepartment) return true;
          
          // Collaborators can see courses they collaborate on
          if (course.collaborators && course.collaborators.includes(userId)) return true;
          
          // Admin can see all courses
          return false;
        });
      },
      
      // Supabase sync functions
      fetchCoursesFromSupabase: async () => {
        try {
          const { data, error } = await supabase
            .from('courses')
            .select(`
              *,
              modules (
                *,
                lessons (*)
              ),
              course_collaborators (
                user_id
              )
            `)
            .order('created_at', { ascending: false });
          
          if (error) {
            console.error("Error fetching courses from Supabase:", error);
            return;
          }
          
          // Transform the data to match our local store structure
          const formattedCourses = data?.map(course => {
            return {
              id: course.id,
              name: course.name,
              description: course.description || '',
              objectives: course.objectives || '',
              targetAudience: course.target_audience || '',
              estimatedDuration: course.estimated_duration || 0,
              thumbnail: course.thumbnail || '',
              modules: formatModules(course.modules || []),
              createdAt: new Date(course.created_at),
              updatedAt: new Date(course.updated_at),
              tags: course.tags || [],
              status: (course.status as CourseStatus) || 'Rascunho',
              createdBy: course.created_by,
              department: course.department,
              collaborators: course.course_collaborators?.map(collab => collab.user_id) || [],
            };
          }) || [];
          
          // Format modules from Supabase data
          function formatModules(modules: any[]): Module[] {
            return modules.map(module => ({
              id: module.id,
              title: module.title,
              description: module.description || '',
              lessons: formatLessons(module.lessons || []),
            }));
          }
          
          // Format lessons from Supabase data
          function formatLessons(lessons: any[]): Lesson[] {
            return lessons.map(lesson => ({
              id: lesson.id,
              title: lesson.title,
              description: lesson.description || '',
              duration: lesson.duration || 0,
              activityType: (lesson.activity_type as ActivityType) || 'Exposição',
              notes: lesson.notes || '',
              status: (lesson.status as LessonStatus) || 'Fazer',
            }));
          }
          
          // Also fetch approval requests
          const { data: approvalData, error: approvalError } = await supabase
            .from('approval_requests')
            .select('*');
          
          if (approvalError) {
            console.error("Error fetching approval requests from Supabase:", approvalError);
            return;
          }
          
          // Transform approval requests
          const formattedApprovalRequests: ApprovalRequest[] = (approvalData || []).map(req => ({
            id: req.id,
            courseId: req.course_id || '',
            requestedBy: req.requested_by || '',
            approverId: req.approver_id || '',
            approvalType: (req.approval_type as ApprovalItemType) || 'curso_completo',
            itemId: req.item_id,
            comments: req.comments || '',
            requestDate: new Date(req.request_date || new Date()),
            status: (req.status as ApprovalStatus) || 'pendente',
            reviewDate: new Date(req.review_date || new Date()),
          }));
          
          // Update the store with data from Supabase
          set({
            courses: formattedCourses,
            approvalRequests: formattedApprovalRequests,
          });
          
        } catch (error) {
          console.error("Error in fetchCoursesFromSupabase:", error);
        }
      }
    }),
    {
      name: 'course-storage',
    }
  )
);
