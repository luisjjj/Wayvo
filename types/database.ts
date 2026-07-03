export type ActiveMode = 'waver' | 'brand';
export type SubscriptionPlan = 'free' | 'creator' | 'brand_pro';
export type SubscriptionStatus = 'inactive' | 'active' | 'cancelled' | 'past_due';

export interface User {
  id: string;
  phone: string | null;
  email: string | null;
  full_name: string;
  avatar_url: string | null;
  active_mode: ActiveMode;
  is_brand: boolean;
  is_waver: boolean;
  subscription_plan: SubscriptionPlan;
  subscription_status: SubscriptionStatus;
  paystack_customer_code: string | null;
  paystack_subscription_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface WaverProfile {
  id: string;
  user_id: string;
  bio: string | null;
  niche_tags: string[];
  location: string | null;
  wayvo_score: number;
  score_rank: string | null;
  avg_views: number;
  completion_rate: number;
  posting_speed_score: number;
  brand_rating_avg: number;
  total_campaigns_completed: number;
  total_earned: number;
  wallet_balance: number;
  bank_name: string | null;
  bank_account_number: string | null;
  bank_account_name: string | null;
  paystack_recipient_code: string | null;
  instagram_handle: string | null;
  tiktok_handle: string | null;
  youtube_handle: string | null;
  facebook_handle: string | null;
  whatsapp_number: string | null;
  ig_avg_views: number;
  tiktok_avg_views: number;
  platforms: string[];
  created_at: string;
}

export interface BrandProfile {
  id: string;
  user_id: string;
  business_name: string;
  logo_url: string | null;
  industry: string | null;
  website: string | null;
  description: string | null;
  is_verified: boolean;
  total_campaigns_run: number;
  total_spent: number;
  wallet_balance: number;
  paystack_customer_code: string | null;
  created_at: string;
}

export interface Campaign {
  id: string;
  brand_id: string;
  title: string;
  brief: string;
  suggested_caption: string | null;
  target_niche: string[];
  platforms: string[];
  total_budget: number;
  wayvo_fee: number;
  waver_pool: number;
  per_waver_payout: number;
  num_wavers: number;
  min_views: number;
  duration_days: number;
  status: string;
  paystack_reference: string | null;
  payment_status: string;
  escrow_held: boolean;
  asset_urls: string[];
  location_target: string | null;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CampaignAssignment {
  id: string;
  campaign_id: string;
  waver_id: string;
  status: string;
  accepted_at: string | null;
  posted_at: string | null;
  proof_submitted_at: string | null;
  proof_approved_at: string | null;
  paid_at: string | null;
  payout_amount: number;
  paystack_transfer_code: string | null;
  wayvo_score_at_assignment: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProofSubmission {
  id: string;
  assignment_id: string;
  waver_id: string;
  campaign_id: string;
  proof_type: 'screenshot' | 'screen_recording';
  file_url: string;
  platform: string;
  ocr_views_extracted: number | null;
  ocr_reach_extracted: number | null;
  ocr_interactions_extracted: number | null;
  ocr_confidence: number | null;
  fraud_flagged: boolean;
  fraud_reason: string | null;
  verification_status: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  type: 'credit' | 'debit' | 'withdrawal' | 'payout' | 'refund';
  amount: number;
  balance_before: number;
  balance_after: number;
  reference: string;
  description: string | null;
  campaign_id: string | null;
  assignment_id: string | null;
  paystack_transfer_code: string | null;
  status: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: string | null;
  data: Record<string, unknown>;
  read: boolean;
  created_at: string;
}

export interface BrandRating {
  id: string;
  campaign_id: string;
  brand_id: string;
  waver_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: string;
  status: string;
  paystack_subscription_code: string | null;
  paystack_email_token: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: string;
  assignment_id: string;
  waver_id: string;
  campaign_id: string;
  reminder_type: string;
  channel: string;
  status: string;
  scheduled_at: string;
  sent_at: string | null;
  error_message: string | null;
  created_at: string;
}
