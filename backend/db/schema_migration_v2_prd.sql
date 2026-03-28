-- Fairshare PRD migration — run in Supabase SQL Editor AFTER base schema.sql
-- Order matters: function is_admin() before policies that call it.

-- ---------------------------------------------------------------------------
-- 1. Columns
-- ---------------------------------------------------------------------------
ALTER TABLE public.charities ADD COLUMN IF NOT EXISTS donation_url TEXT;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notify_draw_alerts BOOLEAN DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notify_news BOOLEAN DEFAULT true;

DO $$ BEGIN
  ALTER TABLE public.draws ADD COLUMN draw_mode TEXT DEFAULT 'random';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.draws ADD CONSTRAINT draws_draw_mode_check
    CHECK (draw_mode IS NULL OR draw_mode IN ('random', 'weighted'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE public.draws ADD COLUMN IF NOT EXISTS jackpot_rollover DECIMAL DEFAULT 0;

-- ---------------------------------------------------------------------------
-- 2. Admin helper (must exist before admin policies)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE((SELECT p.is_admin FROM public.profiles p WHERE p.id = auth.uid()), false);
$$;

-- ---------------------------------------------------------------------------
-- 3. Charity events table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.charity_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  charity_id UUID NOT NULL REFERENCES public.charities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  event_date DATE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.charity_events ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 4. Profiles policies
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON public.profiles;

CREATE POLICY "profiles_select_own_or_admin"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own_or_admin"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin());

-- ---------------------------------------------------------------------------
-- 5. Charities admin write
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "charities_admin_insert" ON public.charities;
DROP POLICY IF EXISTS "charities_admin_update" ON public.charities;
DROP POLICY IF EXISTS "charities_admin_delete" ON public.charities;

CREATE POLICY "charities_admin_insert"
  ON public.charities FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "charities_admin_update"
  ON public.charities FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "charities_admin_delete"
  ON public.charities FOR DELETE
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- 6. Scores
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own scores" ON public.scores;
DROP POLICY IF EXISTS "scores_select_own_or_admin" ON public.scores;
DROP POLICY IF EXISTS "Users can insert own scores" ON public.scores;
DROP POLICY IF EXISTS "scores_insert_own" ON public.scores;
DROP POLICY IF EXISTS "scores_update_own_or_admin" ON public.scores;
DROP POLICY IF EXISTS "scores_delete_own_or_admin" ON public.scores;

CREATE POLICY "scores_select_own_or_admin"
  ON public.scores FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "scores_insert_own"
  ON public.scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "scores_update_own_or_admin"
  ON public.scores FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "scores_delete_own_or_admin"
  ON public.scores FOR DELETE
  USING (auth.uid() = user_id OR public.is_admin());

-- ---------------------------------------------------------------------------
-- 7. Draws
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Draws are viewable by everyone" ON public.draws;
DROP POLICY IF EXISTS "draws_select_all" ON public.draws;
DROP POLICY IF EXISTS "draws_admin_insert" ON public.draws;
DROP POLICY IF EXISTS "draws_admin_update" ON public.draws;

CREATE POLICY "draws_select_all"
  ON public.draws FOR SELECT
  USING (true);

CREATE POLICY "draws_admin_insert"
  ON public.draws FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "draws_admin_update"
  ON public.draws FOR UPDATE
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- 8. Verifications
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own verifications" ON public.verifications;
DROP POLICY IF EXISTS "verifications_select_own_or_admin" ON public.verifications;
DROP POLICY IF EXISTS "Users can insert own verifications" ON public.verifications;
DROP POLICY IF EXISTS "verifications_insert_own" ON public.verifications;
DROP POLICY IF EXISTS "verifications_update_admin" ON public.verifications;

CREATE POLICY "verifications_select_own_or_admin"
  ON public.verifications FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "verifications_insert_own"
  ON public.verifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "verifications_update_admin"
  ON public.verifications FOR UPDATE
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- 9. Charity events policies
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Charity events are viewable by everyone" ON public.charity_events;
DROP POLICY IF EXISTS "charity_events_select_all" ON public.charity_events;
DROP POLICY IF EXISTS "charity_events_admin_all" ON public.charity_events;
DROP POLICY IF EXISTS "Admins manage charity events" ON public.charity_events;

CREATE POLICY "charity_events_select_all"
  ON public.charity_events FOR SELECT
  USING (true);

CREATE POLICY "charity_events_admin_all"
  ON public.charity_events FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
