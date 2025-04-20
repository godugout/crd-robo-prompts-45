
import type { User } from './user';

export interface Reaction {
  id: string;
  userId: string;
  type: 'thumbs-up' | 'heart' | 'party' | 'baseball';
  memoryId?: string;
  collectionId?: string;
  commentId?: string;
  createdAt: string;
  user: User;
}

export interface ReactionCounts {
  type: string;
  count: number;
}

export interface ReactionResponse {
  reactions: Reaction[];
  counts: ReactionCounts[];
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  memoryId?: string;
  collectionId?: string;
  parentCommentId?: string;
  createdAt: string;
  user: User;
  reactions: Reaction[];
  replyCount: number;
}

export interface CommentResponse {
  comments: Comment[];
  total: number;
  hasMore: boolean;
}

