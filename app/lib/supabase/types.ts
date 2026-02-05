export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  molthome: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          google_id: string | null
          tier: 'starter' | 'pro'
          paddle_customer_id: string | null
          paddle_subscription_id: string | null
          subscription_status: 'active' | 'paused' | 'cancelled' | 'none'
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          google_id?: string | null
          tier?: 'starter' | 'pro'
          paddle_customer_id?: string | null
          paddle_subscription_id?: string | null
          subscription_status?: 'active' | 'paused' | 'cancelled' | 'none'
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          google_id?: string | null
          tier?: 'starter' | 'pro'
          paddle_customer_id?: string | null
          paddle_subscription_id?: string | null
          subscription_status?: 'active' | 'paused' | 'cancelled' | 'none'
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      instances: {
        Row: {
          id: string
          user_id: string
          name: string
          gcp_instance_name: string
          zone: string
          machine_type: string
          status: 'provisioning' | 'running' | 'stopped' | 'error' | 'deleted'
          external_ip: string | null
          gateway_token: string
          deployment_log: Json | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          gcp_instance_name: string
          zone?: string
          machine_type?: string
          status?: 'provisioning' | 'running' | 'stopped' | 'error' | 'deleted'
          external_ip?: string | null
          gateway_token: string
          deployment_log?: Json | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          gcp_instance_name?: string
          zone?: string
          machine_type?: string
          status?: 'provisioning' | 'running' | 'stopped' | 'error' | 'deleted'
          external_ip?: string | null
          gateway_token?: string
          deployment_log?: Json | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      channels: {
        Row: {
          id: string
          instance_id: string
          type: 'telegram' | 'discord'
          config: Json
          status: 'active' | 'inactive' | 'error'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          instance_id: string
          type: 'telegram' | 'discord'
          config: Json
          status?: 'active' | 'inactive' | 'error'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          instance_id?: string
          type?: 'telegram' | 'discord'
          config?: Json
          status?: 'active' | 'inactive' | 'error'
          created_at?: string
          updated_at?: string
        }
      }
      api_keys: {
        Row: {
          id: string
          user_id: string
          name: string
          type: 'anthropic' | 'openai' | 'gemini'
          encrypted_value: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: 'anthropic' | 'openai' | 'gemini'
          encrypted_value: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: 'anthropic' | 'openai' | 'gemini'
          encrypted_value?: string
          created_at?: string
        }
      }
    }
  }
}
