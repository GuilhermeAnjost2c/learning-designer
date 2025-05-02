
import { create } from "zustand";
import { sampleCourses } from "@/utils/sampleData";
import { devtools } from "zustand/middleware";
import { nanoid } from "nanoid";

export type CourseStatus = "Rascunho" | "Em andamento" | "Concluído" | "Arquivado";
export type LessonStatus = "Fazer" | "Fazendo" | "Finalizando";
export type ActivityType = "Exposição" | "Dinâmica" | "Debate" | "Avaliação";
export type CourseFormat = "EAD" | "Ao vivo" | "Híbrido";
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
  addCourse: (course: Omit<Course, "id" | "createdAt" | "updatedAt" | "status">) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addModule: (courseId: string, module: Omit<Module, "id" | "lessons">) => void;
  updateModule: (courseId: string, moduleId: string, updates: Partial<Module>) => void;
  deleteModule: (courseId: string, moduleId: string) => void;
  addLesson: (courseId: string, moduleId: string, lesson: Omit<Lesson, "id" | "status">) => void;
  updateLesson: (courseId: string, moduleId: string, lessonId: string, updates: Partial<Lesson>) => void;
  deleteLesson: (courseId: string, moduleId: string, lessonId: string) => void;
  updateLessonStatus: (courseId: string, moduleId: string, lessonId: string, status: LessonStatus) => void;
  updateCourseStatus: (courseId: string, status: CourseStatus) => void;
  addCollaborator: (courseId: string, userId: string) => void;
  removeCollaborator: (courseId: string, userId: string) => void;
  submitForApproval: (
    courseId: string,
    requestedBy: string,
    approverId: string,
    approvalType: ApprovalItemType,
    itemId?: string,
    comments?: string
  ) => void;
  updateApprovalStatus: (
    courseId: string,
    approvalId: string,
    status: ApprovalStatus,
    comments?: string
  ) => void;
  reorderModule: (courseId: string, oldIndex: number, newIndex: number) => void;
  reorderLesson: (courseId: string, moduleId: string, oldIndex: number, newIndex: number) => void;
  // Add the missing function
  getVisibleCoursesForUser: (userId: string, userDepartment?: string) => Course[];
}

export const useCourseStore = create<CourseStore>()(
  devtools(
    (set, get) => ({
      courses: [...sampleCourses],

      addCourse: (course) => {
        set((state) => ({
          courses: [
            ...state.courses,
            {
              ...course,
              id: nanoid(7),
              createdAt: new Date(),
              updatedAt: new Date(),
              status: "Rascunho",
              modules: course.modules || [],
              collaborators: course.collaborators || [],
              format: course.format || "EAD",
            },
          ],
        }));
      },

      updateCourse: (id, updates) => {
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === id
              ? { ...course, ...updates, updatedAt: new Date() }
              : course
          ),
        }));
      },

      deleteCourse: (id) => {
        set((state) => ({
          courses: state.courses.filter((course) => course.id !== id),
        }));
      },

      addModule: (courseId, module) => {
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  modules: [
                    ...course.modules,
                    { ...module, id: nanoid(7), lessons: [] },
                  ],
                  updatedAt: new Date(),
                }
              : course
          ),
        }));
      },

      updateModule: (courseId, moduleId, updates) => {
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
      },

      deleteModule: (courseId, moduleId) => {
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
      },

      addLesson: (courseId, moduleId, lesson) => {
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
                              id: nanoid(7),
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
      },

      updateLesson: (courseId, moduleId, lessonId, updates) => {
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
      },

      deleteLesson: (courseId, moduleId, lessonId) => {
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
      },

      updateLessonStatus: (courseId, moduleId, lessonId, status) => {
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
      },

      updateCourseStatus: (courseId, status) => {
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? { ...course, status, updatedAt: new Date() }
              : course
          ),
        }));
      },

      addCollaborator: (courseId, userId) => {
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
      },

      removeCollaborator: (courseId, userId) => {
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
      },

      submitForApproval: (
        courseId,
        requestedBy,
        approverId,
        approvalType,
        itemId,
        comments
      ) => {
        const newApproval: ApprovalRequest = {
          id: nanoid(7),
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
      },

      updateApprovalStatus: (courseId, approvalId, status, comments) => {
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
      },
      
      reorderModule: (courseId, oldIndex, newIndex) => {
        set((state) => {
          const course = state.courses.find(c => c.id === courseId);
          if (!course) return state;
          
          const modules = [...course.modules];
          const [movedModule] = modules.splice(oldIndex, 1);
          modules.splice(newIndex, 0, movedModule);
          
          return {
            courses: state.courses.map((c) =>
              c.id === courseId ? { ...c, modules, updatedAt: new Date() } : c
            ),
          };
        });
      },
      
      reorderLesson: (courseId, moduleId, oldIndex, newIndex) => {
        set((state) => {
          const course = state.courses.find(c => c.id === courseId);
          if (!course) return state;
          
          const moduleIndex = course.modules.findIndex(m => m.id === moduleId);
          if (moduleIndex === -1) return state;
          
          const lessons = [...course.modules[moduleIndex].lessons];
          const [movedLesson] = lessons.splice(oldIndex, 1);
          lessons.splice(newIndex, 0, movedLesson);
          
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
      },
      
      // Implementation of the getVisibleCoursesForUser function
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
