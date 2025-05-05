
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Course, Module, Lesson } from '@/store/courseStore';
import { Database } from '@/integrations/supabase/types';

// Create custom type for course response
type CourseWithRelations = Database['public']['Tables']['courses']['Row'] & {
  modules?: Array<Database['public']['Tables']['modules']['Row'] & {
    lessons?: Array<Database['public']['Tables']['lessons']['Row']>
  }>,
  course_collaborators?: Array<Database['public']['Tables']['course_collaborators']['Row']>,
  approval_requests?: Array<Database['public']['Tables']['approval_requests']['Row']>
};

export const useSupabase = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    setIsLoading(true);
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
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match our Course type
      const transformedCourses: Course[] = (data as CourseWithRelations[]).map(course => {
        const modules: Module[] = course.modules?.map(module => {
          const lessons: Lesson[] = module.lessons?.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            duration: lesson.duration,
            activityType: lesson.activity_type as any,
            status: lesson.status as any,
            notes: lesson.notes || '',
          })) || [];
          
          return {
            id: module.id,
            title: module.title,
            description: module.description || '',
            lessons,
          };
        }) || [];
        
        const collaborators = course.course_collaborators?.map(collab => collab.user_id) || [];
        
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
          status: course.status as any,
          createdBy: course.created_by,
          department: course.department || undefined,
          modules,
          collaborators,
          approvalRequests: course.approval_requests?.map(req => ({
            id: req.id,
            courseId: req.course_id,
            requestedBy: req.requested_by,
            approverId: req.approver_id || '',
            requestDate: new Date(req.request_date),
            approvalType: req.approval_type as any,
            itemId: req.item_id || undefined,
            status: req.status as any,
            comments: req.comments || undefined,
            reviewDate: req.review_date ? new Date(req.review_date) : undefined,
          })) || [],
          format: course.format as any || 'EAD',
        };
      });
      
      return transformedCourses;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.log("Failed to fetch user profile:", error.message);
        return null;
      }
      
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const searchUsers = async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(10);

      if (error) {
        console.log("Failed to search users:", error.message);
        return [];
      }
      
      return data || [];
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  };

  // Create a course in Supabase
  const createCourse = async (courseData: any) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert(courseData)
        .select('id')
        .single();
        
      if (error) throw error;
      return data.id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Create a module in Supabase
  const createModule = async (moduleData: any) => {
    try {
      const { data, error } = await supabase
        .from('modules')
        .insert(moduleData)
        .select('id')
        .single();
        
      if (error) throw error;
      return data.id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Create a lesson in Supabase
  const createLesson = async (lessonData: any) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .insert(lessonData)
        .select('id')
        .single();
        
      if (error) throw error;
      return data.id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Update a course in Supabase
  const updateCourse = async (id: string, courseData: any) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Delete a course from Supabase
  const deleteCourse = async (id: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    isLoading,
    error,
    fetchCourses,
    fetchUserData,
    searchUsers,
    createCourse,
    createModule,
    createLesson,
    updateCourse,
    deleteCourse
  };
};
