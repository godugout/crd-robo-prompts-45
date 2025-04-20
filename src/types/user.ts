
export interface User {
  id: string;
  username: string;
  email: string;
  profileImage?: string | null;
  bio?: string | null;
  createdAt: string;
  preferences?: Record<string, any> | null;
  full_name?: string | null;
  avatar_url?: string | null;
  team_id?: string | null;
}
