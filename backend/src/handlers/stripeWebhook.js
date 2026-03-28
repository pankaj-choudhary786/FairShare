import { stripe, supabaseAdmin } from '../config/clients.js';

export async function handleStripeWebhook(req, res) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(503).send('Stripe not configured');
  }

  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (!supabaseAdmin) {
    return res.status(503).json({ error: 'Supabase admin not configured' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.supabase_user_id || session.client_reference_id;
        if (!userId || !session.subscription) break;

        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        const priceId = subscription.items.data[0]?.price?.id;
        const plan =
          priceId === process.env.STRIPE_PRICE_YEARLY ? 'yearly' : 'monthly';

        await supabaseAdmin
          .from('profiles')
          .update({
            stripe_customer_id: session.customer,
            stripe_subscription_id: subscription.id,
            subscription_current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            status: 'active',
            plan,
          })
          .eq('id', userId);
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const customerId = sub.customer;

        const { data: profiles } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .limit(1);

        const row = profiles?.[0];
        if (!row) break;

        if (sub.status === 'active' || sub.status === 'trialing') {
          const priceId = sub.items.data[0]?.price?.id;
          const plan =
            priceId === process.env.STRIPE_PRICE_YEARLY ? 'yearly' : 'monthly';
          await supabaseAdmin
            .from('profiles')
            .update({
              stripe_subscription_id: sub.id,
              subscription_current_period_end: new Date(
                sub.current_period_end * 1000
              ).toISOString(),
              status: 'active',
              plan,
            })
            .eq('id', row.id);
        } else {
          await supabaseAdmin
            .from('profiles')
            .update({
              status: sub.status === 'canceled' ? 'inactive' : 'lapsed',
              subscription_current_period_end: sub.current_period_end
                ? new Date(sub.current_period_end * 1000).toISOString()
                : null,
            })
            .eq('id', row.id);
        }
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error('Webhook handler error:', e);
    return res.status(500).json({ error: e.message });
  }

  res.json({ received: true });
}
