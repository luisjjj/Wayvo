const TERMII_API_KEY = process.env.TERMII_API_KEY || '';
const TERMII_SENDER_ID = process.env.TERMII_SENDER_ID || 'Wayvo';
const TERMII_BASE_URL = 'https://api.termii.com/api';

interface SendMessageParams {
  to: string;
  message: string;
  channel: 'whatsapp' | 'sms';
}

export async function sendWhatsAppMessage({ to, message }: SendMessageParams) {
  try {
    const response = await fetch(`${TERMII_BASE_URL}/messaging/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: TERMII_API_KEY,
        type: 'whatsapp',
        from: TERMII_SENDER_ID,
        to,
        channel: 'whatsapp',
        message,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Termii WhatsApp error:', error);
    throw error;
  }
}

export async function sendSms({ to, message }: SendMessageParams) {
  try {
    const response = await fetch(`${TERMII_BASE_URL}/messaging/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: TERMII_API_KEY,
        type: 'plain',
        from: TERMII_SENDER_ID,
        to,
        channel: 'sms',
        message,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Termii SMS error:', error);
    throw error;
  }
}

export const notificationTemplates = {
  campaign_assigned: (name: string, brand: string, payout: number, platform: string, deadline: string) =>
    `🎯 New campaign for you, ${name}!\n\n*${brand}* wants you to post on *${platform}*.\nYour payout: *₦${payout.toLocaleString()}*\nDeadline: ${deadline}\n\nOpen Wayvo to see the brief and accept 👉`,

  proof_approved: (name: string, amount: number, balance: number) =>
    `✅ Proof approved, ${name}!\n\n*₦${amount.toLocaleString()}* has been added to your Wayvo wallet.\nNew balance: ₦${balance.toLocaleString()}\n\nWithdraw anytime in the app 💸`,

  campaign_live: (brandName: string, campaignTitle: string, numWavers: number) =>
    `🚀 Your campaign is live!\n\n*${campaignTitle}* has been matched with *${numWavers} Wavers*. They'll start posting within 24hrs.\n\nTrack progress in your Wayvo dashboard 📊`,

  proof_verified: (brandName: string, waverName: string, views: number) =>
    `📈 Campaign update!\n\n*${waverName}* just posted your campaign and reached *${views.toLocaleString()} views*.\n\nCheck your campaign tracker for full stats.`,
};
