
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import type { Team } from '@/types/team';

export const useTeams = () => {
  const { 
    data: teams = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['teams'],
    queryFn: async (): Promise<Team[]> => {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data || [];
    }
  });

  const getTeamById = (id: string): Team | null => {
    return teams.find(team => team.id === id) || null;
  };

  return {
    teams,
    isLoading,
    error,
    getTeamById
  };
};
