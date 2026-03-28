-- Quick fix when the app errors with: Could not find the 'email' column of 'profiles'
-- Run in Supabase SQL Editor (safe to run multiple times).
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
