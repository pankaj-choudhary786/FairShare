import express from 'express';
import cors from 'cors';
import { corsOrigins } from './config/env.js';
import { handleStripeWebhook } from './handlers/stripeWebhook.js';
import { healthRouter } from './routes/health.js';
import { stripeApiRouter } from './routes/stripeApi.js';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: corsOrigins,
      credentials: true,
    })
  );

  app.post(
    '/api/stripe/webhook',
    express.raw({ type: 'application/json' }),
    handleStripeWebhook
  );

  app.use(express.json());

  app.use('/api', healthRouter);
  app.use('/api/stripe', stripeApiRouter);

  return app;
}
