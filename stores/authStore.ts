import { create } from 'zustand';
import { User, WaverProfile, BrandProfile, ActiveMode } from '@/types/database';

interface AuthState {
  user: User | null;
  waverProfile: WaverProfile | null;
  brandProfile: BrandProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setWaverProfile: (profile: WaverProfile | null) => void;
  setBrandProfile: (profile: BrandProfile | null) => void;
  setActiveMode: (mode: ActiveMode) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  waverProfile: null,
  brandProfile: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user) =>
    set({ user, isAuthenticated: !!user }),
  setWaverProfile: (waverProfile) => set({ waverProfile }),
  setBrandProfile: (brandProfile) => set({ brandProfile }),
  setActiveMode: (mode) =>
    set((state) => ({
      user: state.user ? { ...state.user, active_mode: mode } : null,
    })),
  setLoading: (isLoading) => set({ isLoading }),
  signOut: () =>
    set({
      user: null,
      waverProfile: null,
      brandProfile: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));
