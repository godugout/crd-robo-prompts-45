
export interface Team {
  id: string;
  name: string;
  abbreviation: string;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  logoUrl?: string | null;
  stadiumInfo?: Record<string, any> | null;
}
