
import type { MediaItem } from './media';
import type { Visibility, Location } from './common';
import type { User } from './user';
import type { Reaction, ReactionCount } from './social';

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
  // Include required properties used in components
  user?: User;
  reactions?: ReactionCount[]; // Renamed from reactionCounts to match what's used
  commentCount?: number; // Use this instead of nested comments object
  app_id?: string; // Add this field to match Supabase structure
}
