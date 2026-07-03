-- Wayvo Seed Data
-- Run this after migrations to populate test data

-- Test Brand Account: Grillspot Abuja
INSERT INTO users (id, phone, full_name, active_mode, is_brand, is_waver, subscription_plan, subscription_status)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '+2348012345678',
  'Grillspot Admin',
  'brand',
  true,
  false,
  'free',
  'active'
);

INSERT INTO brand_profiles (user_id, business_name, industry, description, is_verified)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Grillspot Abuja',
  'Food',
  'Premium grilled food and BBQ restaurant in Abuja. We serve the best suya, chicken, and fish in town!',
  true
);

-- Test Waver Accounts
INSERT INTO users (id, phone, full_name, active_mode, is_brand, is_waver, subscription_plan, subscription_status)
VALUES
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567891', '+2348012345679', 'Adaobi Nwosu', 'waver', false, true, 'free', 'active'),
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567892', '+2348012345680', 'Tunde Bakare', 'waver', false, true, 'free', 'active'),
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567893', '+2348012345681', 'Fatima Abubakar', 'waver', false, true, 'creator', 'active'),
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567894', '+2348012345682', 'Emeka Okonkwo', 'waver', false, true, 'free', 'active'),
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567895', '+2348012345683', 'Aisha Mohammed', 'waver', false, true, 'free', 'active');

-- Waver Profiles with varying scores
INSERT INTO waver_profiles (user_id, bio, niche_tags, location, wayvo_score, score_rank, avg_views, completion_rate, total_campaigns_completed, total_earned, wallet_balance, platforms, instagram_handle, tiktok_handle, whatsapp_number)
VALUES
  (
    'b1b2c3d4-e5f6-7890-abcd-ef1234567891',
    'Lifestyle and food content creator based in Lagos. Love sharing my daily adventures!',
    ARRAY['Food', 'Lifestyle', 'Fashion'],
    'Lagos',
    850,
    'Top 12%',
    2500,
    95.50,
    12,
    75000,
    15000,
    ARRAY['instagram', 'tiktok'],
    '@adaobi_cooks',
    '@adaobi',
    '+2348012345679'
  ),
  (
    'b1b2c3d4-e5f6-7890-abcd-ef1234567892',
    'Tech enthusiast and gadget reviewer. Making tech simple for everyone.',
    ARRAY['Tech', 'Education', 'Lifestyle'],
    'Abuja',
    720,
    'Top 25%',
    1800,
    88.00,
    8,
    42000,
    8000,
    ARRAY['instagram', 'youtube'],
    '@tunde_tech',
    NULL,
    '+2348012345680'
  ),
  (
    'b1b2c3d4-e5f6-7890-abcd-ef1234567893',
    'Fashion and beauty blogger. Showing you the latest trends on a budget.',
    ARRAY['Fashion', 'Beauty', 'Lifestyle'],
    'Lagos',
    650,
    'Top 35%',
    1500,
    82.00,
    6,
    31500,
    5000,
    ARRAY['instagram', 'tiktok', 'facebook'],
    '@fatima_style',
    '@fatimastyle',
    '+2348012345681'
  ),
  (
    'b1b2c3d4-e5f6-7890-abcd-ef1234567894',
    'Fitness coach and健康生活倡导者. Let''s get fit together!',
    ARRAY['Fitness', 'Health', 'Sports'],
    'Port Harcourt',
    580,
    'Top 45%',
    1200,
    75.00,
    5,
    22000,
    3500,
    ARRAY['instagram', 'tiktok'],
    '@emeka_fit',
    '@emekafit',
    '+2348012345682'
  ),
  (
    'b1b2c3d4-e5f6-7890-abcd-ef1234567895',
    'Travel and food explorer. Discovering Nigeria one city at a time.',
    ARRAY['Travel', 'Food', 'Entertainment'],
    'Kano',
    420,
    'Top 60%',
    800,
    68.00,
    3,
    10500,
    2000,
    ARRAY['instagram', 'facebook'],
    '@aisha_travels',
    NULL,
    '+2348012345683'
  );

-- Test Campaign: Grillspot Instagram + WhatsApp
INSERT INTO campaigns (
  id,
  brand_id,
  title,
  brief,
  suggested_caption,
  target_niche,
  platforms,
  total_budget,
  wayvo_fee,
  waver_pool,
  per_waver_payout,
  num_wavers,
  min_views,
  duration_days,
  status,
  payment_status,
  escrow_held,
  starts_at,
  ends_at
)
VALUES (
  'c1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Grillspot Weekend Suya Promo',
  'Share your experience at Grillspot Abuja! Visit us this weekend, try our signature suya platter, and post about it on your social media. Show your audience why we''re the best grill spot in Abuja!',
  'Just had the most amazing suya at @grillspotabuja! 🔥 The pepper sauce is fire and the meat is so tender. If you''re in Abuja, you NEED to try this place! #GrillspotAbuja #SuyaLover #AbujaFood',
  ARRAY['Food', 'Lifestyle'],
  ARRAY['instagram', 'whatsapp'],
  50000,
  12500,
  37500,
  7500,
  5,
  500,
  7,
  'active',
  'paid',
  true,
  NOW(),
  NOW() + INTERVAL '7 days'
);

