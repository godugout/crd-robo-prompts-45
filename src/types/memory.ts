
import type { MediaItem } from './media';
import type { Visibility, Location } from './common';
import type { User } from './user';
import type { Reaction } from './social';

export interface Memory {
  id: string;
  userId: string;
  title: string;
  description?: string;
  teamId: string;
  gameId?: string;
  location?: Location | null;
  visibility: Visibility;
  createdAt: string;
  tags: string[];
  metadata?: Record<string, any>;
  media?: MediaItem[];
  // Add missing properties that are used in MemoryCard
  user?: User;
  reactions?: Reaction[];
  comments?: {
    count: number;
  };
}
