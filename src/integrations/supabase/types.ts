export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      albums: {
        Row: {
          artist_id: string
          cover_url: string | null
          created_at: string
          id: string
          release_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          artist_id: string
          cover_url?: string | null
          created_at?: string
          id?: string
          release_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          artist_id?: string
          cover_url?: string | null
          created_at?: string
          id?: string
          release_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "albums_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      app_registry: {
        Row: {
          app_key: string
          app_name: string
          app_version: string
          created_at: string
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          app_key: string
          app_name: string
          app_version: string
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          app_key?: string
          app_name?: string
          app_version?: string
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          app_id: string
          created_at: string
          id: string
          settings: Json
          updated_at: string
        }
        Insert: {
          app_id: string
          created_at?: string
          id?: string
          settings?: Json
          updated_at?: string
        }
        Update: {
          app_id?: string
          created_at?: string
          id?: string
          settings?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_settings_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "app_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      artists: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          image_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      asset_usages: {
        Row: {
          asset_id: string
          created_at: string
          id: string
          reference_id: string
          usage_type: string
        }
        Insert: {
          asset_id: string
          created_at?: string
          id?: string
          reference_id: string
          usage_type: string
        }
        Update: {
          asset_id?: string
          created_at?: string
          id?: string
          reference_id?: string
          usage_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_usages_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "digital_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      bbs_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          is_edited: boolean
          thread_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          is_edited?: boolean
          thread_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          is_edited?: boolean
          thread_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bbs_posts_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "bbs_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      bbs_threads: {
        Row: {
          category: string
          created_at: string
          created_by: string
          id: string
          is_locked: boolean
          is_pinned: boolean
          last_active_at: string
          status: string
          title: string
          view_count: number
        }
        Insert: {
          category: string
          created_at?: string
          created_by: string
          id?: string
          is_locked?: boolean
          is_pinned?: boolean
          last_active_at?: string
          status: string
          title: string
          view_count?: number
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string
          id?: string
          is_locked?: boolean
          is_pinned?: boolean
          last_active_at?: string
          status?: string
          title?: string
          view_count?: number
        }
        Relationships: []
      }
      cards: {
        Row: {
          collection_id: string | null
          crd_catalog_inclusion: boolean | null
          created_at: string
          creator_attribution: Json | null
          creator_id: string
          description: string | null
          design_metadata: Json | null
          edition_size: number
          id: string
          image_url: string | null
          is_public: boolean | null
          marketplace_listing: boolean | null
          price: number | null
          print_available: boolean | null
          print_metadata: Json | null
          publishing_options: Json | null
          rarity: string
          shop_id: string | null
          tags: string[] | null
          team_id: string | null
          template_id: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          user_id: string | null
          verification_status: string | null
        }
        Insert: {
          collection_id?: string | null
          crd_catalog_inclusion?: boolean | null
          created_at?: string
          creator_attribution?: Json | null
          creator_id: string
          description?: string | null
          design_metadata?: Json | null
          edition_size?: number
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          marketplace_listing?: boolean | null
          price?: number | null
          print_available?: boolean | null
          print_metadata?: Json | null
          publishing_options?: Json | null
          rarity: string
          shop_id?: string | null
          tags?: string[] | null
          team_id?: string | null
          template_id?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
          verification_status?: string | null
        }
        Update: {
          collection_id?: string | null
          crd_catalog_inclusion?: boolean | null
          created_at?: string
          creator_attribution?: Json | null
          creator_id?: string
          description?: string | null
          design_metadata?: Json | null
          edition_size?: number
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          marketplace_listing?: boolean | null
          price?: number | null
          print_available?: boolean | null
          print_metadata?: Json | null
          publishing_options?: Json | null
          rarity?: string
          shop_id?: string | null
          tags?: string[] | null
          team_id?: string | null
          template_id?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cards_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cards_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cards_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_cards: {
        Row: {
          card_id: string
          collection_id: string
          created_at: string
          id: string
        }
        Insert: {
          card_id: string
          collection_id: string
          created_at?: string
          id?: string
        }
        Update: {
          card_id?: string
          collection_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_cards_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_cards_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          allow_comments: boolean | null
          app_id: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          design_metadata: Json | null
          id: string
          owner_id: string
          team_id: string | null
          title: string
          updated_at: string
          visibility: string | null
        }
        Insert: {
          allow_comments?: boolean | null
          app_id?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          design_metadata?: Json | null
          id?: string
          owner_id: string
          team_id?: string | null
          title: string
          updated_at?: string
          visibility?: string | null
        }
        Update: {
          allow_comments?: boolean | null
          app_id?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          design_metadata?: Json | null
          id?: string
          owner_id?: string
          team_id?: string | null
          title?: string
          updated_at?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collections_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "app_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collections_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          card_id: string | null
          collection_id: string | null
          content: string
          created_at: string
          id: string
          parent_id: string | null
          team_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          card_id?: string | null
          collection_id?: string | null
          content: string
          created_at?: string
          id?: string
          parent_id?: string | null
          team_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          card_id?: string | null
          collection_id?: string | null
          content?: string
          created_at?: string
          id?: string
          parent_id?: string | null
          team_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      content_resources: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          organization_id: string | null
          resource_type: string
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          organization_id?: string | null
          resource_type: string
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          organization_id?: string | null
          resource_type?: string
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_resources_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "parent_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      crd_ai_generations: {
        Row: {
          card_id: string | null
          cost: number | null
          created_at: string
          generation_type: string
          id: string
          prompt: string
          provider: string | null
          result: Json | null
          user_id: string
        }
        Insert: {
          card_id?: string | null
          cost?: number | null
          created_at?: string
          generation_type: string
          id?: string
          prompt: string
          provider?: string | null
          result?: Json | null
          user_id: string
        }
        Update: {
          card_id?: string | null
          cost?: number | null
          created_at?: string
          generation_type?: string
          id?: string
          prompt?: string
          provider?: string | null
          result?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crd_ai_generations_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "crd_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      crd_cards: {
        Row: {
          collection_id: string | null
          crd_catalog_inclusion: boolean | null
          created_at: string
          creator_attribution: Json | null
          creator_id: string
          description: string | null
          design_metadata: Json | null
          edition_size: number
          id: string
          image_url: string | null
          is_public: boolean | null
          marketplace_listing: boolean | null
          price: number | null
          print_available: boolean | null
          print_metadata: Json | null
          publishing_options: Json | null
          rarity: string
          tags: string[] | null
          team_id: string | null
          template_id: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          user_id: string | null
          verification_status: string | null
        }
        Insert: {
          collection_id?: string | null
          crd_catalog_inclusion?: boolean | null
          created_at?: string
          creator_attribution?: Json | null
          creator_id: string
          description?: string | null
          design_metadata?: Json | null
          edition_size?: number
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          marketplace_listing?: boolean | null
          price?: number | null
          print_available?: boolean | null
          print_metadata?: Json | null
          publishing_options?: Json | null
          rarity: string
          tags?: string[] | null
          team_id?: string | null
          template_id?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
          verification_status?: string | null
        }
        Update: {
          collection_id?: string | null
          crd_catalog_inclusion?: boolean | null
          created_at?: string
          creator_attribution?: Json | null
          creator_id?: string
          description?: string | null
          design_metadata?: Json | null
          edition_size?: number
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          marketplace_listing?: boolean | null
          price?: number | null
          print_available?: boolean | null
          print_metadata?: Json | null
          publishing_options?: Json | null
          rarity?: string
          tags?: string[] | null
          team_id?: string | null
          template_id?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crd_cards_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "crd_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crd_cards_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "crd_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crd_cards_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "crd_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      crd_collection_cards: {
        Row: {
          card_id: string
          collection_id: string
          created_at: string
          id: string
        }
        Insert: {
          card_id: string
          collection_id: string
          created_at?: string
          id?: string
        }
        Update: {
          card_id?: string
          collection_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crd_collection_cards_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "crd_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crd_collection_cards_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "crd_collections"
            referencedColumns: ["id"]
          },
        ]
      }
      crd_collections: {
        Row: {
          allow_comments: boolean | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          design_metadata: Json | null
          id: string
          owner_id: string
          team_id: string | null
          title: string
          updated_at: string
          visibility: string | null
        }
        Insert: {
          allow_comments?: boolean | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          design_metadata?: Json | null
          id?: string
          owner_id: string
          team_id?: string | null
          title: string
          updated_at?: string
          visibility?: string | null
        }
        Update: {
          allow_comments?: boolean | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          design_metadata?: Json | null
          id?: string
          owner_id?: string
          team_id?: string | null
          title?: string
          updated_at?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crd_collections_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "crd_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      crd_comments: {
        Row: {
          card_id: string | null
          collection_id: string | null
          content: string
          created_at: string
          id: string
          parent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          card_id?: string | null
          collection_id?: string | null
          content: string
          created_at?: string
          id?: string
          parent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          card_id?: string | null
          collection_id?: string | null
          content?: string
          created_at?: string
          id?: string
          parent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crd_comments_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "crd_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crd_comments_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "crd_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crd_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "crd_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      crd_digital_assets: {
        Row: {
          created_at: string
          description: string | null
          file_size: number
          height: number | null
          id: string
          metadata: Json | null
          mime_type: string
          original_filename: string
          storage_path: string
          tags: string[] | null
          thumbnail_path: string | null
          title: string | null
          updated_at: string
          user_id: string
          width: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_size: number
          height?: number | null
          id?: string
          metadata?: Json | null
          mime_type: string
          original_filename: string
          storage_path: string
          tags?: string[] | null
          thumbnail_path?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
          width?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          file_size?: number
          height?: number | null
          id?: string
          metadata?: Json | null
          mime_type?: string
          original_filename?: string
          storage_path?: string
          tags?: string[] | null
          thumbnail_path?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
          width?: number | null
        }
        Relationships: []
      }
      crd_marketplace_listings: {
        Row: {
          card_id: string
          created_at: string
          currency: string | null
          id: string
          price: number
          seller_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          card_id: string
          created_at?: string
          currency?: string | null
          id?: string
          price: number
          seller_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          card_id?: string
          created_at?: string
          currency?: string | null
          id?: string
          price?: number
          seller_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crd_marketplace_listings_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "crd_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      crd_owned_cards: {
        Row: {
          card_id: string
          created_at: string
          edition_number: number
          id: string
          owner_id: string
        }
        Insert: {
          card_id: string
          created_at?: string
          edition_number: number
          id?: string
          owner_id: string
        }
        Update: {
          card_id?: string
          created_at?: string
          edition_number?: number
          id?: string
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crd_owned_cards_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "crd_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      crd_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          bio_extended: string | null
          created_at: string
          creator_badge: string | null
          creator_verified: boolean | null
          display_name: string | null
          id: string
          is_public: boolean | null
          portfolio_links: Json | null
          specialties: string[] | null
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          bio_extended?: string | null
          created_at?: string
          creator_badge?: string | null
          creator_verified?: boolean | null
          display_name?: string | null
          id: string
          is_public?: boolean | null
          portfolio_links?: Json | null
          specialties?: string[] | null
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          bio_extended?: string | null
          created_at?: string
          creator_badge?: string | null
          creator_verified?: boolean | null
          display_name?: string | null
          id?: string
          is_public?: boolean | null
          portfolio_links?: Json | null
          specialties?: string[] | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      crd_reactions: {
        Row: {
          card_id: string | null
          collection_id: string | null
          comment_id: string | null
          created_at: string
          id: string
          type: string
          user_id: string
        }
        Insert: {
          card_id?: string | null
          collection_id?: string | null
          comment_id?: string | null
          created_at?: string
          id?: string
          type: string
          user_id: string
        }
        Update: {
          card_id?: string | null
          collection_id?: string | null
          comment_id?: string | null
          created_at?: string
          id?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crd_reactions_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "crd_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crd_reactions_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "crd_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crd_reactions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "crd_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      crd_team_members: {
        Row: {
          id: string
          joined_at: string
          role: string
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role?: string
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crd_team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "crd_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      crd_teams: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      crd_templates: {
        Row: {
          category: string
          created_at: string
          id: string
          layout_json: Json
          name: string
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          layout_json?: Json
          name: string
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          layout_json?: Json
          name?: string
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      crd_trades: {
        Row: {
          created_at: string
          id: string
          initiator_cards: string[] | null
          initiator_id: string
          recipient_cards: string[] | null
          recipient_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          initiator_cards?: string[] | null
          initiator_id: string
          recipient_cards?: string[] | null
          recipient_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          initiator_cards?: string[] | null
          initiator_id?: string
          recipient_cards?: string[] | null
          recipient_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      custom_users: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          passcode: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          passcode: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          passcode?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      design_elements: {
        Row: {
          category: string
          content: Json
          created_at: string
          created_by: string
          description: string | null
          id: string
          metadata: Json | null
          moderation_status: string
          name: string
          performance: Json | null
          premium: boolean | null
          price: number | null
          updated_at: string
          usage_stats: Json
          version: string | null
          visibility: string
        }
        Insert: {
          category: string
          content: Json
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          metadata?: Json | null
          moderation_status?: string
          name: string
          performance?: Json | null
          premium?: boolean | null
          price?: number | null
          updated_at?: string
          usage_stats?: Json
          version?: string | null
          visibility?: string
        }
        Update: {
          category?: string
          content?: Json
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          moderation_status?: string
          name?: string
          performance?: Json | null
          premium?: boolean | null
          price?: number | null
          updated_at?: string
          usage_stats?: Json
          version?: string | null
          visibility?: string
        }
        Relationships: []
      }
      design_frames: {
        Row: {
          category: string
          constraints: Json
          created_at: string
          created_by: string
          description: string | null
          design: Json
          id: string
          inheritance: Json | null
          moderation_note: string | null
          moderation_status: string
          name: string
          performance: Json | null
          permissions: Json
          stats: Json
          tags: string[] | null
          updated_at: string
          version: Json | null
          visibility: string
        }
        Insert: {
          category: string
          constraints: Json
          created_at?: string
          created_by: string
          description?: string | null
          design?: Json
          id?: string
          inheritance?: Json | null
          moderation_note?: string | null
          moderation_status?: string
          name: string
          performance?: Json | null
          permissions?: Json
          stats?: Json
          tags?: string[] | null
          updated_at?: string
          version?: Json | null
          visibility?: string
        }
        Update: {
          category?: string
          constraints?: Json
          created_at?: string
          created_by?: string
          description?: string | null
          design?: Json
          id?: string
          inheritance?: Json | null
          moderation_note?: string | null
          moderation_status?: string
          name?: string
          performance?: Json | null
          permissions?: Json
          stats?: Json
          tags?: string[] | null
          updated_at?: string
          version?: Json | null
          visibility?: string
        }
        Relationships: []
      }
      design_templates: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_premium: boolean | null
          name: string
          preview_url: string | null
          tags: string[] | null
          template_data: Json
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_premium?: boolean | null
          name: string
          preview_url?: string | null
          tags?: string[] | null
          template_data?: Json
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_premium?: boolean | null
          name?: string
          preview_url?: string | null
          tags?: string[] | null
          template_data?: Json
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      digital_assets: {
        Row: {
          created_at: string
          description: string | null
          file_size: number
          height: number | null
          id: string
          metadata: Json | null
          mime_type: string
          original_filename: string
          storage_path: string
          tags: string[] | null
          thumbnail_path: string | null
          title: string | null
          updated_at: string
          user_id: string
          width: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_size: number
          height?: number | null
          id?: string
          metadata?: Json | null
          mime_type: string
          original_filename: string
          storage_path: string
          tags?: string[] | null
          thumbnail_path?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
          width?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          file_size?: number
          height?: number | null
          id?: string
          metadata?: Json | null
          mime_type?: string
          original_filename?: string
          storage_path?: string
          tags?: string[] | null
          thumbnail_path?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
          width?: number | null
        }
        Relationships: []
      }
      element_usage: {
        Row: {
          card_id: string | null
          context: string | null
          created_at: string
          element_id: string
          id: string
          user_id: string
        }
        Insert: {
          card_id?: string | null
          context?: string | null
          created_at?: string
          element_id: string
          id?: string
          user_id: string
        }
        Update: {
          card_id?: string | null
          context?: string | null
          created_at?: string
          element_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "element_usage_element_id_fkey"
            columns: ["element_id"]
            isOneToOne: false
            referencedRelation: "design_elements"
            referencedColumns: ["id"]
          },
        ]
      }
      fan_feeds: {
        Row: {
          cover_image_url: string | null
          created_at: string
          creator_id: string
          custom_theme: Json | null
          id: string
          subtitle: string | null
          theme: Database["public"]["Enums"]["feed_theme"]
          title: string
          updated_at: string
          visibility: Database["public"]["Enums"]["visibility_type"] | null
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          creator_id: string
          custom_theme?: Json | null
          id?: string
          subtitle?: string | null
          theme: Database["public"]["Enums"]["feed_theme"]
          title: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          creator_id?: string
          custom_theme?: Json | null
          id?: string
          subtitle?: string | null
          theme?: Database["public"]["Enums"]["feed_theme"]
          title?: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Relationships: []
      }
      feed_posts: {
        Row: {
          content: string | null
          created_at: string
          creator_id: string
          feed_id: string
          id: string
          media_type: string | null
          media_url: string | null
          mini_game_id: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          creator_id: string
          feed_id: string
          id?: string
          media_type?: string | null
          media_url?: string | null
          mini_game_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          creator_id?: string
          feed_id?: string
          id?: string
          media_type?: string | null
          media_url?: string | null
          mini_game_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_posts_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "fan_feeds"
            referencedColumns: ["id"]
          },
        ]
      }
      frame_ratings: {
        Row: {
          comment: string | null
          created_at: string
          frame_id: string
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          frame_id: string
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          frame_id?: string
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "frame_ratings_frame_id_fkey"
            columns: ["frame_id"]
            isOneToOne: false
            referencedRelation: "design_frames"
            referencedColumns: ["id"]
          },
        ]
      }
      lyric_annotations: {
        Row: {
          ai_analysis: string | null
          created_at: string
          cultural_references: Json | null
          end_time: number | null
          id: string
          line_number: number
          song_id: string
          start_time: number | null
          symbolism: string[] | null
          text: string
          themes: string[] | null
          updated_at: string
        }
        Insert: {
          ai_analysis?: string | null
          created_at?: string
          cultural_references?: Json | null
          end_time?: number | null
          id?: string
          line_number: number
          song_id: string
          start_time?: number | null
          symbolism?: string[] | null
          text: string
          themes?: string[] | null
          updated_at?: string
        }
        Update: {
          ai_analysis?: string | null
          created_at?: string
          cultural_references?: Json | null
          end_time?: number | null
          id?: string
          line_number?: number
          song_id?: string
          start_time?: number | null
          symbolism?: string[] | null
          text?: string
          themes?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lyric_annotations_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          created_at: string
          deleted_at: string | null
          description: string | null
          file_size: number
          height: number | null
          id: string
          metadata: Json | null
          mime_type: string
          original_url: string
          processed_url: string | null
          status: string
          thumbnail_url: string | null
          title: string
          updated_at: string
          user_id: string
          width: number | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          file_size: number
          height?: number | null
          id?: string
          metadata?: Json | null
          mime_type: string
          original_url: string
          processed_url?: string | null
          status?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          user_id: string
          width?: number | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          file_size?: number
          height?: number | null
          id?: string
          metadata?: Json | null
          mime_type?: string
          original_url?: string
          processed_url?: string | null
          status?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          width?: number | null
        }
        Relationships: []
      }
      media_processing: {
        Row: {
          asset_id: string
          created_at: string
          error: string | null
          id: string
          operation: string
          params: Json | null
          result: Json | null
          status: string
          updated_at: string
        }
        Insert: {
          asset_id: string
          created_at?: string
          error?: string | null
          id?: string
          operation: string
          params?: Json | null
          result?: Json | null
          status?: string
          updated_at?: string
        }
        Update: {
          asset_id?: string
          created_at?: string
          error?: string | null
          id?: string
          operation?: string
          params?: Json | null
          result?: Json | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_processing_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      media_sync_queue: {
        Row: {
          asset_id: string | null
          created_at: string
          id: string
          operation: string
          params: Json
          retry_count: number | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          asset_id?: string | null
          created_at?: string
          id?: string
          operation: string
          params: Json
          retry_count?: number | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          asset_id?: string | null
          created_at?: string
          id?: string
          operation?: string
          params?: Json
          retry_count?: number | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      media_tags: {
        Row: {
          asset_id: string
          created_at: string
          tag: string
        }
        Insert: {
          asset_id: string
          created_at?: string
          tag: string
        }
        Update: {
          asset_id?: string
          created_at?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_tags_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      memories: {
        Row: {
          app_id: string | null
          created_at: string
          description: string | null
          game_id: string | null
          id: string
          location: Json | null
          metadata: Json | null
          tags: string[] | null
          team_id: string | null
          title: string
          updated_at: string
          user_id: string
          visibility: string
        }
        Insert: {
          app_id?: string | null
          created_at?: string
          description?: string | null
          game_id?: string | null
          id?: string
          location?: Json | null
          metadata?: Json | null
          tags?: string[] | null
          team_id?: string | null
          title: string
          updated_at?: string
          user_id: string
          visibility?: string
        }
        Update: {
          app_id?: string | null
          created_at?: string
          description?: string | null
          game_id?: string | null
          id?: string
          location?: Json | null
          metadata?: Json | null
          tags?: string[] | null
          team_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "memories_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "app_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memories_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      mini_games: {
        Row: {
          config: Json | null
          created_at: string
          description: string | null
          game_type: string
          id: string
          theme: Database["public"]["Enums"]["feed_theme"]
          title: string
          updated_at: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          description?: string | null
          game_type: string
          id?: string
          theme: Database["public"]["Enums"]["feed_theme"]
          title: string
          updated_at?: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          description?: string | null
          game_type?: string
          id?: string
          theme?: Database["public"]["Enums"]["feed_theme"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      mixtapes: {
        Row: {
          created_at: string
          creator_id: string
          description: string | null
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          description?: string | null
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string | null
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      owned_cards: {
        Row: {
          card_id: string
          created_at: string
          edition_number: number
          id: string
          owner_id: string
        }
        Insert: {
          card_id: string
          created_at?: string
          edition_number: number
          id?: string
          owner_id: string
        }
        Update: {
          card_id?: string
          created_at?: string
          edition_number?: number
          id?: string
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "owned_cards_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_organizations: {
        Row: {
          contact_email: string | null
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      poem_styles: {
        Row: {
          animation_config: Json | null
          created_at: string
          id: number
          name: string
        }
        Insert: {
          animation_config?: Json | null
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          animation_config?: Json | null
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      poems: {
        Row: {
          audio_url: string | null
          author: string
          content: string
          created_at: string
          formatting: Json | null
          id: string
          image_url: string | null
          layout_type: string | null
          likes_count: number | null
          media_config: Json | null
          style: Json | null
          style_config: Json | null
          title: string
          updated_at: string
          visibility: string | null
        }
        Insert: {
          audio_url?: string | null
          author: string
          content: string
          created_at?: string
          formatting?: Json | null
          id?: string
          image_url?: string | null
          layout_type?: string | null
          likes_count?: number | null
          media_config?: Json | null
          style?: Json | null
          style_config?: Json | null
          title: string
          updated_at?: string
          visibility?: string | null
        }
        Update: {
          audio_url?: string | null
          author?: string
          content?: string
          created_at?: string
          formatting?: Json | null
          id?: string
          image_url?: string | null
          layout_type?: string | null
          likes_count?: number | null
          media_config?: Json | null
          style?: Json | null
          style_config?: Json | null
          title?: string
          updated_at?: string
          visibility?: string | null
        }
        Relationships: []
      }
      post_tags: {
        Row: {
          created_at: string
          post_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          post_id: string
          tag_id: string
        }
        Update: {
          created_at?: string
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          shop_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          shop_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          shop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio_extended: string | null
          created_at: string
          creator_badge: string | null
          creator_verified: boolean | null
          full_name: string | null
          id: string
          portfolio_links: Json | null
          specialties: string[] | null
          team_id: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio_extended?: string | null
          created_at?: string
          creator_badge?: string | null
          creator_verified?: boolean | null
          full_name?: string | null
          id: string
          portfolio_links?: Json | null
          specialties?: string[] | null
          team_id?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio_extended?: string | null
          created_at?: string
          creator_badge?: string | null
          creator_verified?: boolean | null
          full_name?: string | null
          id?: string
          portfolio_links?: Json | null
          specialties?: string[] | null
          team_id?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      reactions: {
        Row: {
          card_id: string | null
          collection_id: string | null
          comment_id: string | null
          created_at: string
          id: string
          type: string
          user_id: string
        }
        Insert: {
          card_id?: string | null
          collection_id?: string | null
          comment_id?: string | null
          created_at?: string
          id?: string
          type: string
          user_id: string
        }
        Update: {
          card_id?: string | null
          collection_id?: string | null
          comment_id?: string | null
          created_at?: string
          id?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reactions_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_teams: {
        Row: {
          id: string
          invited_by: string | null
          joined_at: string
          permissions: Json | null
          role: string
          shop_id: string
          user_id: string
        }
        Insert: {
          id?: string
          invited_by?: string | null
          joined_at?: string
          permissions?: Json | null
          role?: string
          shop_id: string
          user_id: string
        }
        Update: {
          id?: string
          invited_by?: string | null
          joined_at?: string
          permissions?: Json | null
          role?: string
          shop_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_teams_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shops: {
        Row: {
          banner_url: string | null
          branding: Json | null
          contact_info: Json | null
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          owner_id: string
          shop_status: string
          social_links: Json | null
          specialties: string[] | null
          updated_at: string
          verification_status: string
        }
        Insert: {
          banner_url?: string | null
          branding?: Json | null
          contact_info?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          owner_id: string
          shop_status?: string
          social_links?: Json | null
          specialties?: string[] | null
          updated_at?: string
          verification_status?: string
        }
        Update: {
          banner_url?: string | null
          branding?: Json | null
          contact_info?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string
          shop_status?: string
          social_links?: Json | null
          specialties?: string[] | null
          updated_at?: string
          verification_status?: string
        }
        Relationships: []
      }
      song_analyses: {
        Row: {
          created_at: string
          cultural_impact: string | null
          id: string
          literary_devices: string[] | null
          production_notes: string | null
          song_id: string
          themes: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          cultural_impact?: string | null
          id?: string
          literary_devices?: string[] | null
          production_notes?: string | null
          song_id: string
          themes?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          cultural_impact?: string | null
          id?: string
          literary_devices?: string[] | null
          production_notes?: string | null
          song_id?: string
          themes?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "song_analyses_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
        ]
      }
      song_contributors: {
        Row: {
          created_at: string
          id: string
          name: string
          role: string
          song_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          role: string
          song_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          role?: string
          song_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "song_contributors_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
        ]
      }
      songs: {
        Row: {
          album_id: string
          created_at: string
          credits: Json | null
          duration: number | null
          genre: string | null
          id: string
          language: string | null
          lyrics: string | null
          producers: string[] | null
          synced_lyrics: Json | null
          title: string
          track_number: number | null
          updated_at: string
        }
        Insert: {
          album_id: string
          created_at?: string
          credits?: Json | null
          duration?: number | null
          genre?: string | null
          id?: string
          language?: string | null
          lyrics?: string | null
          producers?: string[] | null
          synced_lyrics?: Json | null
          title: string
          track_number?: number | null
          updated_at?: string
        }
        Update: {
          album_id?: string
          created_at?: string
          credits?: Json | null
          duration?: number | null
          genre?: string | null
          id?: string
          language?: string | null
          lyrics?: string | null
          producers?: string[] | null
          synced_lyrics?: Json | null
          title?: string
          track_number?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "songs_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
        ]
      }
      story_artifacts: {
        Row: {
          created_at: string
          description: string | null
          discovered: boolean | null
          id: string
          image_url: string | null
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          discovered?: boolean | null
          id?: string
          image_url?: string | null
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          discovered?: boolean | null
          id?: string
          image_url?: string | null
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      story_characters: {
        Row: {
          background: string | null
          created_at: string
          id: string
          image_url: string | null
          name: string
          role: string
          updated_at: string
        }
        Insert: {
          background?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          role: string
          updated_at?: string
        }
        Update: {
          background?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      story_choices: {
        Row: {
          choice_text: string
          created_at: string
          effects: Json | null
          id: string
          requirements: Json | null
          source_node_id: string
          target_node_id: string
          updated_at: string
        }
        Insert: {
          choice_text: string
          created_at?: string
          effects?: Json | null
          id?: string
          requirements?: Json | null
          source_node_id: string
          target_node_id: string
          updated_at?: string
        }
        Update: {
          choice_text?: string
          created_at?: string
          effects?: Json | null
          id?: string
          requirements?: Json | null
          source_node_id?: string
          target_node_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_choices_source_node_id_fkey"
            columns: ["source_node_id"]
            isOneToOne: false
            referencedRelation: "story_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_choices_target_node_id_fkey"
            columns: ["target_node_id"]
            isOneToOne: false
            referencedRelation: "story_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      story_locations: {
        Row: {
          coordinates: Json | null
          created_at: string
          id: string
          image_url: string | null
          name: string
          significance: string | null
          updated_at: string
        }
        Insert: {
          coordinates?: Json | null
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          significance?: string | null
          updated_at?: string
        }
        Update: {
          coordinates?: Json | null
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          significance?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      story_node_discoveries: {
        Row: {
          discovered_at: string
          id: string
          node_id: string
          triggered_content: Json | null
          user_id: string
        }
        Insert: {
          discovered_at?: string
          id?: string
          node_id: string
          triggered_content?: Json | null
          user_id: string
        }
        Update: {
          discovered_at?: string
          id?: string
          node_id?: string
          triggered_content?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_node_discoveries_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "story_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      story_nodes: {
        Row: {
          content: string
          created_at: string
          custom_styles: Json | null
          discovery_triggers: Json | null
          effects: Json | null
          id: string
          metadata: Json | null
          node_template: string | null
          node_type: string
          required_items: string[] | null
          title: string
          updated_at: string
          visibility_conditions: Json | null
        }
        Insert: {
          content: string
          created_at?: string
          custom_styles?: Json | null
          discovery_triggers?: Json | null
          effects?: Json | null
          id?: string
          metadata?: Json | null
          node_template?: string | null
          node_type: string
          required_items?: string[] | null
          title: string
          updated_at?: string
          visibility_conditions?: Json | null
        }
        Update: {
          content?: string
          created_at?: string
          custom_styles?: Json | null
          discovery_triggers?: Json | null
          effects?: Json | null
          id?: string
          metadata?: Json | null
          node_template?: string | null
          node_type?: string
          required_items?: string[] | null
          title?: string
          updated_at?: string
          visibility_conditions?: Json | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          category: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          joined_at: string
          role: string
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role: string
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          description: string | null
          division: string | null
          founded_year: number | null
          id: string
          is_active: boolean | null
          league: string | null
          logo_url: string | null
          mascot: string | null
          name: string
          owner_id: string
          primary_color: string | null
          secondary_color: string | null
          stadium: string | null
          state: string | null
          team_code: string | null
          tertiary_color: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          division?: string | null
          founded_year?: number | null
          id?: string
          is_active?: boolean | null
          league?: string | null
          logo_url?: string | null
          mascot?: string | null
          name: string
          owner_id: string
          primary_color?: string | null
          secondary_color?: string | null
          stadium?: string | null
          state?: string | null
          team_code?: string | null
          tertiary_color?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          division?: string | null
          founded_year?: number | null
          id?: string
          is_active?: boolean | null
          league?: string | null
          logo_url?: string | null
          mascot?: string | null
          name?: string
          owner_id?: string
          primary_color?: string | null
          secondary_color?: string | null
          stadium?: string | null
          state?: string | null
          team_code?: string | null
          tertiary_color?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      templates: {
        Row: {
          category: string
          created_at: string
          id: string
          layout_json: Json
          name: string
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          layout_json?: Json
          name: string
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          layout_json?: Json
          name?: string
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      time_capsules: {
        Row: {
          created_at: string
          creator_id: string
          description: string | null
          event_date: string
          feed_id: string
          id: string
          title: string
          updated_at: string
          visibility: Database["public"]["Enums"]["visibility_type"] | null
        }
        Insert: {
          created_at?: string
          creator_id: string
          description?: string | null
          event_date: string
          feed_id: string
          id?: string
          title: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string | null
          event_date?: string
          feed_id?: string
          id?: string
          title?: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "time_capsules_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "fan_feeds"
            referencedColumns: ["id"]
          },
        ]
      }
      tracks: {
        Row: {
          artist: string
          audio_url: string | null
          created_at: string
          id: string
          mixtape_id: string
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          artist: string
          audio_url?: string | null
          created_at?: string
          id?: string
          mixtape_id: string
          order_index: number
          title: string
          updated_at?: string
        }
        Update: {
          artist?: string
          audio_url?: string | null
          created_at?: string
          id?: string
          mixtape_id?: string
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracks_mixtape_id_fkey"
            columns: ["mixtape_id"]
            isOneToOne: false
            referencedRelation: "mixtapes"
            referencedColumns: ["id"]
          },
        ]
      }
      ui_preferences: {
        Row: {
          blog_style: string | null
          created_at: string
          font_size: number | null
          high_contrast: boolean | null
          id: string
          language_theme: string | null
          reduced_motion: boolean | null
          theme_variant: string | null
          ui_mode: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          blog_style?: string | null
          created_at?: string
          font_size?: number | null
          high_contrast?: boolean | null
          id?: string
          language_theme?: string | null
          reduced_motion?: boolean | null
          theme_variant?: string | null
          ui_mode?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          blog_style?: string | null
          created_at?: string
          font_size?: number | null
          high_contrast?: boolean | null
          id?: string
          language_theme?: string | null
          reduced_motion?: boolean | null
          theme_variant?: string | null
          ui_mode?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      unified_posts: {
        Row: {
          author_id: string | null
          content: string
          content_type: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          slug: string
          status: string
          theme_specific_styles: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          content_type: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string
          theme_specific_styles?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          content_type?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string
          theme_specific_styles?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_game_progress: {
        Row: {
          created_at: string
          game_id: string
          high_score: number | null
          id: string
          total_plays: number | null
          unlocked_content: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          game_id: string
          high_score?: number | null
          id?: string
          total_plays?: number | null
          unlocked_content?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          game_id?: string
          high_score?: number | null
          id?: string
          total_plays?: number | null
          unlocked_content?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_game_progress_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "mini_games"
            referencedColumns: ["id"]
          },
        ]
      }
      user_interactions: {
        Row: {
          avg_movement_speed: number
          click_frequency: number
          created_at: string
          id: string
          is_active: boolean
          last_active: string
          session_id: string
          updated_at: string
        }
        Insert: {
          avg_movement_speed?: number
          click_frequency?: number
          created_at?: string
          id?: string
          is_active?: boolean
          last_active?: string
          session_id: string
          updated_at?: string
        }
        Update: {
          avg_movement_speed?: number
          click_frequency?: number
          created_at?: string
          id?: string
          is_active?: boolean
          last_active?: string
          session_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_story_progress: {
        Row: {
          created_at: string
          current_node_id: string | null
          id: string
          path_taken: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_node_id?: string | null
          id?: string
          path_taken?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_node_id?: string | null
          id?: string
          path_taken?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_story_progress_current_node_id_fkey"
            columns: ["current_node_id"]
            isOneToOne: false
            referencedRelation: "story_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_profiles: {
        Row: {
          created_at: string
          id: string
          lighting_profile: Json | null
          location: Json | null
          metadata: Json | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          lighting_profile?: Json | null
          location?: Json | null
          metadata?: Json | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          lighting_profile?: Json | null
          location?: Json | null
          metadata?: Json | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authenticate_user: {
        Args: { username_input: string; passcode_input: string }
        Returns: {
          user_id: string
          username: string
          success: boolean
        }[]
      }
      execute_sql: {
        Args: { query_text: string; query_params?: Json }
        Returns: Json
      }
      get_app_id: {
        Args: { p_app_key: string }
        Returns: string
      }
      get_column_exists: {
        Args: { p_table_name: string; p_column_name: string }
        Returns: boolean
      }
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_table_exists: {
        Args: { table_name: string }
        Returns: boolean
      }
      get_user_team_role: {
        Args: { team_id: string; user_id: string }
        Returns: string
      }
      hash_passcode: {
        Args: { passcode_input: string }
        Returns: string
      }
      is_team_member: {
        Args: { team_id: string; user_id: string }
        Returns: boolean
      }
      register_user: {
        Args: { username_input: string; passcode_input: string }
        Returns: {
          user_id: string
          username: string
          success: boolean
          error_message: string
        }[]
      }
    }
    Enums: {
      fan_feed_theme: "music" | "sports" | "entertainment"
      feed_theme: "music" | "sports" | "entertainment"
      visibility_type: "public" | "friends" | "private"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      fan_feed_theme: ["music", "sports", "entertainment"],
      feed_theme: ["music", "sports", "entertainment"],
      visibility_type: ["public", "friends", "private"],
    },
  },
} as const
