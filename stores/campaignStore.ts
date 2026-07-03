import { create } from 'zustand';
import { Campaign, CampaignAssignment } from '@/types/database';

interface CampaignState {
  campaigns: Campaign[];
  myCampaigns: Campaign[];
  currentCampaign: Campaign | null;
  assignments: CampaignAssignment[];
  isLoading: boolean;
  setCampaigns: (campaigns: Campaign[]) => void;
  setMyCampaigns: (campaigns: Campaign[]) => void;
  setCurrentCampaign: (campaign: Campaign | null) => void;
  setAssignments: (assignments: CampaignAssignment[]) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  setLoading: (loading: boolean) => void;
}

export const useCampaignStore = create<CampaignState>((set) => ({
  campaigns: [],
  myCampaigns: [],
  currentCampaign: null,
  assignments: [],
  isLoading: false,
  setCampaigns: (campaigns) => set({ campaigns }),
  setMyCampaigns: (myCampaigns) => set({ myCampaigns }),
  setCurrentCampaign: (currentCampaign) => set({ currentCampaign }),
  setAssignments: (assignments) => set({ assignments }),
  updateCampaign: (id, updates) =>
    set((state) => ({
      campaigns: state.campaigns.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
      myCampaigns: state.myCampaigns.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),
  setLoading: (isLoading) => set({ isLoading }),
}));
