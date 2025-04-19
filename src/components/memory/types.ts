import { Visibility } from '@/types/common';

export interface MemoryCreatorProps {
  onCreated?: (memoryId: string) => void;
  defaultTeamId?: string;
  defaultGameId?: string;
  defaultVisibility?: Visibility;
}

export interface TeamOption {
  id: string;
  name: string;
}
