export const PORT = Number(process.env.PORT) || 4000;

export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export const corsOrigins = [
  FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
];
