import { Router } from 'express';
import { stripeConfigured, supabaseAdminConfigured } from '../config/clients.js';

export const healthRouter = Router();

healthRouter.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'fairshare-backend',
    time: new Date().toISOString(),
    stripe: stripeConfigured,
    supabaseService: supabaseAdminConfigured,
  });
});
