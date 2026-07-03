import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const TERMII_API_KEY = Deno.env.get('TERMII_API_KEY')!
const TERMII_BASE_URL = 'https://api.termii.com/api'

async function sendWhatsApp(to: string, message: string) {
  const response = await fetch(`${TERMII_BASE_URL}/messaging/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: TERMII_API_KEY,
      type: 'whatsapp',
      from: 'Wayvo',
      to,
      channel: 'whatsapp',
      message,
    }),
  })
  return response.json()
}

async function sendSms(to: string, message: string) {
  const response = await fetch(`${TERMII_BASE_URL}/messaging/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: TERMII_API_KEY,
      type: 'plain',
      from: 'Wayvo',
      to,
      channel: 'sms',
      message,
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

    // Get due reminders
    const { data: reminders, error: reminderError } = await supabase
      .from('reminders')
      .select('*, waver_profiles!inner(whatsapp_number, users!inner(full_name)), campaigns!inner(title, per_waver_payout, ends_at, brand_profiles!inner(business_name))')
      .eq('status', 'scheduled')
      .lte('scheduled_at', new Date().toISOString())
      .limit(50)

    if (reminderError || !reminders || reminders.length === 0) {
      return new Response(
        JSON.stringify({ processed: 0, message: 'No reminders due' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let processed = 0
    let failed = 0

    for (const reminder of reminders) {
      const phone = reminder.waver_profiles?.whatsapp_number
      if (!phone) {
        failed++
        continue
      }

      const waverName = reminder.waver_profiles?.users?.full_name || 'there'
      const campaignTitle = reminder.campaigns?.title || 'a campaign'
      const brandName = reminder.campaigns?.brand_profiles?.business_name || 'a brand'
      const payout = reminder.campaigns?.per_waver_payout || 0
      const deadline = reminder.campaigns?.ends_at
        ? new Date(reminder.campaigns.ends_at).toLocaleDateString()
        : 'soon'

      let message: string

      switch (reminder.reminder_type) {
        case 'day_1':
          message = `🎯 New campaign for you, ${waverName}!\n\n*${brandName}* wants you to post on *${campaignTitle}*.\nYour payout: *₦${payout.toLocaleString()}*\nDeadline: ${deadline}\n\nOpen Wayvo to see the brief and accept 👉`
          break
        case 'day_3':
          message = `⏰ Reminder: You have a pending Wayvo campaign worth *₦${payout.toLocaleString()}*.\n\nCampaign: *${campaignTitle}*\nDeadline: ${deadline}\n\nDon't miss out!`
          break
        case 'overdue':
          message = `⚠️ Your Wayvo campaign *${campaignTitle}* has expired.\n\nComplete it now or it may affect your Wayvo Score.`
          break
        default:
          message = `📢 Reminder about your Wayvo campaign: *${campaignTitle}*`
      }

      try {
        const result = await sendWhatsApp(phone, message)

        if (result.status === 'success') {
          await supabase
            .from('reminders')
            .update({ status: 'sent', sent_at: new Date().toISOString() })
            .eq('id', reminder.id)
          processed++
        } else {
          // Try SMS fallback
          const smsResult = await sendSms(phone, message)
          if (smsResult.status === 'success') {
            await supabase
              .from('reminders')
              .update({ status: 'sent', sent_at: new Date().toISOString() })
              .eq('id', reminder.id)
            processed++
          } else {
            await supabase
              .from('reminders')
              .update({ status: 'failed', error_message: result.message || 'Failed to send' })
              .eq('id', reminder.id)
            failed++
          }
        }
      } catch (error) {
        await supabase
          .from('reminders')
          .update({ status: 'failed', error_message: 'Network error' })
          .eq('id', reminder.id)
        failed++
      }
    }

    return new Response(
      JSON.stringify({ processed, failed, total: reminders.length }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
