import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY')!
const PAYSTACK_BASE_URL = 'https://api.paystack.co'

async function initiateTransfer(amount: number, recipientCode: string, reason: string, reference: string) {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transfer`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source: 'balance',
      amount: amount * 100,
      recipient: recipientCode,
      reason,
      reference,
    }),
  })
  return response.json()
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { assignment_id } = await req.json()

    if (!assignment_id) {
      return new Response(
        JSON.stringify({ error: 'assignment_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get assignment details
    const { data: assignment, error: assignmentError } = await supabase
      .from('campaign_assignments')
      .select('*, campaigns!inner(title, brand_profiles!inner(business_name)), waver_profiles!inner(paystack_recipient_code, wallet_balance, bank_name)')
      .eq('id', assignment_id)
      .single()

    if (assignmentError || !assignment) {
      return new Response(
        JSON.stringify({ error: 'Assignment not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (assignment.status !== 'proof_approved') {
      return new Response(
        JSON.stringify({ error: 'Assignment not ready for payout' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!assignment.waver_profiles?.paystack_recipient_code) {
      return new Response(
        JSON.stringify({ error: 'Waver has no bank details' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const reference = `WVO_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    // Initiate transfer
    const transferResult = await initiateTransfer(
      assignment.payout_amount,
      assignment.waver_profiles.paystack_recipient_code,
      `Wayvo campaign payout - ${assignment.campaigns?.title}`,
      reference
    )

    if (!transferResult.status) {
      return new Response(
        JSON.stringify({ error: 'Transfer failed', details: transferResult.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update assignment status
    await supabase
      .from('campaign_assignments')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        paystack_transfer_code: transferResult.data?.reference,
      })
      .eq('id', assignment_id)

    // Update waver wallet balance
    const newBalance = (assignment.waver_profiles.wallet_balance || 0) + assignment.payout_amount
    await supabase
      .from('waver_profiles')
      .update({ wallet_balance: newBalance })
      .eq('user_id', assignment.waver_id)

    // Create wallet transaction
    await supabase.from('wallet_transactions').insert({
      user_id: assignment.waver_id,
      type: 'payout',
      amount: assignment.payout_amount,
      balance_before: assignment.waver_profiles.wallet_balance || 0,
      balance_after: newBalance,
      reference,
      description: `Campaign payout - ${assignment.campaigns?.title}`,
      campaign_id: assignment.campaign_id,
      assignment_id: assignment.id,
      paystack_transfer_code: transferResult.data?.reference,
      status: 'success',
    })

    // Create notification
    await supabase.from('notifications').insert({
      user_id: assignment.waver_id,
      title: 'Payment Received! 💸',
      body: `₦${assignment.payout_amount.toLocaleString()} has been added to your wallet for completing ${assignment.campaigns?.title}.`,
      type: 'payment',
      data: { amount: assignment.payout_amount, campaign_id: assignment.campaign_id },
    })

    return new Response(
      JSON.stringify({
        success: true,
        transfer_reference: transferResult.data?.reference,
        amount: assignment.payout_amount,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
