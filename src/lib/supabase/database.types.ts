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
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: 'media_town' | 'media_main' | 'pastor' | 'admin'
          campus: 'kabwe' | 'main' | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          role: 'media_town' | 'media_main' | 'pastor' | 'admin'
          campus?: 'kabwe' | 'main' | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'media_town' | 'media_main' | 'pastor' | 'admin'
          campus?: 'kabwe' | 'main' | null
          created_at?: string
        }
      }
      gallery: {
        Row: {
          id: string
          image_url: string
          title: string
          campus: 'kabwe' | 'main'
          is_featured: boolean
          uploaded_by: string
          created_at: string
        }
        Insert: {
          id?: string
          image_url: string
          title: string
          campus: 'kabwe' | 'main'
          is_featured?: boolean
          uploaded_by: string
          created_at?: string
        }
        Update: {
          id?: string
          image_url?: string
          title?: string
          campus?: 'kabwe' | 'main'
          is_featured?: boolean
          uploaded_by?: string
          created_at?: string
        }
      }
      highlights: {
        Row: {
          id: string
          title: string
          video_url: string
          thumbnail: string
          description: string | null
          campus: 'kabwe' | 'main'
          is_featured: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          video_url: string
          thumbnail: string
          description?: string | null
          campus: 'kabwe' | 'main'
          is_featured?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          video_url?: string
          thumbnail?: string
          description?: string | null
          campus?: 'kabwe' | 'main'
          is_featured?: boolean
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          date: string
          description: string | null
          image: string
          campus: 'kabwe' | 'main'
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          date: string
          description?: string | null
          image: string
          campus: 'kabwe' | 'main'
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          date?: string
          description?: string | null
          image?: string
          campus?: 'kabwe' | 'main'
          created_at?: string
        }
      }
      testimonies: {
        Row: {
          id: string
          quote: string
          author: string
          image_url: string | null
          campus: string
          created_at: string
        }
        Insert: {
          id?: string
          quote: string
          author: string
          image_url?: string | null
          campus: string
          created_at?: string
        }
        Update: {
          id?: string
          quote?: string
          author?: string
          image_url?: string | null
          campus?: string
          created_at?: string
        }
      }
      visitors: {
        Row: {
          id: string
          name: string
          sex: 'Male' | 'Female'
          contact: string
          program_year: string
          hostel: string
          campus: 'kabwe' | 'main'
          needs_help: boolean
          needs_prayer: boolean
          is_new_soul: boolean
          date_recorded: string
          recorded_by: string
          follow_up_status: 'not_contacted' | 'contacted' | 'followed_up'
          notes: string
        }
        Insert: {
          id?: string
          name: string
          sex: 'Male' | 'Female'
          contact: string
          program_year: string
          hostel?: string
          campus: 'kabwe' | 'main'
          needs_help?: boolean
          needs_prayer?: boolean
          is_new_soul?: boolean
          date_recorded?: string
          recorded_by?: string
          follow_up_status?: 'not_contacted' | 'contacted' | 'followed_up'
          notes?: string
        }
        Update: {
          id?: string
          name?: string
          sex?: 'Male' | 'Female'
          contact?: string
          program_year?: string
          hostel?: string
          campus?: 'kabwe' | 'main'
          needs_help?: boolean
          needs_prayer?: boolean
          is_new_soul?: boolean
          date_recorded?: string
          recorded_by?: string
          follow_up_status?: 'not_contacted' | 'contacted' | 'followed_up'
          notes?: string
        }
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
  }
}
