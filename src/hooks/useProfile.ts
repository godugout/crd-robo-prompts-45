
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { toast } from '@/hooks/use-toast';
import type { User } from '@/types/user';

interface ProfileData {
  username?: string;
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
}

interface UserPreferences {
  darkMode?: boolean;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  profileVisibility?: boolean;
  showCardValue?: boolean;
  compactView?: boolean;
}

export const useProfile = (userId?: string) => {
  const queryClient = useQueryClient();
  
  // Get user profile
  const {
    data: profile,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      try {
        // Fetch the profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (error) {
          // If the error is a "not found" error, we'll create a profile
          if (error.code === 'PGRST116') {
            console.log('Profile not found, you might want to create one');
            return null;
          }
          throw error;
        }
        
        // Try to get user preferences
        const { data: prefsData, error: prefsError } = await supabase
          .from('ui_preferences')
          .select('*')
          .eq('user_id', userId)
          .single();
          
        if (prefsError && prefsError.code !== 'PGRST116') {
          console.error('Error fetching preferences:', prefsError);
        }
        
        return {
          ...data,
          preferences: prefsData || {}
        };
      } catch (err) {
        console.error('Error in useProfile hook:', err);
        throw err;
      }
    },
    enabled: !!userId,
    retry: 1
  });

  // Update profile
  const updateProfileMutation = useMutation({
    mutationFn: async ({ profileData, preferences }: { profileData: ProfileData, preferences?: UserPreferences }) => {
      if (!userId) throw new Error('User ID is required');
      
      try {
        // Update the profile
        const { error } = await supabase
          .from('profiles')
          .update({
            username: profileData.username,
            full_name: profileData.fullName,
            bio: profileData.bio,
            avatar_url: profileData.avatarUrl
          })
          .eq('id', userId);
          
        if (error) throw error;
        
        // Update preferences if provided
        if (preferences) {
          const uiPrefs = {
            theme_variant: preferences.darkMode ? 'dark' : 'default',
            reduced_motion: preferences.compactView || false
          };
          
          const { data: existingPrefs } = await supabase
            .from('ui_preferences')
            .select('id')
            .eq('user_id', userId)
            .single();
            
          if (existingPrefs) {
            await supabase
              .from('ui_preferences')
              .update(uiPrefs)
              .eq('id', existingPrefs.id);
          } else {
            await supabase
              .from('ui_preferences')
              .insert({
                user_id: userId,
                ...uiPrefs
              });
          }
        }
        
        return true;
      } catch (err) {
        console.error('Error updating profile:', err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to update profile: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  return {
    profile,
    isLoading,
    error,
    refetch,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending
  };
};
