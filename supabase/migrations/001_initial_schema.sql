-- Wayvo Database Schema
-- Run this migration to create all tables

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- ============================================
-- TABLES
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  active_mode VARCHAR(10) DEFAULT 'waver' CHECK (active_mode IN ('waver', 'brand')),
  is_brand BOOLEAN DEFAULT false,
  is_waver BOOLEAN DEFAULT true,
  subscription_plan VARCHAR(20) DEFAULT 'free' CHECK (subscription_plan IN ('free', 'creator', 'brand_pro')),
  subscription_status VARCHAR(20) DEFAULT 'inactive',
  paystack_customer_code VARCHAR(100),
  paystack_subscription_code VARCHAR(100),
  push_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Waver profiles table
CREATE TABLE IF NOT EXISTS waver_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  niche_tags TEXT[] DEFAULT '{}',
  location VARCHAR(100),
  wayvo_score INTEGER DEFAULT 0,
  score_rank VARCHAR(20),
  avg_views INTEGER DEFAULT 0,
  completion_rate DECIMAL(5,2) DEFAULT 0,
  posting_speed_score DECIMAL(5,2) DEFAULT 0,
  brand_rating_avg DECIMAL(3,2) DEFAULT 0,
  total_campaigns_completed INTEGER DEFAULT 0,
  total_earned BIGINT DEFAULT 0,
  wallet_balance BIGINT DEFAULT 0,
  bank_name VARCHAR(100),
  bank_account_number VARCHAR(20),
  bank_account_name VARCHAR(255),
  paystack_recipient_code VARCHAR(100),
  instagram_handle VARCHAR(100),
  tiktok_handle VARCHAR(100),
  youtube_handle VARCHAR(100),
  facebook_handle VARCHAR(100),
  whatsapp_number VARCHAR(20),
  ig_avg_views INTEGER DEFAULT 0,
  tiktok_avg_views INTEGER DEFAULT 0,
  platforms TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brand profiles table
CREATE TABLE IF NOT EXISTS brand_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  industry VARCHAR(100),
  website VARCHAR(255),
  description TEXT,
  is_verified BOOLEAN DEFAULT false,
  total_campaigns_run INTEGER DEFAULT 0,
  total_spent BIGINT DEFAULT 0,
  paystack_customer_code VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  brief TEXT NOT NULL,
  suggested_caption TEXT,
  target_niche TEXT[] DEFAULT '{}',
  platforms TEXT[] NOT NULL,
  total_budget BIGINT NOT NULL,
  wayvo_fee BIGINT NOT NULL,
  waver_pool BIGINT NOT NULL,
  per_waver_payout BIGINT NOT NULL,
  num_wavers INTEGER NOT NULL,
  min_views INTEGER DEFAULT 500,
  duration_days INTEGER DEFAULT 7,
  status VARCHAR(30) DEFAULT 'draft' 
    CHECK (status IN ('draft','pending_payment','active','in_progress','completed','cancelled','expired')),
  paystack_reference VARCHAR(100),
  payment_status VARCHAR(20) DEFAULT 'pending',
  escrow_held BOOLEAN DEFAULT false,
  asset_urls TEXT[] DEFAULT '{}',
  location_target VARCHAR(100),
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign assignments table
CREATE TABLE IF NOT EXISTS campaign_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  waver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(30) DEFAULT 'assigned'
    CHECK (status IN ('assigned','accepted','posted','proof_submitted','proof_approved','proof_rejected','paid','expired','cancelled')),
  accepted_at TIMESTAMPTZ,
  posted_at TIMESTAMPTZ,
  proof_submitted_at TIMESTAMPTZ,
  proof_approved_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  payout_amount BIGINT,
  paystack_transfer_code VARCHAR(100),
  wayvo_score_at_assignment INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, waver_id)
);

-- Proof submissions table
CREATE TABLE IF NOT EXISTS proof_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES campaign_assignments(id) ON DELETE CASCADE,
  waver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  proof_type VARCHAR(20) CHECK (proof_type IN ('screenshot', 'screen_recording')),
  file_url TEXT NOT NULL,
  platform VARCHAR(30) NOT NULL,
  ocr_views_extracted INTEGER,
  ocr_reach_extracted INTEGER,
  ocr_interactions_extracted INTEGER,
  ocr_confidence DECIMAL(5,2),
  fraud_flagged BOOLEAN DEFAULT false,
  fraud_reason TEXT,
  verification_status VARCHAR(20) DEFAULT 'pending'
    CHECK (verification_status IN ('pending','auto_approved','manual_review','approved','rejected')),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES campaign_assignments(id) ON DELETE CASCADE,
  waver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  reminder_type VARCHAR(30) CHECK (reminder_type IN ('day_1','day_3','day_7','overdue','proof_pending')),
  channel VARCHAR(20) CHECK (channel IN ('whatsapp','sms','push')),
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled','sent','failed')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wallet transactions table
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(30) CHECK (type IN ('credit','debit','withdrawal','payout','refund')),
  amount BIGINT NOT NULL,
  balance_before BIGINT NOT NULL,
  balance_after BIGINT NOT NULL,
  reference VARCHAR(100) UNIQUE,
  description TEXT,
  campaign_id UUID REFERENCES campaigns(id),
  assignment_id UUID REFERENCES campaign_assignments(id),
  paystack_transfer_code VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','success','failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  type VARCHAR(50),
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brand ratings table
CREATE TABLE IF NOT EXISTS brand_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES users(id),
  waver_id UUID REFERENCES users(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, waver_id)
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  paystack_subscription_code VARCHAR(100),
  paystack_email_token VARCHAR(100),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_waver_profiles_user_id ON waver_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_waver_profiles_score ON waver_profiles(wayvo_score DESC);
