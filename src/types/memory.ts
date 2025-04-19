
import type { MediaItem } from './media';

export type Visibility = 'public' | 'private' | 'shared';

export interface Memory {
  id: string;
  userId: string;
  title: string;
  description?: string;
  teamId: string;
  gameId?: string;
  location?: {
    latitude: number;
    longitude: number;
  } | null;
  visibility: Visibility;
  createdAt: string;
  tags: string[];
  metadata?: Record<string, any>;
  media?: MediaItem[];
}
