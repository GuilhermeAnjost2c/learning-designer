
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Course, Module, Lesson } from '@/types/course';
import { toast } from 'sonner';
import { useUserStore } from '@/store/userStore';

export const useCourses = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useUserStore();

  const fetchCourses = async () => {
    setLoading(true);
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
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our Course interface
      const courses = data.map(course => {
        // Extract collaborators from course_collaborators
        const collaborators = course.course_collaborators 
          ? course.course_collaborators.map((collab: any) => collab.user_id) 
          : [];
          
        // Remove the course_collaborators field and add collaborators array
        const { course_collaborators, ...courseData } = course;
        
        return {
          ...courseData,
          collaborators
        } as Course;
      });
      
      return courses;
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to fetch courses: ' + err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addCourse = async (courseData: Omit<Course, 'id' | 'created_at' | 'updated_at' | 'modules' | 'collaborators' | 'approval_requests'>) => {
    setLoading(true);
    setError(null);
    
    if (!currentUser) {
      toast.error('You must be logged in to create courses');
      setLoading(false);
      return null;
    }
    
    try {
      // Insert the course
      const { data, error } = await supabase
        .from('courses')
        .insert({
          name: courseData.name,
          description: courseData.description,
          objectives: courseData.objectives,
          target_audience: courseData.target_audience,
          estimated_duration: courseData.estimated_duration,
          thumbnail: courseData.thumbnail,
          tags: courseData.tags || [],
          status: courseData.status || 'Rascunho',
          created_by: currentUser.id,
          department: courseData.department,
          format: courseData.format || 'EAD'
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Course created successfully!');
      return data;
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to create course: ' + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async (id: string, courseData: Partial<Course>) => {
    setLoading(true);
    setError(null);
    try {
      // Remove properties that shouldn't be directly updated
      const { modules, collaborators, approval_requests, ...updateData } = courseData;
      
      const { data, error } = await supabase
        .from('courses')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Course updated successfully!');
      return data;
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to update course: ' + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Course deleted successfully!');
      return true;
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to delete course: ' + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addModule = async (courseId: string, moduleData: { title: string, description?: string }) => {
    setLoading(true);
    setError(null);
    try {
      // Get last position
      const { data: modules } = await supabase
        .from('modules')
        .select('position')
        .eq('course_id', courseId)
        .order('position', { ascending: false })
        .limit(1);
      
      const position = modules && modules.length > 0 ? modules[0].position + 1 : 0;
      
      const { data, error } = await supabase
        .from('modules')
        .insert({
          course_id: courseId,
          title: moduleData.title,
          description: moduleData.description || '',
          position
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Module added successfully!');
      return data;
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to add module: ' + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addLesson = async (moduleId: string, lessonData: { title: string, description: string, duration: number, activity_type: string, notes?: string }) => {
    setLoading(true);
    setError(null);
    try {
      // Get last position
      const { data: lessons } = await supabase
        .from('lessons')
        .select('position')
        .eq('module_id', moduleId)
        .order('position', { ascending: false })
        .limit(1);
      
      const position = lessons && lessons.length > 0 ? lessons[0].position + 1 : 0;
      
      const { data, error } = await supabase
        .from('lessons')
        .insert({
          module_id: moduleId,
          title: lessonData.title,
          description: lessonData.description,
          duration: lessonData.duration,
          activity_type: lessonData.activity_type,
          notes: lessonData.notes || '',
          position,
          status: 'Fazer'
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Lesson added successfully!');
      return data;
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to add lesson: ' + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    addModule,
    addLesson
  };
};
