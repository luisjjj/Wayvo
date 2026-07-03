export const config = {
  APP_NAME: 'Wayvo',
  APP_ENV: process.env.EXPO_PUBLIC_APP_ENV || 'development',
  APP_VERSION: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',

  // Business rules
  WAYVO_FEE_PERCENTAGE: 25,
  MIN_CAMPAIGN_BUDGET: 20000,
  MIN_WAVER_PAYOUT: 3500,
  MIN_WITHDRAWAL: 2000,
  MIN_WAYVO_SCORE: 100,
  NEW_WAVER_SCORE: 50,
  PROOF_DEADLINE_GRACE_HOURS: 48,

  // Subscription plans
  WAVER_PRO_PRICE: 3500,
  BRAND_PRO_PRICE: 9000,

  // Platform options
  PLATFORMS: ['instagram', 'tiktok', 'whatsapp', 'facebook', 'youtube'] as const,
  NICHES: [
    'Food', 'Fashion', 'Tech', 'Lifestyle', 'Beauty',
    'Fitness', 'Travel', 'Education', 'Entertainment',
    'Health', 'Music', 'Gaming', 'Business', 'Sports',
  ] as const,
  LOCATIONS: ['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Nationwide'] as const,

  // Campaign statuses
  CAMPAIGN_STATUSES: {
    DRAFT: 'draft',
    PENDING_PAYMENT: 'pending_payment',
    ACTIVE: 'active',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    EXPIRED: 'expired',
  } as const,

  // Assignment statuses
  ASSIGNMENT_STATUSES: {
    ASSIGNED: 'assigned',
    ACCEPTED: 'accepted',
    POSTED: 'posted',
    PROOF_SUBMITTED: 'proof_submitted',
    PROOF_APPROVED: 'proof_approved',
    PROOF_REJECTED: 'proof_rejected',
    PAID: 'paid',
    EXPIRED: 'expired',
    CANCELLED: 'cancelled',
  } as const,

  // Proof verification statuses
  VERIFICATION_STATUSES: {
    PENDING: 'pending',
    AUTO_APPROVED: 'auto_approved',
    MANUAL_REVIEW: 'manual_review',
    APPROVED: 'approved',
    REJECTED: 'rejected',
  } as const,
} as const;
