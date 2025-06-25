
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCreatorProfile } from '@/hooks/creator/useCreatorProfile';
import { toast } from 'sonner';

export interface CreatorCourse {
  id: string;
  instructor_id: string;
  title: string;
  description?: string;
  skill_level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  duration_minutes?: number;
  price: number;
  is_free: boolean;
  course_data: Record<string, any>;
  enrollment_count: number;
  rating_average: number;
  rating_count: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseEnrollment {
  id: string;
  course_id: string;
  student_id: string;
  progress_percentage: number;
  completed_at?: string;
  certificate_issued: boolean;
  rating?: number;
  review?: string;
  enrolled_at: string;
}

export interface CreatorWorkshop {
  id: string;
  instructor_id: string;
  title: string;
  description?: string;
  workshop_type: 'live_stream' | 'recorded' | 'interactive';
  skill_level?: 'beginner' | 'intermediate' | 'advanced';
  max_attendees?: number;
  current_attendees: number;
  price: number;
  scheduled_at: string;
  duration_minutes: number;
  stream_url?: string;
  recording_url?: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export const useCreatorEducation = () => {
  const { profile } = useCreatorProfile();
  const queryClient = useQueryClient();

  // Courses
  const { data: courses, isLoading: loadingCourses } = useQuery({
    queryKey: ['creator-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('creator_courses')
        .select('*')
        .eq('is_published', true)
        .order('rating_average', { ascending: false });

      if (error) throw error;
      return data as CreatorCourse[];
    },
  });

  const { data: myCourses, isLoading: loadingMyCourses } = useQuery({
    queryKey: ['my-courses', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];

      const { data, error } = await supabase
        .from('creator_courses')
        .select('*')
        .eq('instructor_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CreatorCourse[];
    },
    enabled: !!profile?.id,
  });

  const { data: myEnrollments, isLoading: loadingEnrollments } = useQuery({
    queryKey: ['my-enrollments', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];

      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          creator_courses (
            id,
            title,
            instructor_id,
            duration_minutes,
            category
          )
        `)
        .eq('student_id', profile.id)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id,
  });

  const createCourse = useMutation({
    mutationFn: async (courseData: Partial<CreatorCourse>) => {
      if (!profile?.id) throw new Error('Creator profile required');

      const { data, error } = await supabase
        .from('creator_courses')
        .insert({
          instructor_id: profile.id,
          title: courseData.title!,
          description: courseData.description,
          skill_level: courseData.skill_level!,
          category: courseData.category!,
          duration_minutes: courseData.duration_minutes,
          price: courseData.price || 0,
          is_free: courseData.is_free ?? true,
          course_data: courseData.course_data || {},
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-courses'] });
      toast.success('Course created successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to create course: ${error.message}`);
    },
  });

  const enrollInCourse = useMutation({
    mutationFn: async (courseId: string) => {
      if (!profile?.id) throw new Error('Creator profile required');

      const { data, error } = await supabase
        .from('course_enrollments')
        .insert({
          course_id: courseId,
          student_id: profile.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
      toast.success('Successfully enrolled in course!');
    },
    onError: (error) => {
      toast.error(`Enrollment failed: ${error.message}`);
    },
  });

  // Workshops
  const { data: workshops, isLoading: loadingWorkshops } = useQuery({
    queryKey: ['creator-workshops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('creator_workshops')
        .select('*')
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at');

      if (error) throw error;
      return data as CreatorWorkshop[];
    },
  });

  const createWorkshop = useMutation({
    mutationFn: async (workshopData: Partial<CreatorWorkshop>) => {
      if (!profile?.id) throw new Error('Creator profile required');

      const { data, error } = await supabase
        .from('creator_workshops')
        .insert({
          instructor_id: profile.id,
          title: workshopData.title!,
          description: workshopData.description,
          workshop_type: workshopData.workshop_type!,
          skill_level: workshopData.skill_level,
          max_attendees: workshopData.max_attendees,
          price: workshopData.price || 0,
          scheduled_at: workshopData.scheduled_at!,
          duration_minutes: workshopData.duration_minutes!,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-workshops'] });
      toast.success('Workshop created successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to create workshop: ${error.message}`);
    },
  });

  const registerForWorkshop = useMutation({
    mutationFn: async (workshopId: string) => {
      if (!profile?.id) throw new Error('Creator profile required');

      const { data, error } = await supabase
        .from('workshop_attendees')
        .insert({
          workshop_id: workshopId,
          attendee_id: profile.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-workshops'] });
      toast.success('Successfully registered for workshop!');
    },
    onError: (error) => {
      toast.error(`Registration failed: ${error.message}`);
    },
  });

  return {
    // Courses
    courses: courses || [],
    myCourses: myCourses || [],
    myEnrollments: myEnrollments || [],
    loadingCourses,
    loadingMyCourses,
    loadingEnrollments,
    createCourse,
    enrollInCourse,

    // Workshops
    workshops: workshops || [],
    loadingWorkshops,
    createWorkshop,
    registerForWorkshop,
  };
};
