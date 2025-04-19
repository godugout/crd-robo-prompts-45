
import { useState, useEffect } from 'react';
import type { TeamOption } from '@/components/memory/types';

export const useTeams = () => {
  const [teams, setTeams] = useState<TeamOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockTeams = [
      { id: '1', name: 'Team A' },
      { id: '2', name: 'Team B' },
    ];

    setTimeout(() => {
      setTeams(mockTeams);
      setIsLoading(false);
    }, 1000);
  }, []);

  return { teams, isLoading };
};
