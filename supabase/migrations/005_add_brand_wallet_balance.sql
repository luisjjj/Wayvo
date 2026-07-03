-- Add wallet balance to brand profiles
ALTER TABLE brand_profiles ADD COLUMN IF NOT EXISTS wallet_balance BIGINT DEFAULT 0;
