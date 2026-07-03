const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

interface TransferParams {
  amount: number;
  recipientCode: string;
  reason: string;
  reference?: string;
}

interface RecipientParams {
  type: 'nuban';
  name: string;
  account_number: string;
  bank_code: string;
  currency: 'NGN';
}

async function paystackRequest(endpoint: string, method: string = 'GET', body?: any) {
  const response = await fetch(`${PAYSTACK_BASE_URL}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();
  if (!data.status) {
    throw new Error(data.message || 'Paystack error');
  }
  return data;
}

export async function createRecipient(params: RecipientParams) {
  return paystackRequest('/transferrecipient', 'POST', params);
}

export async function initiateTransfer(params: TransferParams) {
  return paystackRequest('/transfer', 'POST', {
    source: 'balance',
    amount: params.amount * 100,
    recipient: params.recipientCode,
    reason: params.reason,
    reference: params.reference,
  });
}

export async function verifyTransfer(reference: string) {
  return paystackRequest(`/transfer/verify/${reference}`);
}

export async function initializeTransaction(email: string, amount: number, reference: string) {
  return paystackRequest('/transaction/initialize', 'POST', {
    email,
    amount: amount * 100,
    reference,
    callback_url: `${process.env.EXPO_PUBLIC_APP_URL}/payment/callback`,
  });
}

export async function verifyTransaction(reference: string) {
  return paystackRequest(`/transaction/verify/${reference}`);
}

export async function createCustomer(email: string, firstName: string, lastName: string, phone?: string) {
  return paystackRequest('/customer', 'POST', {
    email,
    first_name: firstName,
    last_name: lastName,
    phone,
  });
}

export async function createPlan(name: string, amount: number, interval: 'monthly' | 'annually') {
  return paystackRequest('/plan', 'POST', {
    name,
    amount: amount * 100,
    interval,
    currency: 'NGN',
  });
}

export async function createSubscription(customerCode: string, planCode: string) {
  return paystackRequest('/subscription', 'POST', {
    customer: customerCode,
    plan: planCode,
  });
}

export async function cancelSubscription(subscriptionCode: string, token: string) {
  return paystackRequest(`/subscription/disable`, 'POST', {
    code: subscriptionCode,
    token,
  });
}

export async function refundTransaction(transactionReference: string) {
  return paystackRequest('/refund', 'POST', {
    transaction: transactionReference,
  });
}

export const bankCodes: Record<string, string> = {
  'Access Bank': '044',
  'Citibank Nigeria': '023',
  'Ecobank Nigeria': '050',
  'Fidelity Bank Nigeria': '070',
  'First Bank of Nigeria': '011',
  'First City Monument Bank': '214',
  'Globus Bank': '010',
  'Guaranty Trust Bank': '058',
  'Heritage Bank': '030',
  'Keystone Bank': '082',
  'Kuda Bank': '09026',
  'Opay': '09026',
  'Paga': '09026',
  'PALMPAY': '09026',
  'Providus Bank': '101',
  'Stanbic IBTC Bank': '039',
  'Standard Chartered Bank': '068',
  'Sterling Bank': '232',
  'SunTrust Bank': '100',
  'Titan Trust Bank': '102',
  'Union Bank of Nigeria': '032',
  'United Bank for Africa': '033',
  'Unity Bank': '215',
  'VFD Microfinance Bank': '09028',
  'Wema Bank': '035',
  'Zenith Bank': '057',
};
