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
      businesses: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string
          industry: string
          address: string | null
          verified: boolean
          subscription_tier: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          phone: string
          industry: string
          address?: string | null
          verified?: boolean
          subscription_tier?: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          phone?: string
          industry?: string
          address?: string | null
          verified?: boolean
          subscription_tier?: string
        }
      }
      jobs: {
        Row: {
          id: string
          created_at: string
          business_id: string
          title: string
          description: string
          location: string
          type: string
          salary_range: string | null
          requirements: string[]
          status: string
          expires_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          business_id: string
          title: string
          description: string
          location: string
          type: string
          salary_range?: string | null
          requirements?: string[]
          status?: string
          expires_at: string
        }
        Update: {
          id?: string
          created_at?: string
          business_id?: string
          title?: string
          description?: string
          location?: string
          type?: string
          salary_range?: string | null
          requirements?: string[]
          status?: string
          expires_at?: string
        }
      }
      staff_profiles: {
        Row: {
          id: string
          created_at: string
          user_id: string
          full_name: string
          email: string
          phone: string
          location: string
          experience_years: number
          certifications: string[]
          skills: string[]
          availability: string
          verified: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          full_name: string
          email: string
          phone: string
          location: string
          experience_years: number
          certifications?: string[]
          skills?: string[]
          availability?: string
          verified?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          full_name?: string
          email?: string
          phone?: string
          location?: string
          experience_years?: number
          certifications?: string[]
          skills?: string[]
          availability?: string
          verified?: boolean
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
