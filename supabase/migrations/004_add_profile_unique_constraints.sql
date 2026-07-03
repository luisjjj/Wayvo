-- Add UNIQUE constraints on user_id for profile tables
-- This enables upsert with onConflict: 'user_id'

ALTER TABLE waver_profiles ADD CONSTRAINT waver_profiles_user_id_unique UNIQUE (user_id);
ALTER TABLE brand_profiles ADD CONSTRAINT brand_profiles_user_id_unique UNIQUE (user_id);
