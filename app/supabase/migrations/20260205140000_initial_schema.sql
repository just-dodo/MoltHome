-- 001_initial_schema.sql
-- MoltHome Database Schema (molthome schema)

-- Create molthome schema
CREATE SCHEMA IF NOT EXISTS molthome;

-- Grant usage to authenticated and anon roles
GRANT USAGE ON SCHEMA molthome TO authenticated, anon;

-- Set search path to include molthome schema
ALTER DATABASE postgres SET search_path TO molthome, public;

-- Profiles table
CREATE TABLE molthome.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  google_id TEXT UNIQUE,
  tier TEXT DEFAULT 'starter' CHECK (tier IN ('starter', 'pro')),
  paddle_customer_id TEXT,
  paddle_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'none' CHECK (subscription_status IN ('active', 'paused', 'cancelled', 'none')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Instances table
CREATE TABLE molthome.instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES molthome.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  gcp_instance_name TEXT UNIQUE NOT NULL,
  zone TEXT NOT NULL DEFAULT 'us-central1-a',
  machine_type TEXT NOT NULL DEFAULT 'e2-small',
  status TEXT DEFAULT 'provisioning' CHECK (status IN ('provisioning', 'running', 'stopped', 'error', 'deleted')),
  external_ip TEXT,
  gateway_token TEXT NOT NULL,
  deployment_log JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Channels table
CREATE TABLE molthome.channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID REFERENCES molthome.instances(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('telegram', 'discord')),
  config JSONB NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Keys table (supports Anthropic, OpenAI, Gemini)
CREATE TABLE molthome.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES molthome.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('anthropic', 'openai', 'gemini')),
  encrypted_value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_email ON molthome.profiles(email);
CREATE INDEX idx_profiles_google_id ON molthome.profiles(google_id);
CREATE INDEX idx_instances_user_id ON molthome.instances(user_id);
CREATE INDEX idx_instances_status ON molthome.instances(status);
CREATE INDEX idx_channels_instance_id ON molthome.channels(instance_id);
CREATE INDEX idx_api_keys_user_id ON molthome.api_keys(user_id);

-- Enable RLS on all tables
ALTER TABLE molthome.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE molthome.instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE molthome.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE molthome.api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON molthome.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON molthome.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON molthome.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own instances" ON molthome.instances
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage channels via instance" ON molthome.channels
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM molthome.instances
      WHERE instances.id = channels.instance_id
      AND instances.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own API keys" ON molthome.api_keys
  FOR ALL USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION molthome.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO molthome.profiles (id, email, name, avatar_url, google_id)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'provider_id'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION molthome.handle_new_user();

-- Updated at trigger
CREATE OR REPLACE FUNCTION molthome.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON molthome.profiles
  FOR EACH ROW EXECUTE FUNCTION molthome.handle_updated_at();

CREATE TRIGGER instances_updated_at
  BEFORE UPDATE ON molthome.instances
  FOR EACH ROW EXECUTE FUNCTION molthome.handle_updated_at();

CREATE TRIGGER channels_updated_at
  BEFORE UPDATE ON molthome.channels
  FOR EACH ROW EXECUTE FUNCTION molthome.handle_updated_at();

-- Grant table permissions for RLS to work with custom schema
GRANT ALL ON ALL TABLES IN SCHEMA molthome TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA molthome TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA molthome TO anon;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA molthome
  GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA molthome
  GRANT ALL ON SEQUENCES TO authenticated;