-- Completed Campaign 1
INSERT INTO campaigns (
  id,
  brand_id,
  title,
  brief,
  target_niche,
  platforms,
  total_budget,
  wayvo_fee,
  waver_pool,
  per_waver_payout,
  num_wavers,
  min_views,
  duration_days,
  status,
  payment_status,
  escrow_held,
  starts_at,
  ends_at
)
VALUES (
  'c1b2c3d4-e5f6-7890-abcd-ef1234567891',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Grillspot Grand Opening',
  'Celebrate our grand opening! Share the excitement with your followers.',
  ARRAY['Food', 'Entertainment'],
  ARRAY['instagram'],
  30000,
  7500,
  22500,
  7500,
  3,
  300,
  5,
  'completed',
  'paid',
  false,
  NOW() - INTERVAL '14 days',
  NOW() - INTERVAL '7 days'
);

-- Completed Campaign 2
INSERT INTO campaigns (
  id,
  brand_id,
  title,
  brief,
  target_niche,
  platforms,
  total_budget,
  wayvo_fee,
  waver_pool,
  per_waver_payout,
  num_wavers,
  min_views,
  duration_days,
  status,
  payment_status,
  escrow_held,
  starts_at,
  ends_at
)
VALUES (
  'c1b2c3d4-e5f6-7890-abcd-ef1234567892',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Weekend Brunch Special',
  'Promote our new weekend brunch menu to food lovers.',
  ARRAY['Food', 'Lifestyle'],
  ARRAY['instagram', 'tiktok'],
  40000,
  10000,
  30000,
  7500,
  4,
  400,
  7,
  'completed',
  'paid',
  false,
  NOW() - INTERVAL '21 days',
  NOW() - INTERVAL '14 days'
);

-- Campaign Assignments for active campaign
INSERT INTO campaign_assignments (campaign_id, waver_id, status, payout_amount, wayvo_score_at_assignment, accepted_at)
VALUES
  ('c1b2c3d4-e5f6-7890-abcd-ef1234567890', 'b1b2c3d4-e5f6-7890-abcd-ef1234567891', 'accepted', 7500, 850, NOW() - INTERVAL '1 day'),
  ('c1b2c3d4-e5f6-7890-abcd-ef1234567890', 'b1b2c3d4-e5f6-7890-abcd-ef1234567892', 'assigned', 7500, 720, NULL),
  ('c1b2c3d4-e5f6-7890-abcd-ef1234567890', 'b1b2c3d4-e5f6-7890-abcd-ef1234567893', 'assigned', 7500, 650, NULL),
  ('c1b2c3d4-e5f6-7890-abcd-ef1234567890', 'b1b2c3d4-e5f6-7890-abcd-ef1234567894', 'assigned', 7500, 580, NULL),
  ('c1b2c3d4-e5f6-7890-abcd-ef1234567890', 'b1b2c3d4-e5f6-7890-abcd-ef1234567895', 'assigned', 7500, 420, NULL);

-- Wallet transactions for each waver
INSERT INTO wallet_transactions (user_id, type, amount, balance_before, balance_after, reference, description, status)
VALUES
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567891', 'payout', 7500, 7500, 15000, 'PAY_' || gen_random_uuid(), 'Campaign payout - Grand Opening', 'success'),
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567891', 'payout', 7500, 0, 7500, 'PAY_' || gen_random_uuid(), 'Campaign payout - Brunch Special', 'success'),
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567892', 'payout', 7500, 0, 7500, 'PAY_' || gen_random_uuid(), 'Campaign payout - Grand Opening', 'success'),
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567893', 'payout', 7500, 0, 7500, 'PAY_' || gen_random_uuid(), 'Campaign payout - Brunch Special', 'success');

-- Sample notifications
INSERT INTO notifications (user_id, title, body, type, data)
VALUES
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567891', 'New Campaign Assigned!', 'You have been assigned to Grillspot Weekend Suya Promo. Earn ₦7,500!', 'campaign_assigned', '{"campaign_id": "c1b2c3d4-e5f6-7890-abcd-ef1234567890"}'),
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567891', 'Payment Received!', '₦7,500 has been added to your wallet for completing a campaign.', 'payment', '{"amount": 7500}');
