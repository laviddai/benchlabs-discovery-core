export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      article_categories: {
        Row: {
          article_id: string
          assignment_type: string | null
          category_id: string
          confidence_score: number | null
          created_at: string | null
          id: string
        }
        Insert: {
          article_id: string
          assignment_type?: string | null
          category_id: string
          confidence_score?: number | null
          created_at?: string | null
          id?: string
        }
        Update: {
          article_id?: string
          assignment_type?: string | null
          category_id?: string
          confidence_score?: number | null
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_categories_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_categories_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles_with_metadata"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      article_tags: {
        Row: {
          article_id: string
          created_at: string | null
          id: string
          relevance_score: number | null
          tag_id: string
        }
        Insert: {
          article_id: string
          created_at?: string | null
          id?: string
          relevance_score?: number | null
          tag_id: string
        }
        Update: {
          article_id?: string
          created_at?: string | null
          id?: string
          relevance_score?: number | null
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_tags_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_tags_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles_with_metadata"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          all_tags: string[] | null
          author: string | null
          category_id: string | null
          confidence_score: number | null
          content_analysis: Json | null
          created_at: string
          id: string
          journal_name: string | null
          level_1_discipline: string | null
          level_2_field: string | null
          link: string
          publication_date: string | null
          summary: string | null
          ticker_symbol: string | null
          title: string
        }
        Insert: {
          all_tags?: string[] | null
          author?: string | null
          category_id?: string | null
          confidence_score?: number | null
          content_analysis?: Json | null
          created_at?: string
          id?: string
          journal_name?: string | null
          level_1_discipline?: string | null
          level_2_field?: string | null
          link: string
          publication_date?: string | null
          summary?: string | null
          ticker_symbol?: string | null
          title: string
        }
        Update: {
          all_tags?: string[] | null
          author?: string | null
          category_id?: string | null
          confidence_score?: number | null
          content_analysis?: Json | null
          created_at?: string
          id?: string
          journal_name?: string | null
          level_1_discipline?: string | null
          level_2_field?: string | null
          link?: string
          publication_date?: string | null
          summary?: string | null
          ticker_symbol?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color_hex: string | null
          created_at: string | null
          description: string
          id: string
          is_active: boolean | null
          level_1_discipline: string
          level_2_field: string
          name: string
        }
        Insert: {
          color_hex?: string | null
          created_at?: string | null
          description: string
          id: string
          is_active?: boolean | null
          level_1_discipline: string
          level_2_field: string
          name: string
        }
        Update: {
          color_hex?: string | null
          created_at?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          level_1_discipline?: string
          level_2_field?: string
          name?: string
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
      tags: {
        Row: {
          category_hint: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          usage_count: number | null
        }
        Insert: {
          category_hint?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          usage_count?: number | null
        }
        Update: {
          category_hint?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          discovery_feed_settings: Json | null
          display_name: string | null
          id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discovery_feed_settings?: Json | null
          display_name?: string | null
          id?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          discovery_feed_settings?: Json | null
          display_name?: string | null
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
          {
            foreignKeyName: "user_saved_articles_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles_with_metadata"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      articles_with_metadata: {
        Row: {
          all_tags: string[] | null
          author: string | null
          category_color: string | null
          category_description: string | null
          category_id: string | null
          category_name: string | null
          combined_tags: string[] | null
          confidence_score: number | null
          content_analysis: Json | null
          created_at: string | null
          id: string | null
          journal_name: string | null
          level_1_discipline: string | null
          level_2_field: string | null
          link: string | null
          publication_date: string | null
          summary: string | null
          ticker_symbol: string | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      category_stats: {
        Row: {
          article_count: number | null
          color_hex: string | null
          created_at: string | null
          description: string | null
          id: string | null
          is_active: boolean | null
          level_1_discipline: string | null
          level_2_field: string | null
          name: string | null
          recent_articles: number | null
        }
        Relationships: []
      }
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
