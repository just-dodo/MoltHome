-- Rename users table to profiles
ALTER TABLE molthome.users RENAME TO profiles;

-- Rename indexes
ALTER INDEX molthome.idx_users_email RENAME TO idx_profiles_email;
ALTER INDEX molthome.idx_users_google_id RENAME TO idx_profiles_google_id;

-- Drop old policies
DROP POLICY IF EXISTS "Users can view own profile" ON molthome.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON molthome.profiles;

-- Recreate policies with INSERT
CREATE POLICY "Users can view own profile" ON molthome.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON molthome.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON molthome.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Update trigger
DROP TRIGGER IF EXISTS users_updated_at ON molthome.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON molthome.profiles
  FOR EACH ROW EXECUTE FUNCTION molthome.handle_updated_at();

-- Update handle_new_user function to reference profiles
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
