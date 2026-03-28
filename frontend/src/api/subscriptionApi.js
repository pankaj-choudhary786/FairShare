import { supabase } from './config/supabase';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function authHeader() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('You must be signed in.');
  return { Authorization: `Bearer ${session.access_token}` };
}

export async function createCheckoutSession(priceKey) {
  const headers = await authHeader();
  const res = await fetch(`${API_BASE}/stripe/create-checkout-session`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceKey }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || 'Could not start checkout');
  if (body.url) window.location.href = body.url;
  return body;
}

export async function createCustomerPortalSession() {
  const headers = await authHeader();
  const res = await fetch(`${API_BASE}/stripe/customer-portal`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || 'Could not open billing portal');
  if (body.url) window.location.href = body.url;
  return body;
}

/** One-off charity donation in GBP (requires backend Stripe + logged-in user). */
export async function createDonationCheckoutSession({ amountGbp, charityId, charityName }) {
  const headers = await authHeader();
  const res = await fetch(`${API_BASE}/stripe/create-donation-session`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ amountGbp, charityId, charityName }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 503) {
      throw new Error(
        body.error ||
          'Donations need the API running with Stripe: set STRIPE_SECRET_KEY in fairshare/backend/.env and restart the server.'
      );
    }
    throw new Error(body.error || body.hint || 'Could not start donation');
  }
  if (body.url) window.location.href = body.url;
  return body;
}
