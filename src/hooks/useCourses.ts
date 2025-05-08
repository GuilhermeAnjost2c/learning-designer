import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Course, Module, Lesson, DepartmentName } from '@/types/course';
import { toast } from 'sonner';
import { useUserStore } from '@/store/userStore';
import { mapCourseToStoreModel } from '@/utils/courseMappers';

export const useCourses = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useUserStore();

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching courses from Supabase...');
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

      if (error) {
        console.error('Supabase error when fetching courses:', error);
        throw error;
      }
      
      console.log('Courses data from Supabase:', data);
      
      if (!data || data.length === 0) {
        console.log('No courses found in Supabase');
        return [];
      }
      
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
      
      console.log('Transformed courses:', courses);
      return courses;
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching courses:", err);
      toast.error('Falha ao carregar cursos: ' + err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addCourse = async (courseData: Omit<Course, 'id' | 'created_at' | 'updated_at' | 'modules' | 'collaborators' | 'approval_requests'>) => {
    setLoading(true);
    setError(null);
    
    if (!currentUser) {
      toast.error('Você precisa estar logado para criar cursos');
      setLoading(false);
      return null;
    }
    
    try {
      console.log('Creating course with data:', courseData);
      console.log('Current user ID:', currentUser.id);
      
      // Prepare course data for insertion
      const courseInsertData = {
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
      };
      
      console.log('Final course data for insertion:', courseInsertData);
      
      // Insert the course
      const { data, error } = await supabase
        .from('courses')
        .insert(courseInsertData)
        .select();

      if (error) {
        console.error("Error creating course:", error);
        throw error;
      }
      
      console.log('Course created successfully:', data);
      toast.success('Curso criado com sucesso!');
      return data?.[0] || null;
    } catch (err: any) {
      setError(err.message);
      console.error("Error creating course:", err);
      toast.error('Falha ao criar curso: ' + err.message);
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
      
      toast.success('Curso atualizado com sucesso!');
      return data;
    } catch (err: any) {
      setError(err.message);
      toast.error('Falha ao atualizar curso: ' + err.message);
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
      
      toast.success('Curso deletado com sucesso!');
      return true;
    } catch (err: any) {
      setError(err.message);
      toast.error('Falha ao deletar curso: ' + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addModule = async (courseId: string, moduleData: { title: string, description?: string }) => {
    try {
      console.log('Adding module to course:', courseId, moduleData);
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

      if (error) {
        console.error('Error adding module:', error);
        throw error;
      }
      
      console.log('Module added successfully:', data);
      toast.success('Módulo adicionado com sucesso!');
      return data;
    } catch (err: any) {
      console.error('Error adding module:', err);
      toast.error('Falha ao adicionar módulo: ' + err.message);
      return null;
    }
  };

  const addLesson = async (moduleId: string, lessonData: { title: string, description: string, duration: number, activity_type: string, notes?: string }) => {
    try {
      console.log('Adding lesson to module:', moduleId, lessonData);
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

      if (error) {
        console.error('Error adding lesson:', error);
        throw error;
      }
      
      console.log('Lesson added successfully:', data);
      toast.success('Aula adicionada com sucesso!');
      return data;
    } catch (err: any) {
      console.error('Error adding lesson:', err);
      toast.error('Falha ao adicionar aula: ' + err.message);
      return null;
    }
  };

  return {
    loading,
    error,
    fetchCourses,
    addCourse,
    updateCourse: async (id: string, courseData: Partial<Course>) => {
      setLoading(true);
      try {
        console.log('Updating course:', id, courseData);
        const { data, error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', id)
          .select();
        
        if (error) throw error;
        console.log('Course updated:', data);
        return data?.[0] || null;
      } catch (err: any) {
        console.error('Error updating course:', err);
        setError(err.message);
        toast.error('Falha ao atualizar curso: ' + err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    deleteCourse: async (id: string) => {
      setLoading(true);
      try {
        console.log('Deleting course:', id);
        const { error } = await supabase
          .from('courses')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        toast.success('Curso deletado com sucesso!');
        return true;
      } catch (err: any) {
        console.error('Error deleting course:', err);
        setError(err.message);
        toast.error('Falha ao deletar curso: ' + err.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    addModule,
    addLesson
  };
};
