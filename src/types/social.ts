
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
}

export interface ReactionCount {
  type: string;
  count: number;
}

export interface Comment {
  id: string;
  userId: string;
  cardId?: string;
  collectionId?: string;
  teamId?: string;
  parentId?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user?: Partial<User>;
  replies?: Comment[];
}
