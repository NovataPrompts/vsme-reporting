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
      consol: {
        Row: {
          created_at: string
          definition_summary: string | null
          disclosure: string | null
          display_order: number | null
          id: string
          input_type: string | null
          metric: string | null
          novata_reference: string | null
          question: string | null
          response_options: string | null
          section: string | null
          sub_section: string | null
          topic: string | null
          unit: string | null
          updated_at: string
          vsme_reference: string | null
        }
        Insert: {
          created_at?: string
          definition_summary?: string | null
          disclosure?: string | null
          display_order?: number | null
          id?: string
          input_type?: string | null
          metric?: string | null
          novata_reference?: string | null
          question?: string | null
          response_options?: string | null
          section?: string | null
          sub_section?: string | null
          topic?: string | null
          unit?: string | null
          updated_at?: string
          vsme_reference?: string | null
        }
        Update: {
          created_at?: string
          definition_summary?: string | null
          disclosure?: string | null
          display_order?: number | null
          id?: string
          input_type?: string | null
          metric?: string | null
          novata_reference?: string | null
          question?: string | null
          response_options?: string | null
          section?: string | null
          sub_section?: string | null
          topic?: string | null
          unit?: string | null
          updated_at?: string
          vsme_reference?: string | null
        }
        Relationships: []
      }
      disclosure_detail: {
        Row: {
          created_at: string
          disclosure: string | null
          id: string
          novata_reference: string | null
          number: string | null
          paragraph: string | null
          sub_paragraph: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          disclosure?: string | null
          id?: string
          novata_reference?: string | null
          number?: string | null
          paragraph?: string | null
          sub_paragraph?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          disclosure?: string | null
          id?: string
          novata_reference?: string | null
          number?: string | null
          paragraph?: string | null
          sub_paragraph?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      section_info: {
        Row: {
          created_at: string
          disclosure: string | null
          id: string
          section: string | null
          sub_section: string | null
          topic: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          disclosure?: string | null
          id?: string
          section?: string | null
          sub_section?: string | null
          topic?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          disclosure?: string | null
          id?: string
          section?: string | null
          sub_section?: string | null
          topic?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tabular_data: {
        Row: {
          column_order: string[] | null
          created_at: string
          data: Json
          id: string
          novata_reference: string
          original_filename: string | null
          sheet_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          column_order?: string[] | null
          created_at?: string
          data: Json
          id?: string
          novata_reference: string
          original_filename?: string | null
          sheet_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          column_order?: string[] | null
          created_at?: string
          data?: Json
          id?: string
          novata_reference?: string
          original_filename?: string | null
          sheet_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vsme_novata_ref_converter: {
        Row: {
          created_at: string
          id: string
          novata_reference: string | null
          order: number | null
          updated_at: string
          vsme_reference: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          novata_reference?: string | null
          order?: number | null
          updated_at?: string
          vsme_reference?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          novata_reference?: string | null
          order?: number | null
          updated_at?: string
          vsme_reference?: string | null
        }
        Relationships: []
      }
      vsme_report_content: {
        Row: {
          created_at: string
          definition_summary: string | null
          id: string
          input_type: string | null
          metric: string | null
          novata_reference: string | null
          question: string | null
          response_options: string | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          definition_summary?: string | null
          id?: string
          input_type?: string | null
          metric?: string | null
          novata_reference?: string | null
          question?: string | null
          response_options?: string | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          definition_summary?: string | null
          id?: string
          input_type?: string | null
          metric?: string | null
          novata_reference?: string | null
          question?: string | null
          response_options?: string | null
          unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      vsme_user_responses: {
        Row: {
          created_at: string
          id: string
          metric_id: string
          response_data: Json | null
          response_value: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric_id: string
          response_data?: Json | null
          response_value?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metric_id?: string
          response_data?: Json | null
          response_value?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vsme_user_responses_metric_id_fkey"
            columns: ["metric_id"]
            isOneToOne: false
            referencedRelation: "consol"
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
    Enums: {},
  },
} as const
