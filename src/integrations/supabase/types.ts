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
      auction_bids: {
        Row: {
          amount: number
          bid_type: string
          bidder_id: string | null
          created_at: string | null
          id: string
          is_winning_bid: boolean | null
          listing_id: string | null
          metadata: Json | null
          proxy_max_amount: number | null
        }
        Insert: {
          amount: number
          bid_type?: string
          bidder_id?: string | null
          created_at?: string | null
          id?: string
          is_winning_bid?: boolean | null
          listing_id?: string | null
          metadata?: Json | null
          proxy_max_amount?: number | null
        }
        Update: {
          amount?: number
          bid_type?: string
          bidder_id?: string | null
          created_at?: string | null
          id?: string
          is_winning_bid?: boolean | null
          listing_id?: string | null
          metadata?: Json | null
          proxy_max_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "auction_bids_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      auction_extensions: {
        Row: {
          created_at: string | null
          extension_minutes: number
          id: string
          listing_id: string | null
          new_end_time: string
          original_end_time: string
          trigger_bid_id: string | null
        }
        Insert: {
          created_at?: string | null
          extension_minutes: number
          id?: string
          listing_id?: string | null
          new_end_time: string
          original_end_time: string
          trigger_bid_id?: string | null
        }
        Update: {
          created_at?: string | null
          extension_minutes?: number
          id?: string
          listing_id?: string | null
          new_end_time?: string
          original_end_time?: string
          trigger_bid_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auction_extensions_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auction_extensions_trigger_bid_id_fkey"
            columns: ["trigger_bid_id"]
            isOneToOne: false
            referencedRelation: "auction_bids"
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
      bookmarks: {
        Row: {
          card_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          card_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          card_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_operations: {
        Row: {
          completed_at: string | null
          created_at: string | null
          creator_id: string
          error_log: Json | null
          failed_items: number | null
          id: string
          operation_data: Json
          operation_type: string
          processed_items: number | null
          result_summary: Json | null
          started_at: string | null
          status: string | null
          total_items: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          creator_id: string
          error_log?: Json | null
          failed_items?: number | null
          id?: string
          operation_data?: Json
          operation_type: string
          processed_items?: number | null
          result_summary?: Json | null
          started_at?: string | null
          status?: string | null
          total_items: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          creator_id?: string
          error_log?: Json | null
          failed_items?: number | null
          id?: string
          operation_data?: Json
          operation_type?: string
          processed_items?: number | null
          result_summary?: Json | null
          started_at?: string | null
          status?: string | null
          total_items?: number
        }
        Relationships: [
          {
            foreignKeyName: "bulk_operations_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      card_analysis_results: {
        Row: {
          analysis_type: string
          card_id: string | null
          confidence_score: number | null
          created_at: string | null
          extracted_data: Json
          id: string
          processing_time_ms: number | null
        }
        Insert: {
          analysis_type: string
          card_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          extracted_data?: Json
          id?: string
          processing_time_ms?: number | null
        }
        Update: {
          analysis_type?: string
          card_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          extracted_data?: Json
          id?: string
          processing_time_ms?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "card_analysis_results_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      card_brands: {
        Row: {
          created_at: string | null
          founded_year: number | null
          id: string
          logo_url: string | null
          metadata: Json | null
          name: string
        }
        Insert: {
          created_at?: string | null
          founded_year?: number | null
          id?: string
          logo_url?: string | null
          metadata?: Json | null
          name: string
        }
        Update: {
          created_at?: string | null
          founded_year?: number | null
          id?: string
          logo_url?: string | null
          metadata?: Json | null
          name?: string
        }
        Relationships: []
      }
      card_downloads: {
        Row: {
          card_id: string
          created_at: string
          download_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          card_id: string
          created_at?: string
          download_type?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          card_id?: string
          created_at?: string
          download_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_downloads_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      card_recommendations: {
        Row: {
          card_id: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          reasoning: Json | null
          recommendation_type: string
          score: number
          user_id: string | null
        }
        Insert: {
          card_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          reasoning?: Json | null
          recommendation_type: string
          score: number
          user_id?: string | null
        }
        Update: {
          card_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          reasoning?: Json | null
          recommendation_type?: string
          score?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_recommendations_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      card_templates: {
        Row: {
          category: string
          created_at: string | null
          creator_id: string
          description: string | null
          id: string
          is_active: boolean | null
          is_premium: boolean | null
          name: string
          preview_images: string[] | null
          price: number
          rating_average: number | null
          rating_count: number | null
          revenue_generated: number | null
          sales_count: number | null
          tags: string[] | null
          template_data: Json
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          creator_id: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          name: string
          preview_images?: string[] | null
          price?: number
          rating_average?: number | null
          rating_count?: number | null
          revenue_generated?: number | null
          sales_count?: number | null
          tags?: string[] | null
          template_data?: Json
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          creator_id?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          name?: string
          preview_images?: string[] | null
          price?: number
          rating_average?: number | null
          rating_count?: number | null
          revenue_generated?: number | null
          sales_count?: number | null
          tags?: string[] | null
          template_data?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_templates_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
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
          sports_metadata: Json | null
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
          sports_metadata?: Json | null
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
          sports_metadata?: Json | null
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
      challenge_submissions: {
        Row: {
          challenge_id: string
          creator_id: string
          description: string | null
          id: string
          judge_score: number | null
          prize_amount: number | null
          rank_position: number | null
          submission_data: Json
          submitted_at: string | null
          template_id: string | null
          vote_count: number | null
        }
        Insert: {
          challenge_id: string
          creator_id: string
          description?: string | null
          id?: string
          judge_score?: number | null
          prize_amount?: number | null
          rank_position?: number | null
          submission_data?: Json
          submitted_at?: string | null
          template_id?: string | null
          vote_count?: number | null
        }
        Update: {
          challenge_id?: string
          creator_id?: string
          description?: string | null
          id?: string
          judge_score?: number | null
          prize_amount?: number | null
          rank_position?: number | null
          submission_data?: Json
          submitted_at?: string | null
          template_id?: string | null
          vote_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_submissions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "creator_challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_submissions_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_submissions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "card_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_activity: {
        Row: {
          activity_data: Json | null
          activity_type: string
          collection_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          collection_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          collection_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_activity_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_cards: {
        Row: {
          added_by: string | null
          card_id: string
          collection_id: string
          created_at: string
          display_order: number | null
          id: string
          notes: string | null
          quantity: number | null
        }
        Insert: {
          added_by?: string | null
          card_id: string
          collection_id: string
          created_at?: string
          display_order?: number | null
          id?: string
          notes?: string | null
          quantity?: number | null
        }
        Update: {
          added_by?: string | null
          card_id?: string
          collection_id?: string
          created_at?: string
          display_order?: number | null
          id?: string
          notes?: string | null
          quantity?: number | null
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
      collection_comments: {
        Row: {
          collection_id: string
          content: string
          created_at: string | null
          id: string
          parent_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          collection_id: string
          content: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          collection_id?: string
          content?: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_comments_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "collection_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_followers: {
        Row: {
          collection_id: string
          followed_at: string | null
          follower_id: string
          id: string
          notifications_enabled: boolean | null
        }
        Insert: {
          collection_id: string
          followed_at?: string | null
          follower_id: string
          id?: string
          notifications_enabled?: boolean | null
        }
        Update: {
          collection_id?: string
          followed_at?: string | null
          follower_id?: string
          id?: string
          notifications_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "collection_followers_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_permissions: {
        Row: {
          collection_id: string
          expires_at: string | null
          granted_at: string | null
          granted_by: string
          id: string
          permission_type: string
          user_id: string
        }
        Insert: {
          collection_id: string
          expires_at?: string | null
          granted_at?: string | null
          granted_by: string
          id?: string
          permission_type: string
          user_id: string
        }
        Update: {
          collection_id?: string
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string
          id?: string
          permission_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_permissions_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_ratings: {
        Row: {
          collection_id: string
          created_at: string | null
          id: string
          rating: number
          review: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          collection_id: string
          created_at?: string | null
          id?: string
          rating: number
          review?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          collection_id?: string
          created_at?: string | null
          id?: string
          rating?: number
          review?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_ratings_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_templates: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_official: boolean | null
          name: string
          preview_image_url: string | null
          template_data: Json
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_official?: boolean | null
          name: string
          preview_image_url?: string | null
          template_data?: Json
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_official?: boolean | null
          name?: string
          preview_image_url?: string | null
          template_data?: Json
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      collections: {
        Row: {
          allow_comments: boolean | null
          app_id: string | null
          completion_rate: number | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          design_metadata: Json | null
          featured_until: string | null
          id: string
          is_template: boolean | null
          last_activity_at: string | null
          likes_count: number | null
          owner_id: string
          shares_count: number | null
          tags: string[] | null
          team_id: string | null
          template_category: string | null
          title: string
          updated_at: string
          views_count: number | null
          visibility: string | null
        }
        Insert: {
          allow_comments?: boolean | null
          app_id?: string | null
          completion_rate?: number | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          design_metadata?: Json | null
          featured_until?: string | null
          id?: string
          is_template?: boolean | null
          last_activity_at?: string | null
          likes_count?: number | null
          owner_id: string
          shares_count?: number | null
          tags?: string[] | null
          team_id?: string | null
          template_category?: string | null
          title: string
          updated_at?: string
          views_count?: number | null
          visibility?: string | null
        }
        Update: {
          allow_comments?: boolean | null
          app_id?: string | null
          completion_rate?: number | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          design_metadata?: Json | null
          featured_until?: string | null
          id?: string
          is_template?: boolean | null
          last_activity_at?: string | null
          likes_count?: number | null
          owner_id?: string
          shares_count?: number | null
          tags?: string[] | null
          team_id?: string | null
          template_category?: string | null
          title?: string
          updated_at?: string
          views_count?: number | null
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
      content_moderation_queue: {
        Row: {
          ai_confidence_score: number | null
          community_votes: Json | null
          content_id: string
          content_type: string
          created_at: string | null
          creator_id: string
          id: string
          moderation_type: string
          moderator_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
        }
        Insert: {
          ai_confidence_score?: number | null
          community_votes?: Json | null
          content_id: string
          content_type: string
          created_at?: string | null
          creator_id: string
          id?: string
          moderation_type: string
          moderator_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Update: {
          ai_confidence_score?: number | null
          community_votes?: Json | null
          content_id?: string
          content_type?: string
          created_at?: string | null
          creator_id?: string
          id?: string
          moderation_type?: string
          moderator_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_moderation_queue_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_moderation_queue_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
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
      course_enrollments: {
        Row: {
          certificate_issued: boolean | null
          completed_at: string | null
          course_id: string
          enrolled_at: string | null
          id: string
          progress_percentage: number | null
          rating: number | null
          review: string | null
          student_id: string
        }
        Insert: {
          certificate_issued?: boolean | null
          completed_at?: string | null
          course_id: string
          enrolled_at?: string | null
          id?: string
          progress_percentage?: number | null
          rating?: number | null
          review?: string | null
          student_id: string
        }
        Update: {
          certificate_issued?: boolean | null
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string | null
          id?: string
          progress_percentage?: number | null
          rating?: number | null
          review?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "creator_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
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
      creator_activity_feed: {
        Row: {
          activity_data: Json
          activity_type: string
          created_at: string | null
          creator_id: string
          id: string
          visibility: string | null
        }
        Insert: {
          activity_data?: Json
          activity_type: string
          created_at?: string | null
          creator_id: string
          id?: string
          visibility?: string | null
        }
        Update: {
          activity_data?: Json
          activity_type?: string
          created_at?: string | null
          creator_id?: string
          id?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_activity_feed_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_analytics_events: {
        Row: {
          created_at: string | null
          creator_id: string
          event_data: Json
          event_type: string
          id: string
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          event_data?: Json
          event_type: string
          id?: string
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          event_data?: Json
          event_type?: string
          id?: string
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_analytics_events_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "crd_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_automation_rules: {
        Row: {
          actions: Json
          conditions: Json
          created_at: string | null
          creator_id: string
          execution_count: number | null
          id: string
          is_active: boolean | null
          last_executed_at: string | null
          rule_type: string
          success_rate: number | null
          updated_at: string | null
        }
        Insert: {
          actions?: Json
          conditions?: Json
          created_at?: string | null
          creator_id: string
          execution_count?: number | null
          id?: string
          is_active?: boolean | null
          last_executed_at?: string | null
          rule_type: string
          success_rate?: number | null
          updated_at?: string | null
        }
        Update: {
          actions?: Json
          conditions?: Json
          created_at?: string | null
          creator_id?: string
          execution_count?: number | null
          id?: string
          is_active?: boolean | null
          last_executed_at?: string | null
          rule_type?: string
          success_rate?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_automation_rules_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_challenges: {
        Row: {
          challenge_type: string
          created_at: string | null
          created_by: string
          description: string
          end_date: string
          id: string
          judging_criteria: Json
          participant_count: number | null
          prize_distribution: Json | null
          prize_pool: number | null
          skill_level: string | null
          start_date: string
          status: string | null
          submission_count: number | null
          submission_deadline: string
          title: string
          updated_at: string | null
        }
        Insert: {
          challenge_type: string
          created_at?: string | null
          created_by: string
          description: string
          end_date: string
          id?: string
          judging_criteria?: Json
          participant_count?: number | null
          prize_distribution?: Json | null
          prize_pool?: number | null
          skill_level?: string | null
          start_date: string
          status?: string | null
          submission_count?: number | null
          submission_deadline: string
          title: string
          updated_at?: string | null
        }
        Update: {
          challenge_type?: string
          created_at?: string | null
          created_by?: string
          description?: string
          end_date?: string
          id?: string
          judging_criteria?: Json
          participant_count?: number | null
          prize_distribution?: Json | null
          prize_pool?: number | null
          skill_level?: string | null
          start_date?: string
          status?: string | null
          submission_count?: number | null
          submission_deadline?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_challenges_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_collaborations: {
        Row: {
          collaborators: string[]
          completion_date: string | null
          created_at: string | null
          deadline: string | null
          id: string
          ownership_split: Json
          project_id: string
          project_type: string
          revenue_sharing_agreement: Json
          status: string
          updated_at: string | null
        }
        Insert: {
          collaborators: string[]
          completion_date?: string | null
          created_at?: string | null
          deadline?: string | null
          id?: string
          ownership_split?: Json
          project_id: string
          project_type: string
          revenue_sharing_agreement?: Json
          status?: string
          updated_at?: string | null
        }
        Update: {
          collaborators?: string[]
          completion_date?: string | null
          created_at?: string | null
          deadline?: string | null
          id?: string
          ownership_split?: Json
          project_id?: string
          project_type?: string
          revenue_sharing_agreement?: Json
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_collaborations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "card_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_courses: {
        Row: {
          category: string
          course_data: Json
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          enrollment_count: number | null
          id: string
          instructor_id: string
          is_free: boolean | null
          is_published: boolean | null
          price: number | null
          rating_average: number | null
          rating_count: number | null
          skill_level: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          course_data?: Json
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          enrollment_count?: number | null
          id?: string
          instructor_id: string
          is_free?: boolean | null
          is_published?: boolean | null
          price?: number | null
          rating_average?: number | null
          rating_count?: number | null
          skill_level: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          course_data?: Json
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          enrollment_count?: number | null
          id?: string
          instructor_id?: string
          is_free?: boolean | null
          is_published?: boolean | null
          price?: number | null
          rating_average?: number | null
          rating_count?: number | null
          skill_level?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_earnings: {
        Row: {
          amount: number
          buyer_id: string | null
          card_id: string | null
          creator_id: string
          id: string
          metadata: Json | null
          net_amount: number
          payout_date: string | null
          payout_status: string | null
          platform_fee: number
          source_type: string
          tax_document_id: string | null
          template_id: string | null
          transaction_date: string | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          buyer_id?: string | null
          card_id?: string | null
          creator_id: string
          id?: string
          metadata?: Json | null
          net_amount: number
          payout_date?: string | null
          payout_status?: string | null
          platform_fee: number
          source_type: string
          tax_document_id?: string | null
          template_id?: string | null
          transaction_date?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          buyer_id?: string | null
          card_id?: string | null
          creator_id?: string
          id?: string
          metadata?: Json | null
          net_amount?: number
          payout_date?: string | null
          payout_status?: string | null
          platform_fee?: number
          source_type?: string
          tax_document_id?: string | null
          template_id?: string | null
          transaction_date?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_earnings_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "crd_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_earnings_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_earnings_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_earnings_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "card_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_financing: {
        Row: {
          amount_funded: number | null
          amount_requested: number
          backers_count: number | null
          created_at: string | null
          creator_id: string
          deadline: string | null
          financing_type: string
          funding_goal: number | null
          id: string
          interest_rate: number | null
          project_description: string
          repayment_terms: Json | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount_funded?: number | null
          amount_requested: number
          backers_count?: number | null
          created_at?: string | null
          creator_id: string
          deadline?: string | null
          financing_type: string
          funding_goal?: number | null
          id?: string
          interest_rate?: number | null
          project_description: string
          repayment_terms?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount_funded?: number | null
          amount_requested?: number
          backers_count?: number | null
          created_at?: string | null
          creator_id?: string
          deadline?: string | null
          financing_type?: string
          funding_goal?: number | null
          id?: string
          interest_rate?: number | null
          project_description?: string
          repayment_terms?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_financing_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_forums: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          moderator_ids: string[] | null
          name: string
          skill_level: string
          specialty: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          moderator_ids?: string[] | null
          name: string
          skill_level: string
          specialty: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          moderator_ids?: string[] | null
          name?: string
          skill_level?: string
          specialty?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      creator_mentorships: {
        Row: {
          commission_percentage: number | null
          created_at: string | null
          feedback_rating: number | null
          id: string
          mentee_id: string
          mentor_id: string
          payment_amount: number | null
          program_type: string
          sessions_completed: number | null
          start_date: string | null
          status: string
          total_sessions: number | null
          updated_at: string | null
        }
        Insert: {
          commission_percentage?: number | null
          created_at?: string | null
          feedback_rating?: number | null
          id?: string
          mentee_id: string
          mentor_id: string
          payment_amount?: number | null
          program_type: string
          sessions_completed?: number | null
          start_date?: string | null
          status?: string
          total_sessions?: number | null
          updated_at?: string | null
        }
        Update: {
          commission_percentage?: number | null
          created_at?: string | null
          feedback_rating?: number | null
          id?: string
          mentee_id?: string
          mentor_id?: string
          payment_amount?: number | null
          program_type?: string
          sessions_completed?: number | null
          start_date?: string | null
          status?: string
          total_sessions?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_mentorships_mentee_id_fkey"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_mentorships_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_profiles: {
        Row: {
          avg_rating: number | null
          bio: string | null
          bio_extended: string | null
          cards_created: number | null
          commission_rates: Json | null
          created_at: string | null
          id: string
          payout_method: string | null
          portfolio_url: string | null
          rating_count: number | null
          specialties: string[] | null
          stripe_account_id: string | null
          tax_info: Json | null
          total_earnings: number | null
          updated_at: string | null
          user_id: string
          verification_status: string
        }
        Insert: {
          avg_rating?: number | null
          bio?: string | null
          bio_extended?: string | null
          cards_created?: number | null
          commission_rates?: Json | null
          created_at?: string | null
          id?: string
          payout_method?: string | null
          portfolio_url?: string | null
          rating_count?: number | null
          specialties?: string[] | null
          stripe_account_id?: string | null
          tax_info?: Json | null
          total_earnings?: number | null
          updated_at?: string | null
          user_id: string
          verification_status?: string
        }
        Update: {
          avg_rating?: number | null
          bio?: string | null
          bio_extended?: string | null
          cards_created?: number | null
          commission_rates?: Json | null
          created_at?: string | null
          id?: string
          payout_method?: string | null
          portfolio_url?: string | null
          rating_count?: number | null
          specialties?: string[] | null
          stripe_account_id?: string | null
          tax_info?: Json | null
          total_earnings?: number | null
          updated_at?: string | null
          user_id?: string
          verification_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "crd_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_program_applications: {
        Row: {
          application_data: Json
          applied_at: string | null
          creator_id: string
          id: string
          program_id: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
        }
        Insert: {
          application_data?: Json
          applied_at?: string | null
          creator_id: string
          id?: string
          program_id: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Update: {
          application_data?: Json
          applied_at?: string | null
          creator_id?: string
          id?: string
          program_id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_program_applications_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_program_applications_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "creator_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_program_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_programs: {
        Row: {
          application_deadline: string | null
          benefits: Json
          created_at: string | null
          current_participants: number | null
          description: string | null
          eligibility_criteria: Json
          id: string
          is_active: boolean | null
          max_participants: number | null
          program_duration_days: number | null
          program_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          application_deadline?: string | null
          benefits?: Json
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          eligibility_criteria?: Json
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          program_duration_days?: number | null
          program_type: string
          title: string
          updated_at?: string | null
        }
        Update: {
          application_deadline?: string | null
          benefits?: Json
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          eligibility_criteria?: Json
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          program_duration_days?: number | null
          program_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      creator_quality_metrics: {
        Row: {
          created_at: string | null
          creator_id: string
          id: string
          measurement_date: string
          metadata: Json | null
          metric_type: string
          metric_value: number
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          id?: string
          measurement_date: string
          metadata?: Json | null
          metric_type: string
          metric_value: number
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          id?: string
          measurement_date?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "creator_quality_metrics_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_subscriptions: {
        Row: {
          created_at: string | null
          creator_id: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          monthly_price: number
          status: string | null
          stripe_subscription_id: string | null
          subscriber_id: string
          subscription_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          monthly_price: number
          status?: string | null
          stripe_subscription_id?: string | null
          subscriber_id: string
          subscription_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          monthly_price?: number
          status?: string | null
          stripe_subscription_id?: string | null
          subscriber_id?: string
          subscription_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_subscriptions_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_subscriptions_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "crd_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_workshops: {
        Row: {
          created_at: string | null
          current_attendees: number | null
          description: string | null
          duration_minutes: number
          id: string
          instructor_id: string
          max_attendees: number | null
          price: number | null
          recording_url: string | null
          scheduled_at: string
          skill_level: string | null
          status: string | null
          stream_url: string | null
          title: string
          updated_at: string | null
          workshop_type: string
        }
        Insert: {
          created_at?: string | null
          current_attendees?: number | null
          description?: string | null
          duration_minutes: number
          id?: string
          instructor_id: string
          max_attendees?: number | null
          price?: number | null
          recording_url?: string | null
          scheduled_at: string
          skill_level?: string | null
          status?: string | null
          stream_url?: string | null
          title: string
          updated_at?: string | null
          workshop_type: string
        }
        Update: {
          created_at?: string | null
          current_attendees?: number | null
          description?: string | null
          duration_minutes?: number
          id?: string
          instructor_id?: string
          max_attendees?: number | null
          price?: number | null
          recording_url?: string | null
          scheduled_at?: string
          skill_level?: string | null
          status?: string | null
          stream_url?: string | null
          title?: string
          updated_at?: string | null
          workshop_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_workshops_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
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
      design_assets_library: {
        Row: {
          asset_type: string
          categories: string[] | null
          created_at: string | null
          creator_id: string
          description: string | null
          downloads_count: number | null
          file_size: number | null
          file_url: string
          id: string
          is_public: boolean | null
          metadata: Json | null
          mime_type: string | null
          price: number | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string | null
          updated_at: string | null
          usage_rights: string
        }
        Insert: {
          asset_type: string
          categories?: string[] | null
          created_at?: string | null
          creator_id: string
          description?: string | null
          downloads_count?: number | null
          file_size?: number | null
          file_url: string
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          price?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string | null
          usage_rights: string
        }
        Update: {
          asset_type?: string
          categories?: string[] | null
          created_at?: string | null
          creator_id?: string
          description?: string | null
          downloads_count?: number | null
          file_size?: number | null
          file_url?: string
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          price?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string | null
          usage_rights?: string
        }
        Relationships: [
          {
            foreignKeyName: "design_assets_library_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
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
          optimization_metadata: Json | null
          original_dimensions: Json | null
          original_filename: string
          processing_status: string | null
          storage_path: string
          tags: string[] | null
          thumbnail_path: string | null
          title: string | null
          updated_at: string
          user_id: string
          variants: Json | null
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
          optimization_metadata?: Json | null
          original_dimensions?: Json | null
          original_filename: string
          processing_status?: string | null
          storage_path: string
          tags?: string[] | null
          thumbnail_path?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
          variants?: Json | null
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
          optimization_metadata?: Json | null
          original_dimensions?: Json | null
          original_filename?: string
          processing_status?: string | null
          storage_path?: string
          tags?: string[] | null
          thumbnail_path?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
          variants?: Json | null
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
      external_integrations: {
        Row: {
          api_credentials: Json | null
          created_at: string | null
          creator_id: string
          error_message: string | null
          id: string
          integration_type: string
          last_sync_at: string | null
          service_name: string
          sync_settings: Json | null
          sync_status: string | null
          updated_at: string | null
        }
        Insert: {
          api_credentials?: Json | null
          created_at?: string | null
          creator_id: string
          error_message?: string | null
          id?: string
          integration_type: string
          last_sync_at?: string | null
          service_name: string
          sync_settings?: Json | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Update: {
          api_credentials?: Json | null
          created_at?: string | null
          creator_id?: string
          error_message?: string | null
          id?: string
          integration_type?: string
          last_sync_at?: string | null
          service_name?: string
          sync_settings?: Json | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "external_integrations_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
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
      forum_replies: {
        Row: {
          content: string
          created_at: string | null
          creator_id: string
          id: string
          is_solution: boolean | null
          parent_reply_id: string | null
          topic_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          creator_id: string
          id?: string
          is_solution?: boolean | null
          parent_reply_id?: string | null
          topic_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          creator_id?: string
          id?: string
          is_solution?: boolean | null
          parent_reply_id?: string | null
          topic_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_parent_reply_id_fkey"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "forum_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_topics: {
        Row: {
          content: string
          created_at: string | null
          creator_id: string
          forum_id: string
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          last_activity_at: string | null
          reply_count: number | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          content: string
          created_at?: string | null
          creator_id: string
          forum_id: string
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_activity_at?: string | null
          reply_count?: number | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          content?: string
          created_at?: string | null
          creator_id?: string
          forum_id?: string
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_activity_at?: string | null
          reply_count?: number | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_topics_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_topics_forum_id_fkey"
            columns: ["forum_id"]
            isOneToOne: false
            referencedRelation: "creator_forums"
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
      image_variants: {
        Row: {
          asset_id: string | null
          created_at: string | null
          file_size: number | null
          format: string | null
          height: number | null
          id: string
          quality: number | null
          storage_path: string
          variant_type: string
          width: number | null
        }
        Insert: {
          asset_id?: string | null
          created_at?: string | null
          file_size?: number | null
          format?: string | null
          height?: number | null
          id?: string
          quality?: number | null
          storage_path: string
          variant_type: string
          width?: number | null
        }
        Update: {
          asset_id?: string | null
          created_at?: string | null
          file_size?: number | null
          format?: string | null
          height?: number | null
          id?: string
          quality?: number | null
          storage_path?: string
          variant_type?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "image_variants_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "digital_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_watchers: {
        Row: {
          created_at: string | null
          id: string
          listing_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          listing_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          listing_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_watchers_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
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
      market_alerts: {
        Row: {
          alert_type: string
          condition_data: Json
          created_at: string | null
          entity_id: string | null
          id: string
          is_active: boolean | null
          last_triggered: string | null
          triggered_count: number | null
          user_id: string | null
        }
        Insert: {
          alert_type: string
          condition_data?: Json
          created_at?: string | null
          entity_id?: string | null
          id?: string
          is_active?: boolean | null
          last_triggered?: string | null
          triggered_count?: number | null
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          condition_data?: Json
          created_at?: string | null
          entity_id?: string | null
          id?: string
          is_active?: boolean | null
          last_triggered?: string | null
          triggered_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      market_analytics: {
        Row: {
          avg_price: number | null
          card_id: string | null
          created_at: string | null
          date: string
          id: string
          liquidity_score: number | null
          market_cap: number | null
          metadata: Json | null
          price_change_24h: number | null
          transactions: number | null
          trending_score: number | null
          volume: number | null
        }
        Insert: {
          avg_price?: number | null
          card_id?: string | null
          created_at?: string | null
          date: string
          id?: string
          liquidity_score?: number | null
          market_cap?: number | null
          metadata?: Json | null
          price_change_24h?: number | null
          transactions?: number | null
          trending_score?: number | null
          volume?: number | null
        }
        Update: {
          avg_price?: number | null
          card_id?: string | null
          created_at?: string | null
          date?: string
          id?: string
          liquidity_score?: number | null
          market_cap?: number | null
          metadata?: Json | null
          price_change_24h?: number | null
          transactions?: number | null
          trending_score?: number | null
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "market_analytics_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      market_trends: {
        Row: {
          created_at: string | null
          duration_days: number | null
          entity_id: string | null
          expires_at: string | null
          id: string
          strength: number | null
          trend_data: Json
          trend_name: string
          trend_type: string
        }
        Insert: {
          created_at?: string | null
          duration_days?: number | null
          entity_id?: string | null
          expires_at?: string | null
          id?: string
          strength?: number | null
          trend_data?: Json
          trend_name: string
          trend_type: string
        }
        Update: {
          created_at?: string | null
          duration_days?: number | null
          entity_id?: string | null
          expires_at?: string | null
          id?: string
          strength?: number | null
          trend_data?: Json
          trend_name?: string
          trend_type?: string
        }
        Relationships: []
      }
      marketplace_fees: {
        Row: {
          active: boolean | null
          created_at: string | null
          fee_type: string
          fixed_amount: number | null
          id: string
          max_amount: number | null
          min_amount: number | null
          percentage: number | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          fee_type: string
          fixed_amount?: number | null
          id?: string
          max_amount?: number | null
          min_amount?: number | null
          percentage?: number | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          fee_type?: string
          fixed_amount?: number | null
          id?: string
          max_amount?: number | null
          min_amount?: number | null
          percentage?: number | null
        }
        Relationships: []
      }
      marketplace_listings: {
        Row: {
          auction_end_time: string | null
          card_id: string
          condition: Database["public"]["Enums"]["card_condition"]
          created_at: string | null
          current_bid: number | null
          description: string | null
          estimated_delivery_days: number | null
          expires_at: string | null
          featured: boolean | null
          id: string
          images: string[] | null
          listing_type: Database["public"]["Enums"]["listing_type"]
          location: string | null
          price: number
          quantity: number
          reserve_price: number | null
          seller_id: string
          shipping_cost: number | null
          starting_bid: number | null
          status: Database["public"]["Enums"]["listing_status"]
          title: string
          updated_at: string | null
          views_count: number | null
          watchers_count: number | null
        }
        Insert: {
          auction_end_time?: string | null
          card_id: string
          condition?: Database["public"]["Enums"]["card_condition"]
          created_at?: string | null
          current_bid?: number | null
          description?: string | null
          estimated_delivery_days?: number | null
          expires_at?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          listing_type?: Database["public"]["Enums"]["listing_type"]
          location?: string | null
          price: number
          quantity?: number
          reserve_price?: number | null
          seller_id: string
          shipping_cost?: number | null
          starting_bid?: number | null
          status?: Database["public"]["Enums"]["listing_status"]
          title: string
          updated_at?: string | null
          views_count?: number | null
          watchers_count?: number | null
        }
        Update: {
          auction_end_time?: string | null
          card_id?: string
          condition?: Database["public"]["Enums"]["card_condition"]
          created_at?: string | null
          current_bid?: number | null
          description?: string | null
          estimated_delivery_days?: number | null
          expires_at?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          listing_type?: Database["public"]["Enums"]["listing_type"]
          location?: string | null
          price?: number
          quantity?: number
          reserve_price?: number | null
          seller_id?: string
          shipping_cost?: number | null
          starting_bid?: number | null
          status?: Database["public"]["Enums"]["listing_status"]
          title?: string
          updated_at?: string | null
          views_count?: number | null
          watchers_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_listings_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_performance_metrics: {
        Row: {
          aggregation_period: string | null
          card_id: string | null
          created_at: string | null
          creator_id: string | null
          id: string
          metadata: Json | null
          metric_date: string
          metric_name: string
          metric_value: number
          template_id: string | null
        }
        Insert: {
          aggregation_period?: string | null
          card_id?: string | null
          created_at?: string | null
          creator_id?: string | null
          id?: string
          metadata?: Json | null
          metric_date: string
          metric_name: string
          metric_value: number
          template_id?: string | null
        }
        Update: {
          aggregation_period?: string | null
          card_id?: string | null
          created_at?: string | null
          creator_id?: string | null
          id?: string
          metadata?: Json | null
          metric_date?: string
          metric_name?: string
          metric_value?: number
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_performance_metrics_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_performance_metrics_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_performance_metrics_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "card_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_seo_profiles: {
        Row: {
          created_at: string | null
          creator_id: string
          custom_url_slug: string | null
          id: string
          keywords: string[] | null
          last_optimized_at: string | null
          meta_description: string | null
          meta_title: string | null
          seo_score: number | null
          social_media_links: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          custom_url_slug?: string | null
          id?: string
          keywords?: string[] | null
          last_optimized_at?: string | null
          meta_description?: string | null
          meta_title?: string | null
          seo_score?: number | null
          social_media_links?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          custom_url_slug?: string | null
          id?: string
          keywords?: string[] | null
          last_optimized_at?: string | null
          meta_description?: string | null
          meta_title?: string | null
          seo_score?: number | null
          social_media_links?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_seo_profiles_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
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
      media_files: {
        Row: {
          bucket_id: string
          created_at: string | null
          duration: number | null
          file_name: string
          file_path: string
          file_size: number
          height: number | null
          id: string
          is_optimized: boolean | null
          metadata: Json | null
          mime_type: string
          optimization_variants: Json | null
          tags: string[] | null
          thumbnail_path: string | null
          updated_at: string | null
          user_id: string | null
          width: number | null
        }
        Insert: {
          bucket_id: string
          created_at?: string | null
          duration?: number | null
          file_name: string
          file_path: string
          file_size: number
          height?: number | null
          id?: string
          is_optimized?: boolean | null
          metadata?: Json | null
          mime_type: string
          optimization_variants?: Json | null
          tags?: string[] | null
          thumbnail_path?: string | null
          updated_at?: string | null
          user_id?: string | null
          width?: number | null
        }
        Update: {
          bucket_id?: string
          created_at?: string | null
          duration?: number | null
          file_name?: string
          file_path?: string
          file_size?: number
          height?: number | null
          id?: string
          is_optimized?: boolean | null
          metadata?: Json | null
          mime_type?: string
          optimization_variants?: Json | null
          tags?: string[] | null
          thumbnail_path?: string | null
          updated_at?: string | null
          user_id?: string | null
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
      oakland_events: {
        Row: {
          created_at: string | null
          description: string | null
          era: string | null
          event_date: string | null
          event_type: string
          featured_memory_id: string | null
          id: string
          is_historical: boolean | null
          location: string | null
          memories_count: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          era?: string | null
          event_date?: string | null
          event_type: string
          featured_memory_id?: string | null
          id?: string
          is_historical?: boolean | null
          location?: string | null
          memories_count?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          era?: string | null
          event_date?: string | null
          event_type?: string
          featured_memory_id?: string | null
          id?: string
          is_historical?: boolean | null
          location?: string | null
          memories_count?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "oakland_events_featured_memory_id_fkey"
            columns: ["featured_memory_id"]
            isOneToOne: false
            referencedRelation: "oakland_memories"
            referencedColumns: ["id"]
          },
        ]
      }
      oakland_expressions: {
        Row: {
          audio_url: string | null
          category: string
          created_at: string | null
          decade: string | null
          emotion_tags: string[] | null
          era: string | null
          id: string
          source: string | null
          text_content: string
          usage_count: number | null
        }
        Insert: {
          audio_url?: string | null
          category: string
          created_at?: string | null
          decade?: string | null
          emotion_tags?: string[] | null
          era?: string | null
          id?: string
          source?: string | null
          text_content: string
          usage_count?: number | null
        }
        Update: {
          audio_url?: string | null
          category?: string
          created_at?: string | null
          decade?: string | null
          emotion_tags?: string[] | null
          era?: string | null
          id?: string
          source?: string | null
          text_content?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      oakland_memories: {
        Row: {
          attendees: string[] | null
          audio_url: string | null
          community_reactions: Json | null
          created_at: string | null
          description: string | null
          effect_settings: Json | null
          emotions: string[] | null
          era: string | null
          fan_expressions: string[] | null
          game_date: string | null
          historical_context: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          location: string | null
          memory_type: string
          opponent: string | null
          personal_significance: string | null
          score: string | null
          section: string | null
          tags: string[] | null
          template_id: string | null
          title: string
          updated_at: string | null
          user_id: string
          video_url: string | null
          visibility: string | null
        }
        Insert: {
          attendees?: string[] | null
          audio_url?: string | null
          community_reactions?: Json | null
          created_at?: string | null
          description?: string | null
          effect_settings?: Json | null
          emotions?: string[] | null
          era?: string | null
          fan_expressions?: string[] | null
          game_date?: string | null
          historical_context?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          location?: string | null
          memory_type: string
          opponent?: string | null
          personal_significance?: string | null
          score?: string | null
          section?: string | null
          tags?: string[] | null
          template_id?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          video_url?: string | null
          visibility?: string | null
        }
        Update: {
          attendees?: string[] | null
          audio_url?: string | null
          community_reactions?: Json | null
          created_at?: string | null
          description?: string | null
          effect_settings?: Json | null
          emotions?: string[] | null
          era?: string | null
          fan_expressions?: string[] | null
          game_date?: string | null
          historical_context?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          location?: string | null
          memory_type?: string
          opponent?: string | null
          personal_significance?: string | null
          score?: string | null
          section?: string | null
          tags?: string[] | null
          template_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          video_url?: string | null
          visibility?: string | null
        }
        Relationships: []
      }
      oakland_templates: {
        Row: {
          category: string
          config: Json
          created_at: string | null
          description: string | null
          era: string | null
          id: string
          name: string
          preview_url: string | null
          tags: string[] | null
          usage_count: number | null
        }
        Insert: {
          category: string
          config?: Json
          created_at?: string | null
          description?: string | null
          era?: string | null
          id?: string
          name: string
          preview_url?: string | null
          tags?: string[] | null
          usage_count?: number | null
        }
        Update: {
          category?: string
          config?: Json
          created_at?: string | null
          description?: string | null
          era?: string | null
          id?: string
          name?: string
          preview_url?: string | null
          tags?: string[] | null
          usage_count?: number | null
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
      seller_analytics: {
        Row: {
          avg_sale_price: number | null
          conversion_rate: number | null
          created_at: string | null
          date: string
          id: string
          metadata: Json | null
          rating_average: number | null
          rating_count: number | null
          seller_id: string | null
          total_listings: number | null
          total_sales: number | null
          total_views: number | null
          total_watchers: number | null
        }
        Insert: {
          avg_sale_price?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          date: string
          id?: string
          metadata?: Json | null
          rating_average?: number | null
          rating_count?: number | null
          seller_id?: string | null
          total_listings?: number | null
          total_sales?: number | null
          total_views?: number | null
          total_watchers?: number | null
        }
        Update: {
          avg_sale_price?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          date?: string
          id?: string
          metadata?: Json | null
          rating_average?: number | null
          rating_count?: number | null
          seller_id?: string | null
          total_listings?: number | null
          total_sales?: number | null
          total_views?: number | null
          total_watchers?: number | null
        }
        Relationships: []
      }
      seller_profiles: {
        Row: {
          address: Json | null
          bank_account_verified: boolean | null
          business_name: string | null
          business_type: string | null
          created_at: string | null
          id: string
          identity_verified: boolean | null
          payouts_enabled: boolean | null
          phone: string | null
          stripe_account_id: string | null
          tax_id: string | null
          updated_at: string | null
          user_id: string
          verification_status: string | null
          website: string | null
        }
        Insert: {
          address?: Json | null
          bank_account_verified?: boolean | null
          business_name?: string | null
          business_type?: string | null
          created_at?: string | null
          id?: string
          identity_verified?: boolean | null
          payouts_enabled?: boolean | null
          phone?: string | null
          stripe_account_id?: string | null
          tax_id?: string | null
          updated_at?: string | null
          user_id: string
          verification_status?: string | null
          website?: string | null
        }
        Update: {
          address?: Json | null
          bank_account_verified?: boolean | null
          business_name?: string | null
          business_type?: string | null
          created_at?: string | null
          id?: string
          identity_verified?: boolean | null
          payouts_enabled?: boolean | null
          phone?: string | null
          stripe_account_id?: string | null
          tax_id?: string | null
          updated_at?: string | null
          user_id?: string
          verification_status?: string | null
          website?: string | null
        }
        Relationships: []
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
      sports_players: {
        Row: {
          birth_year: number | null
          career_stats: Json | null
          created_at: string | null
          id: string
          metadata: Json | null
          name: string
          position: string | null
          sport: string
          team_id: string | null
        }
        Insert: {
          birth_year?: number | null
          career_stats?: Json | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          name: string
          position?: string | null
          sport: string
          team_id?: string | null
        }
        Update: {
          birth_year?: number | null
          career_stats?: Json | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          position?: string | null
          sport?: string
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sports_players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "sports_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      sports_teams: {
        Row: {
          city: string | null
          colors: Json | null
          created_at: string | null
          id: string
          league: string | null
          logo_url: string | null
          metadata: Json | null
          name: string
          sport: string
        }
        Insert: {
          city?: string | null
          colors?: Json | null
          created_at?: string | null
          id?: string
          league?: string | null
          logo_url?: string | null
          metadata?: Json | null
          name: string
          sport: string
        }
        Update: {
          city?: string | null
          colors?: Json | null
          created_at?: string | null
          id?: string
          league?: string | null
          logo_url?: string | null
          metadata?: Json | null
          name?: string
          sport?: string
        }
        Relationships: []
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
      template_purchases: {
        Row: {
          buyer_id: string
          id: string
          license_type: string | null
          metadata: Json | null
          purchase_date: string | null
          purchase_price: number
          stripe_payment_intent_id: string | null
          template_id: string
        }
        Insert: {
          buyer_id: string
          id?: string
          license_type?: string | null
          metadata?: Json | null
          purchase_date?: string | null
          purchase_price: number
          stripe_payment_intent_id?: string | null
          template_id: string
        }
        Update: {
          buyer_id?: string
          id?: string
          license_type?: string | null
          metadata?: Json | null
          purchase_date?: string | null
          purchase_price?: number
          stripe_payment_intent_id?: string | null
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_purchases_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "crd_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "template_purchases_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "card_templates"
            referencedColumns: ["id"]
          },
        ]
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
      trade_disputes: {
        Row: {
          admin_notes: string | null
          created_at: string
          description: string
          dispute_reason: string
          id: string
          reporter_id: string
          resolution: string | null
          resolved_at: string | null
          status: string
          trade_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          description: string
          dispute_reason: string
          id?: string
          reporter_id: string
          resolution?: string | null
          resolved_at?: string | null
          status?: string
          trade_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          description?: string
          dispute_reason?: string
          id?: string
          reporter_id?: string
          resolution?: string | null
          resolved_at?: string | null
          status?: string
          trade_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_disputes_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trade_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_feedback: {
        Row: {
          created_at: string
          feedback: string | null
          id: string
          rating: number
          reviewee_id: string
          reviewer_id: string
          trade_id: string
        }
        Insert: {
          created_at?: string
          feedback?: string | null
          id?: string
          rating: number
          reviewee_id: string
          reviewer_id: string
          trade_id: string
        }
        Update: {
          created_at?: string
          feedback?: string | null
          id?: string
          rating?: number
          reviewee_id?: string
          reviewer_id?: string
          trade_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_feedback_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trade_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_messages: {
        Row: {
          attachment_url: string | null
          id: string
          message: string
          message_type: string
          metadata: Json | null
          read_status: boolean
          sender_id: string
          timestamp: string
          trade_id: string
        }
        Insert: {
          attachment_url?: string | null
          id?: string
          message: string
          message_type?: string
          metadata?: Json | null
          read_status?: boolean
          sender_id: string
          timestamp?: string
          trade_id: string
        }
        Update: {
          attachment_url?: string | null
          id?: string
          message?: string
          message_type?: string
          metadata?: Json | null
          read_status?: boolean
          sender_id?: string
          timestamp?: string
          trade_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_messages_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trade_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_offers: {
        Row: {
          cash_included: number | null
          completed_at: string | null
          created_at: string
          expires_at: string
          id: string
          initiator_id: string
          messages_channel_id: string
          notes: string | null
          offered_cards: Json
          recipient_id: string
          requested_cards: Json
          status: string
          trade_rating: number | null
          trade_value_difference: number | null
          updated_at: string
        }
        Insert: {
          cash_included?: number | null
          completed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          initiator_id: string
          messages_channel_id: string
          notes?: string | null
          offered_cards?: Json
          recipient_id: string
          requested_cards?: Json
          status?: string
          trade_rating?: number | null
          trade_value_difference?: number | null
          updated_at?: string
        }
        Update: {
          cash_included?: number | null
          completed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          initiator_id?: string
          messages_channel_id?: string
          notes?: string | null
          offered_cards?: Json
          recipient_id?: string
          requested_cards?: Json
          status?: string
          trade_rating?: number | null
          trade_value_difference?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          buyer_id: string | null
          cancelled_at: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          listing_id: string | null
          notes: string | null
          platform_fee: number
          seller_id: string | null
          shipping_address: Json | null
          shipping_cost: number | null
          status: Database["public"]["Enums"]["transaction_status"]
          stripe_payment_intent_id: string | null
          stripe_transfer_id: string | null
          total_amount: number
          tracking_number: string | null
        }
        Insert: {
          amount: number
          buyer_id?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          listing_id?: string | null
          notes?: string | null
          platform_fee: number
          seller_id?: string | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          status?: Database["public"]["Enums"]["transaction_status"]
          stripe_payment_intent_id?: string | null
          stripe_transfer_id?: string | null
          total_amount: number
          tracking_number?: string | null
        }
        Update: {
          amount?: number
          buyer_id?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          listing_id?: string | null
          notes?: string | null
          platform_fee?: number
          seller_id?: string | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          status?: Database["public"]["Enums"]["transaction_status"]
          stripe_payment_intent_id?: string | null
          stripe_transfer_id?: string | null
          total_amount?: number
          tracking_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
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
      user_portfolios: {
        Row: {
          avg_purchase_price: number | null
          card_id: string | null
          current_value: number | null
          id: string
          last_updated: string | null
          metadata: Json | null
          quantity: number | null
          realized_pnl: number | null
          total_invested: number | null
          unrealized_pnl: number | null
          user_id: string | null
        }
        Insert: {
          avg_purchase_price?: number | null
          card_id?: string | null
          current_value?: number | null
          id?: string
          last_updated?: string | null
          metadata?: Json | null
          quantity?: number | null
          realized_pnl?: number | null
          total_invested?: number | null
          unrealized_pnl?: number | null
          user_id?: string | null
        }
        Update: {
          avg_purchase_price?: number | null
          card_id?: string | null
          current_value?: number | null
          id?: string
          last_updated?: string | null
          metadata?: Json | null
          quantity?: number | null
          realized_pnl?: number | null
          total_invested?: number | null
          unrealized_pnl?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_portfolios_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
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
      user_trade_preferences: {
        Row: {
          auto_accept_equal_trades: boolean | null
          blocked_users: string[] | null
          created_at: string
          id: string
          max_trade_value: number | null
          notification_preferences: Json | null
          preferred_trade_types: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_accept_equal_trades?: boolean | null
          blocked_users?: string[] | null
          created_at?: string
          id?: string
          max_trade_value?: number | null
          notification_preferences?: Json | null
          preferred_trade_types?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_accept_equal_trades?: boolean | null
          blocked_users?: string[] | null
          created_at?: string
          id?: string
          max_trade_value?: number | null
          notification_preferences?: Json | null
          preferred_trade_types?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      workshop_attendees: {
        Row: {
          attended: boolean | null
          attendee_id: string
          feedback_rating: number | null
          feedback_text: string | null
          id: string
          registration_date: string | null
          workshop_id: string
        }
        Insert: {
          attended?: boolean | null
          attendee_id: string
          feedback_rating?: number | null
          feedback_text?: string | null
          id?: string
          registration_date?: string | null
          workshop_id: string
        }
        Update: {
          attended?: boolean | null
          attendee_id?: string
          feedback_rating?: number | null
          feedback_text?: string | null
          id?: string
          registration_date?: string | null
          workshop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workshop_attendees_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workshop_attendees_workshop_id_fkey"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "creator_workshops"
            referencedColumns: ["id"]
          },
        ]
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
      calculate_trending_score: {
        Args: { p_card_id: string }
        Returns: number
      }
      cleanup_orphaned_files: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      execute_sql: {
        Args: { query_text: string; query_params?: Json }
        Returns: Json
      }
      expire_old_trades: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_app_id: {
        Args: { p_app_key: string }
        Returns: string
      }
      get_card_reaction_counts: {
        Args: { card_uuid: string }
        Returns: {
          like_count: number
          view_count: number
        }[]
      }
      get_collection_analytics: {
        Args: { collection_uuid: string }
        Returns: {
          total_cards: number
          unique_rarities: number
          completion_rate: number
          total_views: number
          total_likes: number
          total_followers: number
          recent_activity: number
        }[]
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
      get_user_card_status: {
        Args: { card_uuid: string; user_uuid: string }
        Returns: {
          is_liked: boolean
          is_bookmarked: boolean
        }[]
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
      update_portfolio_value: {
        Args: { p_user_id: string; p_card_id: string }
        Returns: undefined
      }
    }
    Enums: {
      card_condition:
        | "mint"
        | "near_mint"
        | "excellent"
        | "good"
        | "fair"
        | "poor"
      fan_feed_theme: "music" | "sports" | "entertainment"
      feed_theme: "music" | "sports" | "entertainment"
      listing_status: "active" | "sold" | "cancelled" | "expired"
      listing_type: "fixed_price" | "auction" | "make_offer"
      transaction_status:
        | "pending"
        | "processing"
        | "completed"
        | "cancelled"
        | "refunded"
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
      card_condition: [
        "mint",
        "near_mint",
        "excellent",
        "good",
        "fair",
        "poor",
      ],
      fan_feed_theme: ["music", "sports", "entertainment"],
      feed_theme: ["music", "sports", "entertainment"],
      listing_status: ["active", "sold", "cancelled", "expired"],
      listing_type: ["fixed_price", "auction", "make_offer"],
      transaction_status: [
        "pending",
        "processing",
        "completed",
        "cancelled",
        "refunded",
      ],
      visibility_type: ["public", "friends", "private"],
    },
  },
} as const
