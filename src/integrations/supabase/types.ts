export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      article_category_maps: {
        Row: {
          article_id: string
          category_id: string
        }
        Insert: {
          article_id: string
          category_id: string
        }
        Update: {
          article_id?: string
          category_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_category_maps_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_category_maps_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      article_tag_maps: {
        Row: {
          article_id: string
          tag_id: number
        }
        Insert: {
          article_id: string
          tag_id: number
        }
        Update: {
          article_id?: string
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "article_tag_maps_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_tag_maps_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          created_at: string
          id: string
          journal_name: string | null
          link: string
          publication_date: string | null
          summary: string | null
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          journal_name?: string | null
          link: string
          publication_date?: string | null
          summary?: string | null
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          journal_name?: string | null
          link?: string
          publication_date?: string | null
          summary?: string | null
          title?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          description: string | null
          id: string
          level_1_discipline: string
          level_2_field: string
          level_3_specialization: string | null
          level_4_subspecialization: string | null
        }
        Insert: {
          description?: string | null
          id: string
          level_1_discipline: string
          level_2_field: string
          level_3_specialization?: string | null
          level_4_subspecialization?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          level_1_discipline?: string
          level_2_field?: string
          level_3_specialization?: string | null
          level_4_subspecialization?: string | null
        }
        Relationships: []
      }
      collection_articles: {
        Row: {
          added_at: string
          article_id: string
          collection_id: string
          id: string
        }
        Insert: {
          added_at?: string
          article_id: string
          collection_id: string
          id?: string
        }
        Update: {
          added_at?: string
          article_id?: string
          collection_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_articles_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ingestion_logs: {
        Row: {
          created_at: string
          error_message: string | null
          id: string | null
          log_id: number
          source_url: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string | null
          log_id?: number
          source_url?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string | null
          log_id?: number
          source_url?: string | null
        }
        Relationships: []
      }
      ingestion_sources: {
        Row: {
          id: string
          source_name: string | null
          source_url: string
          tags: string | null
          ticker_symbol: string | null
        }
        Insert: {
          id: string
          source_name?: string | null
          source_url: string
          tags?: string | null
          ticker_symbol?: string | null
        }
        Update: {
          id?: string
          source_name?: string | null
          source_url?: string
          tags?: string | null
          ticker_symbol?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ingestion_sources_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ingestion_sources_ticker_symbol_fkey"
            columns: ["ticker_symbol"]
            isOneToOne: false
            referencedRelation: "journal_metadata"
            referencedColumns: ["ticker_symbol"]
          },
        ]
      }
      journal_metadata: {
        Row: {
          access_url: string | null
          id: number
          source_name: string
          source_url: string | null
          ticker_symbol: string | null
        }
        Insert: {
          access_url?: string | null
          id?: number
          source_name: string
          source_url?: string | null
          ticker_symbol?: string | null
        }
        Update: {
          access_url?: string | null
          id?: number
          source_name?: string
          source_url?: string | null
          ticker_symbol?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: number
          tags: string
        }
        Insert: {
          id?: number
          tags: string
        }
        Update: {
          id?: number
          tags?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          discovery_feed_settings: Json | null
          id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discovery_feed_settings?: Json | null
          id?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          discovery_feed_settings?: Json | null
          id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_saved_articles: {
        Row: {
          article_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          article_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          article_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_saved_articles_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
