import { supabase } from './supabase';

export interface CampaignData {
  id: string;
  platforms: string[];
  target_niche: string[];
  num_wavers: number;
  per_waver_payout: number;
  min_views?: number;
}

export interface WaverCandidate {
  user_id: string;
  wayvo_score: number;
  completion_rate: number;
  avg_views?: number;
  platforms: string[];
  niche_tags: string[];
  full_name: string;
}

function platformOverlapScore(waver: WaverCandidate, campaign: CampaignData): number {
  const overlap = waver.platforms.filter((p) => campaign.platforms.includes(p));
  return overlap.length / Math.max(campaign.platforms.length, 1);
}

function nicheMatchScore(waver: WaverCandidate, campaign: CampaignData): number {
  const overlap = waver.niche_tags.filter((n) => campaign.target_niche.includes(n));
  return overlap.length / Math.max(campaign.target_niche.length, 1);
}

function viewsScore(waver: WaverCandidate, campaign: CampaignData): number {
  const minViews = campaign.min_views || 0;
  if (!minViews) return 0.5;
  const avg = waver.avg_views || 0;
  if (avg >= minViews) return 1;
  if (avg <= 0) return 0.2;
  return Math.max(0.2, avg / minViews);
}

// ─── Pure fit score (0–100): how well a campaign fits a waver ───
// niche 35% · platform 25% · wayvo score 20% · completion 10% · views 10%
export function scoreFitForWaver(
  campaign: CampaignData,
  waver: WaverCandidate
): number {
  const score =
    nicheMatchScore(waver, campaign) * 35 +
    platformOverlapScore(waver, campaign) * 25 +
    Math.min((waver.wayvo_score || 0) / 1000, 1) * 20 +
    Math.min((waver.completion_rate || 0) / 100, 1) * 10 +
    viewsScore(waver, campaign) * 10;
  return Math.round(score);
}

// ─── Rank open campaigns for a waver, best fit first ───
export function rankCampaignsForWaver<T extends CampaignData>(
  campaigns: T[],
  waver: WaverCandidate | null | undefined
): (T & { match_score: number })[] {
  if (!waver) return campaigns.map((c) => ({ ...c, match_score: 0 }));
  return campaigns
    .map((c) => ({ ...c, match_score: scoreFitForWaver(c, waver) }))
    .sort((a, b) => b.match_score - a.match_score);
}

// ─── Map a campaign to its best-fit wavers by creating assignments ───
export async function matchWavers(campaignId: string) {
  const { data: campaign, error: campaignError } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', campaignId)
    .single();

  if (campaignError || !campaign) {
    throw new Error('Campaign not found');
  }

  // Pull every waver profile — scoring (not pre-filtering) decides fit,
  // so new wavers with empty niches/platforms still get matched.
  const { data: candidates, error: candidateError } = await supabase
    .from('waver_profiles')
    .select('*, users!inner(full_name, subscription_status)');

  if (candidateError || !candidates) {
    throw new Error('Failed to fetch candidates');
  }

  // Skip wavers already assigned to this campaign (safe to re-run).
  const { data: existing } = await supabase
    .from('campaign_assignments')
    .select('waver_id')
    .eq('campaign_id', campaignId);
  const assignedIds = new Set((existing || []).map((a: any) => a.waver_id));

  const scored = candidates
    .filter((w: any) => !assignedIds.has(w.user_id))
    .filter((w: any) => w.users?.subscription_status === 'active' || !w.users?.subscription_status)
    .map((w: any) => ({
      ...w,
      match_score:
        (Math.min(w.wayvo_score || 0, 1000) / 1000) * 0.4 +
        (Math.min(w.completion_rate || 0, 100) / 100) * 0.3 +
        platformOverlapScore(w, campaign) * 0.2 +
        nicheMatchScore(w, campaign) * 0.1,
    }))
    .sort((a: any, b: any) => b.match_score - a.match_score);

  const slotsLeft = Math.max(campaign.num_wavers - assignedIds.size, 0);
  const selected = scored.slice(0, slotsLeft);

  if (selected.length === 0) {
    return { matched: 0, assignments: [] };
  }

  const assignments = selected.map((w: any) => ({
    campaign_id: campaignId,
    waver_id: w.user_id,
    status: 'assigned',
    payout_amount: campaign.per_waver_payout,
    wayvo_score_at_assignment: w.wayvo_score,
  }));

  const { data: createdAssignments, error: insertError } = await supabase
    .from('campaign_assignments')
    .insert(assignments)
    .select();

  if (insertError) {
    throw new Error('Failed to create assignments');
  }

  return {
    matched: selected.length,
    assignments: createdAssignments,
  };
}
