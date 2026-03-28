import { Router } from 'express';
import { stripe, supabaseAdmin, createSupabaseAnon } from '../config/clients.js';
import { FRONTEND_URL } from '../config/env.js';

export const stripeApiRouter = Router();

stripeApiRouter.post('/create-checkout-session', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        error: 'Stripe not configured',
        hint: 'Set STRIPE_SECRET_KEY and price IDs in backend .env',
      });
    }
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ error: 'Missing authorization' });

    const anon = createSupabaseAnon();
    if (!anon) {
      return res.status(503).json({ error: 'Supabase anon client not configured' });
    }

    const {
      data: { user },
      error: userErr,
    } = await anon.auth.getUser(token);
    if (userErr || !user) return res.status(401).json({ error: 'Invalid session' });

    const { priceKey } = req.body;
    const priceId =
      priceKey === 'yearly'
        ? process.env.STRIPE_PRICE_YEARLY
        : process.env.STRIPE_PRICE_MONTHLY;
    if (!priceId) {
      return res.status(503).json({
        error: 'Missing STRIPE_PRICE_MONTHLY or STRIPE_PRICE_YEARLY in .env',
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/subscription/cancelled`,
      client_reference_id: user.id,
      metadata: { supabase_user_id: user.id },
      subscription_data: {
        metadata: { supabase_user_id: user.id },
      },
      customer_email: user.email || undefined,
    });

    res.json({ url: session.url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || 'Checkout failed' });
  }
});

stripeApiRouter.post('/create-donation-session', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        error: 'Stripe not configured',
        hint: 'Set STRIPE_SECRET_KEY in backend .env',
      });
    }
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ error: 'Missing authorization' });

    const anon = createSupabaseAnon();
    if (!anon) {
      return res.status(503).json({ error: 'Supabase anon client not configured' });
    }

    const {
      data: { user },
      error: userErr,
    } = await anon.auth.getUser(token);
    if (userErr || !user) return res.status(401).json({ error: 'Invalid session' });

    const { amountGbp, charityId, charityName } = req.body || {};
    const amt = Number(amountGbp);
    if (!Number.isFinite(amt) || amt < 1 || amt > 5000) {
      return res.status(400).json({ error: 'Amount must be between £1 and £5000' });
    }
    const name =
      typeof charityName === 'string' && charityName.trim()
        ? charityName.trim().slice(0, 120)
        : 'Charity donation';
    const cid =
      typeof charityId === 'string' && charityId.trim() ? charityId.trim() : '';

    const unitAmount = Math.round(amt * 100);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `Donation — ${name}`,
              description: 'One-off voluntary donation via Fairshare',
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `${FRONTEND_URL}/dashboard/charity?donation=success`,
      cancel_url: `${FRONTEND_URL}/dashboard/charity?donation=cancelled`,
      client_reference_id: user.id,
      metadata: {
        supabase_user_id: user.id,
        type: 'charity_donation',
        charity_id: cid,
      },
      customer_email: user.email || undefined,
    });

    res.json({ url: session.url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || 'Donation checkout failed' });
  }
});

stripeApiRouter.post('/customer-portal', async (req, res) => {
  try {
    if (!stripe || !supabaseAdmin) {
      return res.status(503).json({ error: 'Billing not configured' });
    }
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ error: 'Missing authorization' });

    const anon = createSupabaseAnon();
    if (!anon) {
      return res.status(503).json({ error: 'Supabase anon client not configured' });
    }

    const {
      data: { user },
      error: userErr,
    } = await anon.auth.getUser(token);
    if (userErr || !user) return res.status(401).json({ error: 'Invalid session' });

    const { data: profile, error: pErr } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .maybeSingle();

    if (pErr || !profile?.stripe_customer_id) {
      return res.status(400).json({
        error: 'No Stripe customer yet. Subscribe from Pricing first.',
      });
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${FRONTEND_URL}/dashboard/settings`,
    });

    res.json({ url: portal.url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || 'Portal failed' });
  }
});
