
import type { User } from './user';

export interface Reaction {
  id: string;
  userId: string;
  memoryId?: string;
  collectionId?: string;
  commentId?: string;
  type: string;
  createdAt: string;
  removed?: boolean;
  user?: Partial<User>; // Add user property
}

export interface ReactionCount {
  type: string;
  count: number;
}

export interface Comment {
  id: string;
  userId: string;
  cardId?: string; // Changed from memoryId to cardId to match existing code
  collectionId?: string;
  teamId?: string;
  parentId?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user?: Partial<User>;
  replies?: Comment[];
  replyCount?: number; // Add replyCount property
  reactions?: Reaction[]; // Add reactions property
}