CREATE INDEX IF NOT EXISTS idx_brand_profiles_user_id ON brand_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_brand_id ON campaigns(brand_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_platforms ON campaigns USING GIN(platforms);
CREATE INDEX IF NOT EXISTS idx_campaigns_niche ON campaigns USING GIN(target_niche);
CREATE INDEX IF NOT EXISTS idx_campaign_assignments_campaign_id ON campaign_assignments(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_assignments_waver_id ON campaign_assignments(waver_id);
CREATE INDEX IF NOT EXISTS idx_campaign_assignments_status ON campaign_assignments(status);
CREATE INDEX IF NOT EXISTS idx_proof_submissions_assignment_id ON proof_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_reminders_scheduled_at ON reminders(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_reminders_status ON reminders(status);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE waver_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE proof_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Waver profiles policies
CREATE POLICY "Waver profiles are publicly readable" ON waver_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own waver profile" ON waver_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own waver profile" ON waver_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Brand profiles policies
CREATE POLICY "Brand profiles are publicly readable" ON brand_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own brand profile" ON brand_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own brand profile" ON brand_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Campaigns policies
CREATE POLICY "Brands can view own campaigns" ON campaigns
  FOR SELECT USING (auth.uid() = brand_id);

CREATE POLICY "Wavers can view active campaigns" ON campaigns
  FOR SELECT USING (status = 'active' OR status = 'in_progress');

CREATE POLICY "Brands can create campaigns" ON campaigns
  FOR INSERT WITH CHECK (auth.uid() = brand_id);

CREATE POLICY "Brands can update own campaigns" ON campaigns
  FOR UPDATE USING (auth.uid() = brand_id);

-- Campaign assignments policies
CREATE POLICY "Wavers can view own assignments" ON campaign_assignments
  FOR SELECT USING (auth.uid() = waver_id);

CREATE POLICY "Brands can view assignments for their campaigns" ON campaign_assignments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = campaign_assignments.campaign_id 
      AND campaigns.brand_id = auth.uid()
    )
  );

CREATE POLICY "System can create assignments" ON campaign_assignments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Wavers can update own assignments" ON campaign_assignments
  FOR UPDATE USING (auth.uid() = waver_id);

-- Proof submissions policies
CREATE POLICY "Wavers can view own submissions" ON proof_submissions
  FOR SELECT USING (auth.uid() = waver_id);

CREATE POLICY "Brands can view submissions for their campaigns" ON proof_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = proof_submissions.campaign_id 
      AND campaigns.brand_id = auth.uid()
    )
  );

CREATE POLICY "Wavers can create submissions" ON proof_submissions
  FOR INSERT WITH CHECK (auth.uid() = waver_id);

-- Wallet transactions policies
CREATE POLICY "Users can view own transactions" ON wallet_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own transactions" ON wallet_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Brand ratings policies
CREATE POLICY "Ratings are publicly readable" ON brand_ratings
  FOR SELECT USING (true);

CREATE POLICY "Wavers can create ratings" ON brand_ratings
  FOR INSERT WITH CHECK (auth.uid() = waver_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Reminders policies
CREATE POLICY "Reminders are system managed" ON reminders
  FOR ALL USING (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Calculate Wayvo Score function
CREATE OR REPLACE FUNCTION calculate_wayvo_score(waver_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  avg_views_score DECIMAL;
  completion_score DECIMAL;
  speed_score DECIMAL;
  rating_score DECIMAL;
  final_score INTEGER;
BEGIN
  -- Component 1: Average verified views (40% weight, max 400 points)
  SELECT LEAST(400, (AVG(ps.ocr_views_extracted) / 1000.0) * 400)
  INTO avg_views_score
  FROM proof_submissions ps
  JOIN campaign_assignments ca ON ps.assignment_id = ca.id
  WHERE ca.waver_id = waver_uuid
  AND ps.verification_status = 'approved';

  -- Component 2: Completion rate (30% weight, max 300 points)
  SELECT LEAST(300, (
    COUNT(CASE WHEN ca.status = 'paid' THEN 1 END)::DECIMAL /
    NULLIF(COUNT(*), 0) * 300
  ))
  INTO completion_score
  FROM campaign_assignments ca
  WHERE ca.waver_id = waver_uuid
  AND ca.status NOT IN ('assigned', 'cancelled');

  -- Component 3: Posting speed (15% weight, max 150 points)
  SELECT LEAST(150, AVG(
    CASE
      WHEN EXTRACT(EPOCH FROM (ca.posted_at - ca.accepted_at)) < 43200 THEN 150
      WHEN EXTRACT(EPOCH FROM (ca.posted_at - ca.accepted_at)) < 86400 THEN 100
      ELSE 50
    END
  ))
  INTO speed_score
  FROM campaign_assignments ca
  WHERE ca.waver_id = waver_uuid
  AND ca.posted_at IS NOT NULL;

  -- Component 4: Brand rating (15% weight, max 150 points)
  SELECT LEAST(150, AVG(br.rating) / 5.0 * 150)
  INTO rating_score
  FROM brand_ratings br
  WHERE br.waver_id = waver_uuid;

  final_score := COALESCE(avg_views_score, 0) +
                 COALESCE(completion_score, 0) +
                 COALESCE(speed_score, 0) +
                 COALESCE(rating_score, 0);

  UPDATE waver_profiles SET wayvo_score = final_score WHERE user_id = waver_uuid;

  RETURN final_score;
END;
$$ LANGUAGE plpgsql;

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_campaign_assignments_updated_at
  BEFORE UPDATE ON campaign_assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
