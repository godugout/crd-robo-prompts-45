
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      media: {
        Row: {
          id: string
          memoryId: string
          type: 'image' | 'video' | 'audio'
          url: string
          thumbnailUrl: string | null
          originalFilename: string | null
          size: number | null
          mimeType: string | null
          width: number | null
          height: number | null
          duration: number | null
          metadata: Json | null
          createdAt: string
        }
        Insert: {
          id?: string
          memoryId: string
          type: 'image' | 'video' | 'audio'
          url: string
          thumbnailUrl?: string | null
          originalFilename?: string | null
          size?: number | null
          mimeType?: string | null
          width?: number | null
          height?: number | null
          duration?: number | null
          metadata?: Json | null
          createdAt?: string
        }
        Update: {
          id?: string
          memoryId?: string
          type?: 'image' | 'video' | 'audio'
          url?: string
          thumbnailUrl?: string | null
          originalFilename?: string | null
          size?: number | null
          mimeType?: string | null
          width?: number | null
          height?: number | null
          duration?: number | null
          metadata?: Json | null
          createdAt?: string
        }
      }
      // Add other tables as needed
    }
  }
}
