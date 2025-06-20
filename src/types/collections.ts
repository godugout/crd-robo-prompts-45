
export interface Collection {
  id: string;
  title: string;
  description?: string;
  owner_id: string;
  visibility: 'private' | 'public' | 'shared';
  cover_image_url?: string;
  created_at: string;
  updated_at: string;
  views_count: number;
  likes_count: number;
  shares_count: number;
  completion_rate: number;
  is_template: boolean;
  template_category?: string;
  tags: string[];
  featured_until?: string;
  last_activity_at: string;
  design_metadata: Record<string, any>;
  allow_comments: boolean;
  team_id?: string;
  app_id?: string;
}

export interface CollectionCard {
  id: string;
  collection_id: string;
  card_id: string;
  created_at: string;
  quantity: number;
  added_by?: string;
  notes?: string;
  display_order: number;
}

export interface CollectionFollower {
  id: string;
  collection_id: string;
  follower_id: string;
  followed_at: string;
  notifications_enabled: boolean;
}

export interface CollectionActivity {
  id: string;
  collection_id: string;
  user_id: string;
  activity_type: 'card_added' | 'card_removed' | 'shared' | 'updated' | 'created' | 'renamed';
  activity_data: Record<string, any>;
  created_at: string;
}

export interface CollectionComment {
  id: string;
  collection_id: string;
  user_id: string;
  parent_id?: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  replies?: CollectionComment[];
}

export interface CollectionRating {
  id: string;
  collection_id: string;
  user_id: string;
  rating: number;
  review?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export interface CollectionPermission {
  id: string;
  collection_id: string;
  user_id: string;
  permission_type: 'view' | 'comment' | 'collaborate' | 'admin';
  granted_by: string;
  granted_at: string;
  expires_at?: string;
}

export interface CollectionTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  template_data: Record<string, any>;
  preview_image_url?: string;
  created_by?: string;
  is_official: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface CollectionAnalytics {
  total_cards: number;
  unique_rarities: number;
  completion_rate: number;
  total_views: number;
  total_likes: number;
  total_followers: number;
  recent_activity: number;
}

export interface CollectionFilters {
  search?: string;
  category?: string;
  visibility?: 'private' | 'public' | 'shared';
  tags?: string[];
  sortBy?: 'created_at' | 'updated_at' | 'title' | 'views_count' | 'likes_count';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}
