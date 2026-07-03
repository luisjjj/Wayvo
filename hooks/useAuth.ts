import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { User, WaverProfile, BrandProfile } from '@/types/database';

export function useAuth() {
  const {
    user,
    waverProfile,
    brandProfile,
    isLoading,
    isAuthenticated,
    setUser,
    setWaverProfile,
    setBrandProfile,
    setLoading,
    signOut,
  } = useAuthStore();

  const loadProfiles = useCallback(
    async (userId: string) => {
      const { data: waverData } = await supabase
        .from('waver_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      const { data: brandData } = await supabase
        .from('brand_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (waverData) setWaverProfile(waverData as WaverProfile);
      if (brandData) setBrandProfile(brandData as BrandProfile);
    },
    [setWaverProfile, setBrandProfile]
  );

  const upsertUser = useCallback(
    async (authUser: { id: string; phone?: string; email?: string }) => {
      const { data: existing } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (existing) {
        setUser(existing as User);
        await loadProfiles(authUser.id);
      } else {
        const { data: newUser } = await supabase
          .from('users')
          .upsert({
            id: authUser.id,
            phone: authUser.phone || null,
            email: authUser.email || null,
            full_name: '',
            active_mode: 'waver',
            is_brand: false,
            is_waver: true,
          }, { onConflict: 'id' })
          .select()
          .single();

        if (newUser) setUser(newUser as User);
      }
    },
    [setUser, loadProfiles]
  );

  // ─── Init: restore session on app load ───
  useEffect(() => {
    const initAuth = async () => {
      try {
        // FORCE SIGN-OUT — REMOVE THIS LINE AFTER TESTING FRESH SIGNUP
        await supabase.auth.signOut();

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          await upsertUser({
            id: session.user.id,
            phone: session.user.phone,
            email: session.user.email,
          });
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await upsertUser({
          id: session.user.id,
          phone: session.user.phone,
          email: session.user.email,
        });
      } else if (event === 'SIGNED_OUT') {
        signOut();
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading, signOut, upsertUser]);

  // ─── Phone OTP ───
  const sendOtp = useCallback(async (phone: string) => {
    const formatted = phone.startsWith('+') ? phone : `+234${phone.replace(/^0/, '')}`;
    const { error } = await supabase.auth.signInWithOtp({ phone: formatted });
    if (error) throw error;
  }, []);

  const verifyOtp = useCallback(
    async (phone: string, token: string) => {
      const formatted = phone.startsWith('+') ? phone : `+234${phone.replace(/^0/, '')}`;
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formatted,
        token,
        type: 'sms',
      });
      if (error) throw error;

      if (data.user) {
        await upsertUser({
          id: data.user.id,
          phone: data.user.phone,
          email: data.user.email,
        });
      }

      return data;
    },
    [upsertUser]
  );

  // ─── Email / Password ───
  const signUpWithEmail = useCallback(
    async (email: string, password: string, fullName: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;

      if (data.user) {
        const { data: newUser } = await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            email,
            full_name: fullName,
            active_mode: 'waver',
            is_brand: false,
            is_waver: true,
          }, { onConflict: 'id' })
          .select()
          .single();

        if (newUser) setUser(newUser as User);
      }

      return data;
    },
    [setUser]
  );

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      if (data.user) {
        await upsertUser({
          id: data.user.id,
          phone: data.user.phone,
          email: data.user.email,
        });
      }

      return data;
    },
    [upsertUser]
  );

  // ─── Profile ───
  const updateProfile = useCallback(
    async (updates: Partial<User>) => {
      if (!user) return;
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      if (data) setUser(data as User);
    },
    [user, setUser]
  );

  // ─── Sign Out ───
  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    signOut();
  }, [signOut]);

  return {
    user,
    waverProfile,
    brandProfile,
    isLoading,
    isAuthenticated,
    sendOtp,
    verifyOtp,
    signUpWithEmail,
    signInWithEmail,
    updateProfile,
    loadProfiles,
    signOut: handleSignOut,
  };
}
