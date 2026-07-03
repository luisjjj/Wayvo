import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { campaign_id } = await req.json()

    if (!campaign_id) {
      return new Response(
        JSON.stringify({ error: 'campaign_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaign_id)
      .single()

    if (campaignError || !campaign) {
      return new Response(
        JSON.stringify({ error: 'Campaign not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get eligible wavers
    const { data: candidates, error: candidateError } = await supabase
      .from('waver_profiles')
      .select('*, users!inner(full_name, subscription_status)')
      .overlaps('platforms', campaign.platforms)
      .overlaps('niche_tags', campaign.target_niche)
      .gte('wayvo_score', 100)
      .neq('user_id', campaign.brand_id)

    if (candidateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch candidates' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Score and rank candidates
    const scored = (candidates || [])
      .filter((w: any) => w.users?.subscription_status === 'active' || !w.users?.subscription_status)
      .map((w: any) => {
        const platformOverlap = w.platforms.filter((p: string) => campaign.platforms.includes(p))
        const nicheOverlap = w.niche_tags.filter((n: string) => campaign.target_niche.includes(n))

        return {
          ...w,
          match_score:
            (w.wayvo_score / 1000) * 0.4 +
            (w.completion_rate / 100) * 0.3 +
            (platformOverlap.length / Math.max(campaign.platforms.length, 1)) * 0.2 +
            (nicheOverlap.length / Math.max(campaign.target_niche.length, 1)) * 0.1,
        }
      })
      .sort((a: any, b: any) => b.match_score - a.match_score)

    // Select top N wavers
    const selected = scored.slice(0, campaign.num_wavers)

    if (selected.length === 0) {
      return new Response(
        JSON.stringify({ matched: 0, message: 'No eligible wavers found' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create assignments
    const assignments = selected.map((w: any) => ({
      campaign_id,
      waver_id: w.user_id,
      status: 'assigned',
      payout_amount: campaign.per_waver_payout,
      wayvo_score_at_assignment: w.wayvo_score,
    }))

    const { data: createdAssignments, error: insertError } = await supabase
      .from('campaign_assignments')
      .insert(assignments)
      .select()

    if (insertError) {
      return new Response(
        JSON.stringify({ error: 'Failed to create assignments' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Schedule reminders
    for (const waver of selected) {
      const reminderDate = new Date()
      reminderDate.setDate(reminderDate.getDate() + 1)

      await supabase.from('reminders').insert({
        assignment_id: createdAssignments?.find((a: any) => a.waver_id === waver.user_id)?.id,
        waver_id: waver.user_id,
        campaign_id,
        reminder_type: 'day_1',
        channel: 'whatsapp',
        scheduled_at: reminderDate.toISOString(),
      })
    }

    return new Response(
      JSON.stringify({ matched: selected.length, assignments: createdAssignments }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
