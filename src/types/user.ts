
export interface User {
  id: string;
  username: string;
  email: string;
  profileImage?: string | null;
  bio?: string | null;
  createdAt: string;
  preferences?: Record<string, any> | null;
}
