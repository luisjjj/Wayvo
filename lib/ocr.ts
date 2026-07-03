export async function extractInsightNumbers(imageUri: string) {
  try {
    const MLKitTextRecognition = require('@react-native-ml-kit/text-recognition').default;
    const result = await MLKitTextRecognition.recognize(imageUri);
    const fullText = result.blocks.map((b: any) => b.text).join(' ');

    const viewsMatch = fullText.match(/(\d[\d,]+)\s*(views?|plays?|impressions?)/i);
    const reachMatch = fullText.match(/(\d[\d,]+)\s*(accounts?\s*reached|reach)/i);
    const interactionsMatch = fullText.match(/(\d[\d,]+)\s*(interactions?|engagements?)/i);

    return {
      views: viewsMatch ? parseInt(viewsMatch[1].replace(/,/g, '')) : null,
      reach: reachMatch ? parseInt(reachMatch[1].replace(/,/g, '')) : null,
      interactions: interactionsMatch ? parseInt(interactionsMatch[1].replace(/,/g, '')) : null,
      raw_text: fullText,
    };
  } catch {
    return {
      views: null,
      reach: null,
      interactions: null,
      raw_text: '',
    };
  }
}

export function fraudCheck(
  ocr: { views: number | null; reach: number | null; interactions: number | null },
  submission: {
    created_at: string;
    accepted_at: string;
    avg_views: number;
  }
): { flagged: boolean; flags: string[]; requires_manual_review: boolean; auto_reject: boolean } {
  const flags: string[] = [];

  if (ocr.views && ocr.views % 1000 === 0 && ocr.views > 5000) {
    flags.push('round_number');
  }

  if (ocr.views && submission.avg_views > 0 && ocr.views > submission.avg_views * 5) {
    flags.push('unusually_high_views');
  }

  if (ocr.views && ocr.views > 1000 && ocr.interactions === 0) {
    flags.push('zero_interactions');
  }

  const timeDiff = new Date(submission.created_at).getTime() - new Date(submission.accepted_at).getTime();
  if (timeDiff < 30 * 60 * 1000) {
    flags.push('submitted_too_fast');
  }

  return {
    flagged: flags.length > 0,
    flags,
    requires_manual_review: flags.length >= 2,
    auto_reject: flags.includes('zero_interactions') && flags.includes('round_number'),
  };
}
