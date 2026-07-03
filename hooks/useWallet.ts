import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { WalletTransaction } from '@/types/database';

export function useWallet() {
  const fetchTransactions = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as WalletTransaction[]) || [];
  }, []);

  const getBalance = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('waver_profiles')
      .select('wallet_balance')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data?.wallet_balance || 0;
  }, []);

  const getPendingEarnings = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('campaign_assignments')
      .select('payout_amount')
      .eq('waver_id', userId)
      .in('status', ['proof_submitted', 'proof_approved']);

    if (error) throw error;
    return (data || []).reduce((sum, a) => sum + (a.payout_amount || 0), 0);
  }, []);

  const requestWithdrawal = useCallback(
    async (userId: string, amount: number) => {
      const { data: profile } = await supabase
        .from('waver_profiles')
        .select('wallet_balance, paystack_recipient_code, bank_account_number, bank_name')
        .eq('user_id', userId)
        .single();

      if (!profile) throw new Error('Profile not found');
      if (profile.wallet_balance < amount) throw new Error('Insufficient balance');
      if (!profile.paystack_recipient_code) throw new Error('Bank details not set');

      const ref = `WTH_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      const { data, error } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: userId,
          type: 'withdrawal',
          amount,
          balance_before: profile.wallet_balance,
          balance_after: profile.wallet_balance - amount,
          reference: ref,
          description: `Withdrawal to ${profile.bank_name}`,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from('waver_profiles')
        .update({ wallet_balance: profile.wallet_balance - amount })
        .eq('user_id', userId);

      return data;
    },
    []
  );

  return {
    fetchTransactions,
    getBalance,
    getPendingEarnings,
    requestWithdrawal,
  };
}
