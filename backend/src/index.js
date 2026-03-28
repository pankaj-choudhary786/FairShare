import 'dotenv/config';
import { createApp } from './app.js';
import { PORT } from './config/env.js';

if (!process.env.STRIPE_SECRET_KEY?.trim()) {
  console.warn(
    '[fairshare-backend] STRIPE_SECRET_KEY is unset — subscription checkout and donations will return 503. Copy .env.example to .env and add your test key.'
  );
}

const app = createApp();

app.listen(PORT, () => {
  console.log(`Fairshare backend: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
});
