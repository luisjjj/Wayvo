import { Campaign } from './database';

export type CampaignStatus =
  | 'draft'
  | 'pending_payment'
  | 'active'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'expired';

export type AssignmentStatus =
  | 'assigned'
  | 'accepted'
  | 'posted'
  | 'proof_submitted'
  | 'proof_approved'
  | 'proof_rejected'
  | 'paid'
  | 'expired'
  | 'cancelled';

export interface CampaignWithBrand extends Campaign {
  brand_profiles?: {
    business_name: string;
    logo_url: string | null;
    industry: string | null;
    is_verified: boolean;
  };
}

export interface CampaignStats {
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
  totalBudget: number;
  totalSpent: number;
  avgViews: number;
}
