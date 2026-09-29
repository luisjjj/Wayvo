import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useCampaignStore } from '@/stores/campaignStore';
import { Campaign, CampaignAssignment, BrandProfile } from '@/types/database';
import { config } from '@/constants/config';

// campaigns.brand_id references users(id), not brand_profiles —
// so PostgREST can't embed brand_profiles directly (PGRST200).
// Attach brand profiles with a batched second query instead.
async function attachBrandProfiles<T extends { brand_id: string }>(
  items: T[]
): Promise<(T & { brand_profiles: BrandProfile | null })[]> {
  if (!items.length) return [];
  const ids = [...new Set(items.map((i) => i.brand_id).filter(Boolean))];
  if (!ids.length) return items.map((i) => ({ ...i, brand_profiles: null }));
  const { data, error } = await supabase
    .from('brand_profiles')
    .select('*')
    .in('user_id', ids);
  if (error) throw error;
  const map = new Map(((data as BrandProfile[]) || []).map((b) => [b.user_id, b]));
  return items.map((i) => ({ ...i, brand_profiles: map.get(i.brand_id) || null }));
}

export function useCampaigns() {
  const {
    campaigns,
    myCampaigns,
    currentCampaign,
    assignments,
    isLoading,
    setCampaigns,
    setMyCampaigns,
    setCurrentCampaign,
    setAssignments,
    setLoading,
  } = useCampaignStore();

  const fetchActiveCampaigns = useCallback(
    async (filters?: { platform?: string; niche?: string; location?: string }) => {
      setLoading(true);
      try {
        let query = supabase
          .from('campaigns')
          .select('*')
          .eq('status', config.CAMPAIGN_STATUSES.ACTIVE)
          .gte('ends_at', new Date().toISOString());

        if (filters?.platform) {
          query = query.contains('platforms', [filters.platform]);
        }
        if (filters?.niche) {
          query = query.contains('target_niche', [filters.niche]);
        }
        if (filters?.location) {
          query = query.eq('location_target', filters.location);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        setCampaigns((await attachBrandProfiles((data as Campaign[]) || [])) as Campaign[]);
      } finally {
        setLoading(false);
      }
    },
    [setCampaigns, setLoading]
  );

  const fetchMyCampaigns = useCallback(
    async (brandId: string) => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .select('*')
          .eq('brand_id', brandId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMyCampaigns((data as Campaign[]) || []);
      } finally {
        setLoading(false);
      }
    },
    [setMyCampaigns, setLoading]
  );

  const fetchCampaign = useCallback(
    async (campaignId: string) => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (error) throw error;
      const [withBrand] = await attachBrandProfiles([data as Campaign]);
      setCurrentCampaign(withBrand as Campaign);
      return withBrand as Campaign;
    },
    [setCurrentCampaign]
  );

  const createCampaign = useCallback(
    async (campaign: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>) => {
      setLoading(true);
      try {
        const fee = Math.round(campaign.total_budget * (config.WAYVO_FEE_PERCENTAGE / 100));
        const waverPool = campaign.total_budget - fee;
        const perWaverPayout = Math.floor(waverPool / campaign.num_wavers);

        const { data, error } = await supabase
          .from('campaigns')
          .insert({
            ...campaign,
            wayvo_fee: fee,
            waver_pool: waverPool,
            per_waver_payout: perWaverPayout,
            status: config.CAMPAIGN_STATUSES.DRAFT,
            payment_status: 'pending',
          })
          .select()
          .single();

        if (error) throw error;
        return data as Campaign;
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  // ─── Activate after payment: goes live + visible to wavers immediately ───
  const activateCampaign = useCallback(
    async (campaignId: string, durationDays: number) => {
      const startsAt = new Date();
      const endsAt = new Date(startsAt.getTime() + durationDays * 24 * 60 * 60 * 1000);

      const { data, error } = await supabase
        .from('campaigns')
        .update({
          status: config.CAMPAIGN_STATUSES.ACTIVE,
          payment_status: 'paid',
          escrow_held: true,
          starts_at: startsAt.toISOString(),
          ends_at: endsAt.toISOString(),
        })
        .eq('id', campaignId)
        .select()
        .single();

      if (error) throw error;
      return data as Campaign;
    },
    []
  );

  // ─── Run the fit engine: assign best-fit wavers to a live campaign ───
  const matchAndAssign = useCallback(async (campaignId: string) => {
    const { matchWavers } = await import('@/lib/matching');
    return matchWavers(campaignId);
  }, []);

  const fetchAssignments = useCallback(
    async (campaignId: string) => {
      const { data, error } = await supabase
        .from('campaign_assignments')
        .select('*, users(full_name, avatar_url)')
        .eq('campaign_id', campaignId);

      if (error) throw error;
      const rows = (data as unknown as (CampaignAssignment & {
        users: { full_name: string; avatar_url: string | null } | null;
      })[]) || [];

      // campaign_assignments.waver_id references users(id), not waver_profiles —
      // attach waver profiles with a batched second query (PGRST200 otherwise).
      const waverIds = [...new Set(rows.map((r) => r.waver_id).filter(Boolean))];
      let profileMap = new Map<string, { wayvo_score: number; avg_views: number }>();
      if (waverIds.length) {
        const { data: profiles, error: profileError } = await supabase
          .from('waver_profiles')
          .select('user_id, wayvo_score, avg_views')
          .in('user_id', waverIds);
        if (profileError) throw profileError;
        profileMap = new Map(((profiles as any[]) || []).map((p) => [p.user_id, p]));
      }

      // Normalize to the shape CampaignTracker expects: waver + waver_profile.
      const normalized = rows.map((r) => ({
        ...r,
        waver: r.users,
        waver_profile: profileMap.get(r.waver_id) || null,
      }));
      setAssignments((normalized as unknown as CampaignAssignment[]) || []);
      return normalized;
    },
    [setAssignments]
  );

  const fetchMyAssignments = useCallback(async (waverId: string) => {
    const { data, error } = await supabase
      .from('campaign_assignments')
      .select('*, campaigns(*)')
      .eq('waver_id', waverId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    const rows = (data as any[]) || [];
    const withBrands = await attachBrandProfiles(
      rows.map((r) => r.campaigns).filter(Boolean)
    );
    const brandById = new Map(withBrands.map((c: any) => [c.id, c]));
    return rows.map((r) => ({
      ...r,
      campaigns: r.campaigns ? brandById.get(r.campaigns.id) || r.campaigns : r.campaigns,
    }));
  }, []);

  const acceptCampaign = useCallback(
    async (assignmentId: string) => {
      const { data, error } = await supabase
        .from('campaign_assignments')
        .update({
          status: config.ASSIGNMENT_STATUSES.ACCEPTED,
          accepted_at: new Date().toISOString(),
        })
        .eq('id', assignmentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    []
  );

  // ─── Claim (self-assign if the fit engine hasn't) + accept a campaign ───
  const claimAndAccept = useCallback(
    async (campaignId: string, waverId: string, payoutAmount: number) => {
      const { data: existing } = await supabase
        .from('campaign_assignments')
        .select('id, status')
        .eq('campaign_id', campaignId)
        .eq('waver_id', waverId)
        .maybeSingle();

      let assignmentId = (existing as any)?.id as string | undefined;

      if (!assignmentId) {
        const { data: created, error: insertError } = await supabase
          .from('campaign_assignments')
          .insert({
            campaign_id: campaignId,
            waver_id: waverId,
            status: config.ASSIGNMENT_STATUSES.ASSIGNED,
            payout_amount: payoutAmount,
          })
          .select('id')
          .single();
        if (insertError) throw insertError;
        assignmentId = (created as any).id;
      }

      const { data, error } = await supabase
        .from('campaign_assignments')
        .update({
          status: config.ASSIGNMENT_STATUSES.ACCEPTED,
          accepted_at: new Date().toISOString(),
        })
        .eq('id', assignmentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    []
  );

  const submitProof = useCallback(
    async (
      assignmentId: string,
      proof: {
        proof_type: 'screenshot' | 'screen_recording';
        file_url: string;
        platform: string;
        ocr_views_extracted?: number;
        ocr_reach_extracted?: number;
        ocr_interactions_extracted?: number;
        ocr_confidence?: number;
      }
    ) => {
      const { data: assignment } = await supabase
        .from('campaign_assignments')
        .select('campaign_id, waver_id')
        .eq('id', assignmentId)
        .single();

      if (!assignment) throw new Error('Assignment not found');

      const { data, error } = await supabase
        .from('proof_submissions')
        .insert({
          assignment_id: assignmentId,
          waver_id: assignment.waver_id,
          campaign_id: assignment.campaign_id,
          ...proof,
          verification_status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from('campaign_assignments')
        .update({
          status: config.ASSIGNMENT_STATUSES.PROOF_SUBMITTED,
          proof_submitted_at: new Date().toISOString(),
        })
        .eq('id', assignmentId);

      return data;
    },
    []
  );

  return {
    campaigns,
    myCampaigns,
    currentCampaign,
    assignments,
    isLoading,
    fetchActiveCampaigns,
    fetchMyCampaigns,
    fetchCampaign,
    createCampaign,
    activateCampaign,
    matchAndAssign,
    fetchAssignments,
    fetchMyAssignments,
    acceptCampaign,
    claimAndAccept,
    submitProof,
  };
}
