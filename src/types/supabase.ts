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
      reservations: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          date: string
          start_time: string
          end_time: string
          guests: number
          special_requests: string | null
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at: string
          updated_at: string
          invoice_number: string | null
          language: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          date: string
          start_time: string
          end_time: string
          guests: number
          special_requests?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at?: string
          updated_at?: string
          invoice_number?: string | null
          language?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          date?: string
          start_time?: string
          end_time?: string
          guests?: number
          special_requests?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at?: string
          updated_at?: string
          invoice_number?: string | null
          language?: string
        }
        Relationships: []
      }
      holidays: {
        Row: {
          id: string
          name: string
          description: string | null
          notes: string | null
          start_date: string
          end_date: string
          is_recurring: boolean
          recurrence_pattern: Json | null
          recurrence_end_date: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          notes?: string | null
          start_date: string
          end_date: string
          is_recurring?: boolean
          recurrence_pattern?: Json | null
          recurrence_end_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          notes?: string | null
          start_date?: string
          end_date?: string
          is_recurring?: boolean
          recurrence_pattern?: Json | null
          recurrence_end_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
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

// Type helpers for the reservations table
export type Reservation = Database['public']['Tables']['reservations']['Row']
export type ReservationInsert = Database['public']['Tables']['reservations']['Insert']
export type ReservationUpdate = Database['public']['Tables']['reservations']['Update']

// Type helpers for the holidays table
export type Holiday = Database['public']['Tables']['holidays']['Row']
export type HolidayInsert = Database['public']['Tables']['holidays']['Insert']
export type HolidayUpdate = Database['public']['Tables']['holidays']['Update']
