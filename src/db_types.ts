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
      awards: {
        Row: {
          description: string | null
          icon_url: string | null
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          icon_url?: string | null
          id?: number
          name: string
        }
        Update: {
          description?: string | null
          icon_url?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      rides: {
        Row: {
          bike_qr_scanned: string
          distance: number | null
          distance_img: string | null
          id: string
          ride_date: string | null
          student_id: string | null
        }
        Insert: {
          bike_qr_scanned: string
          distance?: number | null
          distance_img?: string | null
          id?: string
          ride_date?: string | null
          student_id?: string | null
        }
        Update: {
          bike_qr_scanned?: string
          distance?: number | null
          distance_img?: string | null
          id?: string
          ride_date?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rides_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_awards: {
        Row: {
          awarded_at: string | null
          badge_id: number
          created_at: string | null
          id: number
          student_id: string | null
        }
        Insert: {
          awarded_at?: string | null
          badge_id: number
          created_at?: string | null
          id?: number
          student_id?: string | null
        }
        Update: {
          awarded_at?: string | null
          badge_id?: number
          created_at?: string | null
          id?: number
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_awards_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "awards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_awards_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          totalDistance(totalDistance: number): unknown
          ride_count: number
          address: string
          bike_qr_code: string | null
          class: string
          distance_img: string | null
          distance_to_school: number
          email: string
          hasSeenFirstAwardModal: boolean | null
          hasSeenPrivacyDialog: boolean | null
          id: string
          is_active: boolean | null
          lat: number | null
          lng: number | null
          name: string
          password: string
          profile_pic_url: string | null
          starting_year: number
        }
        Insert: {
          address: string
          bike_qr_code?: string | null
          class: string
          distance_img?: string | null
          distance_to_school: number
          email: string
          hasSeenFirstAwardModal?: boolean | null
          hasSeenPrivacyDialog?: boolean | null
          id: string
          is_active?: boolean | null
          lat?: number | null
          lng?: number | null
          name: string
          password: string
          profile_pic_url?: string | null
          starting_year: number
        }
        Update: {
          address?: string
          bike_qr_code?: string | null
          class?: string
          distance_img?: string | null
          distance_to_school?: number
          email?: string
          hasSeenFirstAwardModal?: boolean | null
          hasSeenPrivacyDialog?: boolean | null
          id?: string
          is_active?: boolean | null
          lat?: number | null
          lng?: number | null
          name?: string
          password?: string
          profile_pic_url?: string | null
          starting_year?: number
        }
        Relationships: []
      }
      teachers: {
        Row: {
          created_at: string
          id: string
          name: string | null
          password: string | null
          profile_pic_url: string | null
        }
        Insert: {
          created_at?: string
          id: string
          name?: string | null
          password?: string | null
          profile_pic_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          password?: string | null
          profile_pic_url?: string | null
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
