
import { Visibility } from '@/types/memory';

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
