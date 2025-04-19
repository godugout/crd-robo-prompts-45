
import type { MediaItem } from './media';
import type { Visibility, Location } from './common';

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
}
