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

    const { proof_id } = await req.json()

    if (!proof_id) {
      return new Response(
        JSON.stringify({ error: 'proof_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get proof submission
    const { data: proof, error: proofError } = await supabase
      .from('proof_submissions')
      .select('*, campaign_assignments(*), waver_profiles(*)')
      .eq('id', proof_id)
      .single()

    if (proofError || !proof) {
      return new Response(
        JSON.stringify({ error: 'Proof not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fraud detection
    const flags: string[] = []

    // Flag 1: Suspiciously round numbers
    if (proof.ocr_views_extracted && proof.ocr_views_extracted % 1000 === 0 && proof.ocr_views_extracted > 5000) {
      flags.push('round_number')
    }

    // Flag 2: Views exceed historical average by >500%
    if (proof.ocr_views_extracted && proof.waver_profiles?.avg_views > 0) {
      if (proof.ocr_views_extracted > proof.waver_profiles.avg_views * 5) {
        flags.push('unusually_high_views')
      }
    }

    // Flag 3: Views but zero interactions
    if (proof.ocr_views_extracted && proof.ocr_views_extracted > 1000 && proof.ocr_interactions_extracted === 0) {
      flags.push('zero_interactions')
    }

    // Flag 4: Submitted too quickly
    if (proof.campaign_assignments?.accepted_at) {
      const timeDiff = new Date(proof.created_at).getTime() - new Date(proof.campaign_assignments.accepted_at).getTime()
      if (timeDiff < 30 * 60 * 1000) {
        flags.push('submitted_too_fast')
      }
    }

    const requiresManualReview = flags.length >= 2
    const autoReject = flags.includes('zero_interactions') && flags.includes('round_number')

    let verificationStatus: string
    let rejectionReason: string | null = null

    if (autoReject) {
      verificationStatus = 'rejected'
      rejectionReason = 'Suspicious activity detected: ' + flags.join(', ')
    } else if (requiresManualReview) {
      verificationStatus = 'manual_review'
    } else if (flags.length === 0) {
      verificationStatus = 'auto_approved'
    } else {
      verificationStatus = 'manual_review'
    }

    // Update proof submission
    const { error: updateError } = await supabase
      .from('proof_submissions')
      .update({
        verification_status: verificationStatus,
        fraud_flagged: flags.length > 0,
        fraud_reason: flags.length > 0 ? flags.join(', ') : null,
        rejection_reason: rejectionReason,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', proof_id)

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update proof' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // If auto-approved, update assignment and trigger payout
    if (verificationStatus === 'auto_approved') {
      await supabase
        .from('campaign_assignments')
        .update({
          status: 'proof_approved',
          proof_approved_at: new Date().toISOString(),
        })
        .eq('id', proof.assignment_id)

      // Trigger payout via process-payout edge function
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/process-payout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignment_id: proof.assignment_id }),
      })
    } else if (verificationStatus === 'rejected') {
      await supabase
        .from('campaign_assignments')
        .update({
          status: 'proof_rejected',
        })
        .eq('id', proof.assignment_id)
    }

    return new Response(
      JSON.stringify({
        verification_status: verificationStatus,
        flags,
        requires_manual_review: requiresManualReview,
        auto_reject: autoReject,
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
