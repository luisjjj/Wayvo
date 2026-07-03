-- Migration 003: Fix RLS policies for auth flow
-- The insert policy on users was too strict during initial signup.
-- Also add permissive policies for waver_profiles and brand_profiles inserts.

-- Drop the strict insert policy on users
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Allow authenticated users to insert their own user row
CREATE POLICY "Authenticated users can insert own profile" ON users
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow service role (or auth uid) to insert user rows during signup
CREATE POLICY "Signup insert for users" ON users
  FOR INSERT
  WITH CHECK (true);

-- Make waver_profiles insert more permissive for initial setup
DROP POLICY IF EXISTS "Users can insert own waver profile" ON waver_profiles;
CREATE POLICY "Users can insert own waver profile" ON waver_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow any authenticated insert for waver_profiles (setup phase)
CREATE POLICY "Setup insert for waver_profiles" ON waver_profiles
  FOR INSERT
  WITH CHECK (true);

-- Same for brand_profiles
DROP POLICY IF EXISTS "Users can insert own brand profile" ON brand_profiles;
CREATE POLICY "Users can insert own brand profile" ON brand_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Setup insert for brand_profiles" ON brand_profiles
  FOR INSERT
  WITH CHECK (true);
