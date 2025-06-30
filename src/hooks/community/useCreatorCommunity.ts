
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCreatorProfile } from '@/hooks/creator/useCreatorProfile';
import { toast } from 'sonner';

export interface CreatorForum {
  id: string;
  name: string;
  description?: string;
  specialty: string;
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  moderator_ids: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ForumTopic {
  id: string;
  forum_id: string;
  creator_id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  is_locked: boolean;
  view_count: number;
  reply_count: number;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
}

export interface ForumReply {
  id: string;
  topic_id: string;
  creator_id: string;
  content: string;
  parent_reply_id?: string;
  is_solution: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatorCollaboration {
  id: string;
  project_id: string;
  collaborators: string[];
  ownership_split: Record<string, number>;
  project_type: 'template' | 'card_series' | 'collection' | 'tutorial';
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  revenue_sharing_agreement: Record<string, any>;
  deadline?: string;
  completion_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatorChallenge {
  id: string;
  title: string;
  description: string;
  challenge_type: 'design' | 'speed' | 'theme' | 'collaboration';
  skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'all';
  prize_pool: number;
  prize_distribution: Record<string, any>;
  start_date: string;
  end_date: string;
  submission_deadline: string;
  judging_criteria: Record<string, any>;
  participant_count: number;
  submission_count: number;
  status: 'upcoming' | 'active' | 'judging' | 'completed' | 'cancelled';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useCreatorCommunity = () => {
  const { profile } = useCreatorProfile();
  const queryClient = useQueryClient();

  // Forums
  const { data: forums, isLoading: loadingForums } = useQuery({
    queryKey: ['creator-forums'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('creator_forums')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data as CreatorForum[];
    },
  });

  const getForumTopics = (forumId: string) => {
    return useQuery({
      queryKey: ['forum-topics', forumId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('forum_topics')
          .select('*')
          .eq('forum_id', forumId)
          .order('is_pinned', { ascending: false })
          .order('last_activity_at', { ascending: false });

        if (error) throw error;
        return data as ForumTopic[];
      },
    });
  };

  const createForumTopic = useMutation({
    mutationFn: async ({ forumId, title, content }: { forumId: string; title: string; content: string }) => {
      if (!profile?.id) throw new Error('Creator profile required');

      const { data, error } = await supabase
        .from('forum_topics')
        .insert({
          forum_id: forumId,
          creator_id: profile.id,
          title,
          content,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-topics'] });
      toast.success('Topic created successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to create topic: ${error.message}`);
    },
  });

  // Challenges
  const { data: challenges, isLoading: loadingChallenges } = useQuery({
    queryKey: ['creator-challenges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('creator_challenges')
        .select('*')
        .in('status', ['upcoming', 'active', 'judging', 'completed'])
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data as CreatorChallenge[];
    },
  });

  const submitToChallenge = useMutation({
    mutationFn: async ({ challengeId, templateId, description }: { challengeId: string; templateId: string; description?: string }) => {
      if (!profile?.id) throw new Error('Creator profile required');

      const { data, error } = await supabase
        .from('challenge_submissions')
        .insert({
          challenge_id: challengeId,
          creator_id: profile.id,
          template_id: templateId,
          description,
          submission_data: {},
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-challenges'] });
      toast.success('Challenge submission successful!');
    },
    onError: (error) => {
      toast.error(`Submission failed: ${error.message}`);
    },
  });

  // Collaborations
  const { data: myCollaborations, isLoading: loadingCollaborations } = useQuery({
    queryKey: ['my-collaborations', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];

      const { data, error } = await supabase
        .from('creator_collaborations')
        .select('*')
        .contains('collaborators', [profile.id])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CreatorCollaboration[];
    },
    enabled: !!profile?.id,
  });

  const createCollaboration = useMutation({
    mutationFn: async ({ projectId, collaborators, ownershipSplit, projectType }: {
      projectId: string;
      collaborators: string[];
      ownershipSplit: Record<string, number>;
      projectType: 'template' | 'card_series' | 'collection' | 'tutorial';
    }) => {
      const { data, error } = await supabase
        .from('creator_collaborations')
        .insert({
          project_id: projectId,
          collaborators,
          ownership_split: ownershipSplit,
          project_type: projectType,
          revenue_sharing_agreement: {},
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-collaborations'] });
      toast.success('Collaboration created successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to create collaboration: ${error.message}`);
    },
  });

  // Social Features
  const { data: activityFeed, isLoading: loadingFeed } = useQuery({
    queryKey: ['creator-activity-feed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('creator_activity_feed')
        .select('*')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
  });

  const followCreator = useMutation({
    mutationFn: async (creatorId: string) => {
      if (!profile?.id) throw new Error('Creator profile required');

      const { data, error } = await supabase
        .from('creator_follows')
        .insert({
          follower_id: profile.id,
          following_id: creatorId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Now following creator!');
    },
    onError: (error) => {
      toast.error(`Failed to follow: ${error.message}`);
    },
  });

  return {
    // Forums
    forums: forums || [],
    loadingForums,
    getForumTopics,
    createForumTopic,

    // Challenges
    challenges: challenges || [],
    loadingChallenges,
    submitToChallenge,

    // Collaborations
    myCollaborations: myCollaborations || [],
    loadingCollaborations,
    createCollaboration,

    // Social
    activityFeed: activityFeed || [],
    loadingFeed,
    followCreator,
  };
};
