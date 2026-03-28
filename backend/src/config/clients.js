import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
export const stripe = stripeSecret ? new Stripe(stripeSecret) : null;
export const stripeConfigured = Boolean(stripeSecret);

export const supabaseUrl = process.env.SUPABASE_URL || '';
export const anonKey = process.env.SUPABASE_ANON_KEY || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabaseAdmin =
  supabaseUrl && serviceKey ? createClient(supabaseUrl, serviceKey) : null;

export const supabaseAdminConfigured = Boolean(supabaseAdmin);

export function createSupabaseAnon() {
  if (!supabaseUrl || !anonKey) return null;
  return createClient(supabaseUrl, anonKey);
}
