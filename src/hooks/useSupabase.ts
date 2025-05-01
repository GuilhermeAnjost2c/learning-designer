
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Course, Module, Lesson, ActivityType, LessonStatus, CourseStatus, ApprovalItemType } from '@/store/courseStore';
import { User } from '@/store/userStore';

export const useSupabase = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all courses
  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
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

      if (error) throw error;
      
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
          modules: formatModules(course.modules),
          createdAt: new Date(course.created_at),
          updatedAt: new Date(course.updated_at),
          tags: course.tags || [],
          status: (course.status as CourseStatus) || 'Rascunho',
          createdBy: course.created_by,
          department: course.department,
          collaborators: course.course_collaborators?.map(collab => collab.user_id) || [],
        };
      }) || [];
      
      return formattedCourses;
    } catch (err: any) {
      console.error('Error fetching courses:', err);
      setError(err.message);
      toast.error('Erro ao buscar cursos: ' + err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Format modules from Supabase data
  const formatModules = (modules: any[]): Module[] => {
    if (!modules) return [];
    
    return modules.map(module => ({
      id: module.id,
      title: module.title,
      description: module.description || '',
      lessons: formatLessons(module.lessons),
    }));
  };

  // Format lessons from Supabase data
  const formatLessons = (lessons: any[]): Lesson[] => {
    if (!lessons) return [];
    
    return lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description || '',
      duration: lesson.duration || 0,
      activityType: (lesson.activity_type as ActivityType) || 'Exposição',
      notes: lesson.notes || '',
      status: (lesson.status as LessonStatus) || 'Fazer',
    }));
  };

  // Create a new course
  const createCourse = async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    setError(null);
    try {
      // Format the data for the supabase table structure
      const supabaseCourse = {
        name: courseData.name,
        description: courseData.description,
        objectives: courseData.objectives,
        target_audience: courseData.targetAudience,
        estimated_duration: courseData.estimatedDuration,
        thumbnail: courseData.thumbnail,
        tags: courseData.tags,
        status: courseData.status,
        created_by: courseData.createdBy,
        department: courseData.department
      };

      const { data: courseData1, error } = await supabase
        .from('courses')
        .insert(supabaseCourse)
        .select();

      if (error) throw error;

      // Add collaborators if provided
      if (courseData1 && courseData1[0] && courseData.collaborators && courseData.collaborators.length > 0) {
        const collaboratorsData = courseData.collaborators.map(userId => ({
          course_id: courseData1[0].id,
          user_id: userId
        }));

        const { error: collabError } = await supabase
          .from('course_collaborators')
          .insert(collaboratorsData);

        if (collabError) throw collabError;
      }

      toast.success('Curso criado com sucesso!');
      
      // Return the created course ID
      return courseData1 ? courseData1[0].id : null;
    } catch (err: any) {
      console.error('Error creating course:', err);
      setError(err.message);
      toast.error('Erro ao criar curso: ' + err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing course
  const updateCourse = async (courseId: string, courseData: Partial<Course>) => {
    setIsLoading(true);
    setError(null);
    try {
      // Format the data for the supabase table structure
      const supabaseCourse: any = {};
      if (courseData.name) supabaseCourse.name = courseData.name;
      if (courseData.description) supabaseCourse.description = courseData.description;
      if (courseData.objectives) supabaseCourse.objectives = courseData.objectives;
      if (courseData.targetAudience) supabaseCourse.target_audience = courseData.targetAudience;
      if (courseData.estimatedDuration) supabaseCourse.estimated_duration = courseData.estimatedDuration;
      if (courseData.thumbnail) supabaseCourse.thumbnail = courseData.thumbnail;
      if (courseData.tags) supabaseCourse.tags = courseData.tags;
      if (courseData.status) supabaseCourse.status = courseData.status;
      if (courseData.department) supabaseCourse.department = courseData.department;
      
      // Only update if there are changes
      if (Object.keys(supabaseCourse).length > 0) {
        const { error } = await supabase
          .from('courses')
          .update(supabaseCourse)
          .eq('id', courseId);

        if (error) throw error;
      }

      // Update collaborators if provided
      if (courseData.collaborators) {
        // First, get current collaborators
        const { data: currentCollabs, error: fetchError } = await supabase
          .from('course_collaborators')
          .select('user_id')
          .eq('course_id', courseId);

        if (fetchError) throw fetchError;

        const currentCollabIds = currentCollabs?.map(c => c.user_id) || [];
        const newCollabIds = courseData.collaborators || [];
        
        // Collaborators to add
        const toAdd = newCollabIds.filter(id => !currentCollabIds.includes(id));
        
        // Collaborators to remove
        const toRemove = currentCollabIds.filter(id => !newCollabIds.includes(id));

        // Add new collaborators
        if (toAdd.length > 0) {
          const addData = toAdd.map(userId => ({
            course_id: courseId,
            user_id: userId
          }));

          const { error: addError } = await supabase
            .from('course_collaborators')
            .insert(addData);

          if (addError) throw addError;
        }

        // Remove old collaborators
        if (toRemove.length > 0) {
          const { error: removeError } = await supabase
            .from('course_collaborators')
            .delete()
            .eq('course_id', courseId)
            .in('user_id', toRemove);

          if (removeError) throw removeError;
        }
      }

      toast.success('Curso atualizado com sucesso!');
      return true;
    } catch (err: any) {
      console.error('Error updating course:', err);
      setError(err.message);
      toast.error('Erro ao atualizar curso: ' + err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a course
  const deleteCourse = async (courseId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Delete course (cascade should handle modules, lessons, and collaborators)
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      toast.success('Curso excluído com sucesso!');
      return true;
    } catch (err: any) {
      console.error('Error deleting course:', err);
      setError(err.message);
      toast.error('Erro ao excluir curso: ' + err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Add a module to a course
  const addModule = async (courseId: string, moduleData: Omit<Module, 'id' | 'lessons'>) => {
    setIsLoading(true);
    setError(null);
    try {
      // Get the current module count to determine position
      const { data: modules, error: countError } = await supabase
        .from('modules')
        .select('id')
        .eq('course_id', courseId);

      if (countError) throw countError;

      const position = modules ? modules.length : 0;

      const { data, error } = await supabase
        .from('modules')
        .insert({
          course_id: courseId,
          title: moduleData.title,
          description: moduleData.description,
          position: position
        })
        .select();

      if (error) throw error;

      toast.success('Módulo adicionado com sucesso!');
      return data && data[0] ? data[0].id : null;
    } catch (err: any) {
      console.error('Error adding module:', err);
      setError(err.message);
      toast.error('Erro ao adicionar módulo: ' + err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing module
  const updateModule = async (courseId: string, moduleId: string, moduleData: Partial<Module>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updateData: any = {};
      if (moduleData.title) updateData.title = moduleData.title;
      if (moduleData.description !== undefined) updateData.description = moduleData.description;

      const { error } = await supabase
        .from('modules')
        .update(updateData)
        .eq('id', moduleId)
        .eq('course_id', courseId);

      if (error) throw error;

      toast.success('Módulo atualizado com sucesso!');
      return true;
    } catch (err: any) {
      console.error('Error updating module:', err);
      setError(err.message);
      toast.error('Erro ao atualizar módulo: ' + err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a module
  const deleteModule = async (courseId: string, moduleId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Delete the module (cascade should handle lessons)
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', moduleId)
        .eq('course_id', courseId);

      if (error) throw error;

      // We should update the position of the remaining modules
      const { data: remainingModules, error: selectError } = await supabase
        .from('modules')
        .select('id, position')
        .eq('course_id', courseId)
        .order('position', { ascending: true });

      if (selectError) throw selectError;

      // Update positions
      if (remainingModules && remainingModules.length > 0) {
        for (let i = 0; i < remainingModules.length; i++) {
          await supabase
            .from('modules')
            .update({ position: i })
            .eq('id', remainingModules[i].id);
        }
      }

      toast.success('Módulo excluído com sucesso!');
      return true;
    } catch (err: any) {
      console.error('Error deleting module:', err);
      setError(err.message);
      toast.error('Erro ao excluir módulo: ' + err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Add a lesson to a module
  const addLesson = async (moduleId: string, lessonData: Omit<Lesson, 'id' | 'status'>) => {
    setIsLoading(true);
    setError(null);
    try {
      // Get the current lesson count to determine position
      const { data: lessons, error: countError } = await supabase
        .from('lessons')
        .select('id')
        .eq('module_id', moduleId);

      if (countError) throw countError;

      const position = lessons ? lessons.length : 0;

      const { data, error } = await supabase
        .from('lessons')
        .insert({
          module_id: moduleId,
          title: lessonData.title,
          description: lessonData.description,
          duration: lessonData.duration,
          activity_type: lessonData.activityType,
          notes: lessonData.notes,
          status: 'Fazer',
          position: position
        })
        .select();

      if (error) throw error;

      toast.success('Aula adicionada com sucesso!');
      return data && data[0] ? data[0].id : null;
    } catch (err: any) {
      console.error('Error adding lesson:', err);
      setError(err.message);
      toast.error('Erro ao adicionar aula: ' + err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing lesson
  const updateLesson = async (moduleId: string, lessonId: string, lessonData: Partial<Lesson>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updateData: any = {};
      if (lessonData.title) updateData.title = lessonData.title;
      if (lessonData.description !== undefined) updateData.description = lessonData.description;
      if (lessonData.duration) updateData.duration = lessonData.duration;
      if (lessonData.activityType) updateData.activity_type = lessonData.activityType;
      if (lessonData.notes !== undefined) updateData.notes = lessonData.notes;
      if (lessonData.status) updateData.status = lessonData.status;

      const { error } = await supabase
        .from('lessons')
        .update(updateData)
        .eq('id', lessonId)
        .eq('module_id', moduleId);

      if (error) throw error;

      toast.success('Aula atualizada com sucesso!');
      return true;
    } catch (err: any) {
      console.error('Error updating lesson:', err);
      setError(err.message);
      toast.error('Erro ao atualizar aula: ' + err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a lesson
  const deleteLesson = async (moduleId: string, lessonId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId)
        .eq('module_id', moduleId);

      if (error) throw error;

      // We should update the position of the remaining lessons
      const { data: remainingLessons, error: selectError } = await supabase
        .from('lessons')
        .select('id, position')
        .eq('module_id', moduleId)
        .order('position', { ascending: true });

      if (selectError) throw selectError;

      // Update positions
      if (remainingLessons && remainingLessons.length > 0) {
        for (let i = 0; i < remainingLessons.length; i++) {
          await supabase
            .from('lessons')
            .update({ position: i })
            .eq('id', remainingLessons[i].id);
        }
      }

      toast.success('Aula excluída com sucesso!');
      return true;
    } catch (err: any) {
      console.error('Error deleting lesson:', err);
      setError(err.message);
      toast.error('Erro ao excluir aula: ' + err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Reorder modules
  const reorderModules = async (courseId: string, moduleIds: string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      for (let i = 0; i < moduleIds.length; i++) {
        const { error } = await supabase
          .from('modules')
          .update({ position: i })
          .eq('id', moduleIds[i])
          .eq('course_id', courseId);

        if (error) throw error;
      }

      return true;
    } catch (err: any) {
      console.error('Error reordering modules:', err);
      setError(err.message);
      toast.error('Erro ao reordenar módulos: ' + err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Reorder lessons
  const reorderLessons = async (moduleId: string, lessonIds: string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      for (let i = 0; i < lessonIds.length; i++) {
        const { error } = await supabase
          .from('lessons')
          .update({ position: i })
          .eq('id', lessonIds[i])
          .eq('module_id', moduleId);

        if (error) throw error;
      }

      return true;
    } catch (err: any) {
      console.error('Error reordering lessons:', err);
      setError(err.message);
      toast.error('Erro ao reordenar aulas: ' + err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Submit course for approval
  const submitForApproval = async (courseId: string, requestedById: string, approvalType: ApprovalItemType, itemId?: string, comments?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // First, find a manager to be the approver
      const { data: managers, error: managerError } = await supabase.functions.invoke('manage-users', {
        body: {
          action: 'getManagersOrAdmin'
        }
      });

      if (managerError) throw managerError;

      if (!managers || managers.length === 0) {
        throw new Error('Não foi encontrado nenhum aprovador disponível');
      }

      // Use the first manager found as the approver
      const approverId = managers[0].id;

      const { data, error } = await supabase
        .from('approval_requests')
        .insert({
          course_id: courseId,
          requested_by: requestedById,
          approver_id: approverId,
          approval_type: approvalType,
          item_id: itemId,
          comments: comments,
          request_date: new Date().toISOString(),
          status: 'pendente'
        })
        .select();

      if (error) throw error;

      // Update course status to 'Em aprovação'
      const { error: updateError } = await supabase
        .from('courses')
        .update({ status: 'Em aprovação' })
        .eq('id', courseId);

      if (updateError) throw updateError;

      toast.success('Curso enviado para aprovação com sucesso!');
      return data ? data[0].id : null;
    } catch (err: any) {
      console.error('Error submitting for approval:', err);
      setError(err.message);
      toast.error('Erro ao enviar para aprovação: ' + err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Respond to approval request
  const respondToApprovalRequest = async (approvalRequestId: string, isApproved: boolean, comments?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Get the request first to know which course to update
      const { data: request, error: getError } = await supabase
        .from('approval_requests')
        .select('course_id')
        .eq('id', approvalRequestId)
        .single();

      if (getError) throw getError;

      // Update the approval request
      const { error } = await supabase
        .from('approval_requests')
        .update({
          status: isApproved ? 'aprovado' : 'rejeitado',
          comments: comments,
          review_date: new Date().toISOString()
        })
        .eq('id', approvalRequestId);

      if (error) throw error;

      // Update course status
      if (request && request.course_id) {
        const { error: updateError } = await supabase
          .from('courses')
          .update({
            status: isApproved ? 'Aprovado' : 'Revisão solicitada'
          })
          .eq('id', request.course_id);

        if (updateError) throw updateError;
      }

      toast.success(`Solicitação ${isApproved ? 'aprovada' : 'rejeitada'} com sucesso!`);
      return true;
    } catch (err: any) {
      console.error('Error responding to approval:', err);
      setError(err.message);
      toast.error('Erro ao responder a solicitação: ' + err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Search users by name (for adding collaborators)
  const searchUsersByName = async (query: string): Promise<User[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-users', {
        body: {
          action: 'searchUsers',
          query
        }
      });

      if (error) throw error;
      
      return data?.data?.map((user: any) => ({
        id: user.id,
        name: user.user_metadata?.name || 'Sem nome',
        email: user.email,
        role: user.user_metadata?.role || 'user',
        department: user.user_metadata?.department || null,
        avatar: user.user_metadata?.avatar || null
      })) || [];
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao buscar usuários: ' + err.message);
      console.error('Error searching users:', err);
      return [];
    }
  };

  // Get course by ID
  const getCourseById = async (courseId: string) => {
    setIsLoading(true);
    setError(null);
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
          ),
          approval_requests (*)
        `)
        .eq('id', courseId)
        .single();

      if (error) throw error;

      if (!data) return null;

      // Transform to match our local format
      const formattedCourse = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        objectives: data.objectives || '',
        targetAudience: data.target_audience || '',
        estimatedDuration: data.estimated_duration || 0,
        thumbnail: data.thumbnail || '',
        modules: formatModules(data.modules),
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        tags: data.tags || [],
        status: (data.status as CourseStatus) || 'Rascunho',
        createdBy: data.created_by,
        department: data.department,
        collaborators: data.course_collaborators?.map((collab: any) => collab.user_id) || [],
        approvalRequests: data.approval_requests?.map((req: any) => req.id) || [],
      };

      return formattedCourse;
    } catch (err: any) {
      console.error('Error getting course:', err);
      setError(err.message);
      toast.error('Erro ao buscar curso: ' + err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user data
  const fetchUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-users', {
        body: {
          action: 'getUserById',
          userId
        }
      });

      if (error) throw error;
      return data?.user;
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao buscar dados do usuário: ' + err.message);
      return null;
    }
  };

  // User management functions
  const createUser = async (email: string, password: string, userData: { role: string, department?: string, name: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('manage-users', {
        body: {
          action: 'createUser',
          email,
          password,
          userData
        }
      });

      if (error) throw error;
      toast.success('Usuário criado com sucesso');
      return data;
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao criar usuário: ' + err.message);
      console.error('Error creating user:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update user data
  const updateUser = async (userId: string, userData: { password?: string, userData?: object }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('manage-users', {
        body: {
          action: 'updateUser',
          userId,
          updates: userData
        }
      });

      if (error) throw error;
      toast.success('Usuário atualizado com sucesso');
      return data;
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao atualizar usuário: ' + err.message);
      console.error('Error updating user:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    // Course CRUD operations
    fetchCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    // Module operations
    addModule,
    updateModule,
    deleteModule,
    reorderModules,
    // Lesson operations  
    addLesson,
    updateLesson,
    deleteLesson,
    reorderLessons,
    // Approval operations
    submitForApproval,
    respondToApprovalRequest,
    // User operations
    fetchUserData,
    createUser,
    updateUser,
    searchUsersByName,
  };
};
