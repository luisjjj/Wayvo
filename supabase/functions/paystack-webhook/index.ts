import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from 'https://deno.land/std@0.177.0/crypto/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.text()
    const hash = createHmac('sha512', Deno.env.get('PAYSTACK_SECRET_KEY')!)
      .update(body)
      .digest('hex')

    if (hash !== req.headers.get('x-paystack-signature')) {
      return new Response('Unauthorized', { status: 401 })
    }

    const event = JSON.parse(body)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    switch (event.event) {
      case 'charge.success': {
        // Brand paid for campaign
        const { reference, status } = event.data

        if (status !== 'success') break

        // Find campaign by reference
        const { data: campaign } = await supabase
          .from('campaigns')
          .select('*')
          .eq('paystack_reference', reference)
          .single()

        if (campaign) {
          // Update campaign status
          await supabase
            .from('campaigns')
            .update({
              status: 'active',
              payment_status: 'paid',
              escrow_held: true,
              starts_at: new Date().toISOString(),
              ends_at: new Date(Date.now() + campaign.duration_days * 24 * 60 * 60 * 1000).toISOString(),
            })
            .eq('id', campaign.id)

          // Update brand stats
          await supabase
            .from('brand_profiles')
            .update({
              total_campaigns_run: supabase.rpc('increment', { x: 1 }),
              total_spent: supabase.rpc('increment_bigint', { x: campaign.total_budget }),
            })
            .eq('user_id', campaign.brand_id)

          // Trigger matching
          await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/match-wavers`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ campaign_id: campaign.id }),
          })

          // Notify brand
          await supabase.from('notifications').insert({
            user_id: campaign.brand_id,
            title: 'Campaign Live! 🚀',
            body: `Your campaign "${campaign.title}" is now live. Wavers will start posting within 24hrs.`,
            type: 'campaign_live',
            data: { campaign_id: campaign.id },
          })
        }
        break
      }

      case 'transfer.success': {
        // Waver payout successful
        const { reference } = event.data

        // Update wallet transaction
        await supabase
          .from('wallet_transactions')
          .update({ status: 'success' })
          .eq('reference', reference)
          .eq('status', 'pending')

        break
      }

      case 'transfer.failed': {
        // Waver payout failed
        const { reference } = event.data

        await supabase
          .from('wallet_transactions')
          .update({ status: 'failed' })
          .eq('reference', reference)

        // Find and update assignment
        const { data: transaction } = await supabase
          .from('wallet_transactions')
          .select('assignment_id, user_id, amount')
          .eq('reference', reference)
          .single()

        if (transaction) {
          await supabase
            .from('campaign_assignments')
            .update({ status: 'proof_approved' })
            .eq('id', transaction.assignment_id)

          // Restore wallet balance
          const { data: profile } = await supabase
            .from('waver_profiles')
            .select('wallet_balance')
            .eq('user_id', transaction.user_id)
            .single()

          if (profile) {
            await supabase
              .from('waver_profiles')
              .update({ wallet_balance: profile.wallet_balance + transaction.amount })
              .eq('user_id', transaction.user_id)
          }
        }
        break
      }

      case 'subscription.not_renew': {
        // Downgrade user plan
        const { customer } = event.data

        await supabase
          .from('users')
          .update({
            subscription_plan: 'free',
            subscription_status: 'inactive',
          })
          .eq('paystack_customer_code', customer.customer_code)

        await supabase
          .from('subscriptions')
          .update({ status: 'expired' })
          .eq('paystack_subscription_code', event.data.subscription_code)
          .eq('status', 'active')

        break
      }

      case 'invoice.payment_failed': {
        // Handle failed subscription payment
        const { customer } = event.data

        await supabase
          .from('users')
          .update({ subscription_status: 'past_due' })
          .eq('paystack_customer_code', customer.customer_code)

        break
      }
    }

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('OK', { status: 200 })
  }
})
