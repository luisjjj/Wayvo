import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useCampaignStore } from '@/stores/campaignStore';
import { Campaign, CampaignAssignment } from '@/types/database';
import { config } from '@/constants/config';

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
          .select('*, brand_profiles(*)')
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
        setCampaigns((data as Campaign[]) || []);
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
        .select('*, brand_profiles(*)')
        .eq('id', campaignId)
        .single();

      if (error) throw error;
      setCurrentCampaign(data as Campaign);
      return data as Campaign;
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

  const fetchAssignments = useCallback(
    async (campaignId: string) => {
      const { data, error } = await supabase
        .from('campaign_assignments')
        .select('*, users(full_name, avatar_url), waver_profiles(wayvo_score, avg_views)')
        .eq('campaign_id', campaignId);

      if (error) throw error;
      setAssignments((data as unknown as CampaignAssignment[]) || []);
      return data;
    },
    [setAssignments]
  );

  const fetchMyAssignments = useCallback(async (waverId: string) => {
    const { data, error } = await supabase
      .from('campaign_assignments')
      .select('*, campaigns(*, brand_profiles(business_name, logo_url))')
      .eq('waver_id', waverId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
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
    fetchAssignments,
    fetchMyAssignments,
    acceptCampaign,
    submitProof,
  };
}
