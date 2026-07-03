import { supabase } from './supabase';

interface CampaignData {
  id: string;
  platforms: string[];
  target_niche: string[];
  num_wavers: number;
  per_waver_payout: number;
}

interface WaverCandidate {
  user_id: string;
  wayvo_score: number;
  completion_rate: number;
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

export async function matchWavers(campaignId: string) {
  const { data: campaign, error: campaignError } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', campaignId)
    .single();

  if (campaignError || !campaign) {
    throw new Error('Campaign not found');
  }

  const { data: candidates, error: candidateError } = await supabase
    .from('waver_profiles')
    .select('*, users!inner(full_name, subscription_status)')
    .overlaps('platforms', campaign.platforms)
    .overlaps('niche_tags', campaign.target_niche)
    .gte('wayvo_score', 100);

  if (candidateError || !candidates) {
    throw new Error('Failed to fetch candidates');
  }

  const scored = candidates
    .filter((w: any) => w.users?.subscription_status === 'active' || !w.users?.subscription_status)
    .map((w: any) => ({
      ...w,
      match_score:
        (w.wayvo_score / 1000) * 0.4 +
        (w.completion_rate / 100) * 0.3 +
        platformOverlapScore(w, campaign) * 0.2 +
        nicheMatchScore(w, campaign) * 0.1,
    }))
    .sort((a: any, b: any) => b.match_score - a.match_score);

  const selected = scored.slice(0, campaign.num_wavers);

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
