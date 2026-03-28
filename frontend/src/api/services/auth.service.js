import { supabase } from '../config/supabase';
import { toFriendlyAuthError } from '../authErrors';

/** Column missing from DB / schema cache (migration not applied). */
function unknownColumnFromError(error) {
  const msg = String(error?.message || '');
  const m = msg.match(/Could not find the '([^']+)' column/i);
  return m ? m[1] : null;
}

function isUnknownColumnError(error) {
  if (error?.code === 'PGRST204') return true;
  return /Could not find the '[^']+' column/i.test(String(error?.message || ''));
}

function normalizeProfileFullName(value) {
  if (value == null) return 'Member';
  if (typeof value === 'string') {
    const t = value.trim();
    return t || 'Member';
  }
  if (typeof value === 'object') {
    try {
      const s = JSON.stringify(value);
      return s.length > 200 ? `${s.slice(0, 200)}...` : s;
    } catch {
      return 'Member';
    }
  }
  return String(value).trim() || 'Member';
}

async function profilesUpdateResilient(userId, patch) {
  let current = { ...patch };
  for (let attempt = 0; attempt < 24; attempt++) {
    const keys = Object.keys(current);
    if (keys.length === 0) return;
    const { error } = await supabase.from('profiles').update(current).eq('id', userId);
    if (!error) return;
    if (!isUnknownColumnError(error)) throw error;
    const col = unknownColumnFromError(error);
    if (!col || !(col in current)) throw error;
    const next = { ...current };
    delete next[col];
    current = next;
  }
  throw new Error('Profile update failed: too many unknown columns');
}

async function profilesInsertResilient(row) {
  let current = { ...row };
  for (let attempt = 0; attempt < 24; attempt++) {
    const { error } = await supabase.from('profiles').insert([current]);
    if (!error) return;
    if (!isUnknownColumnError(error)) throw error;
    const col = unknownColumnFromError(error);
    if (!col || !(col in current)) throw error;
    const next = { ...current };
    delete next[col];
    current = next;
  }
  throw new Error('Profile insert failed: too many unknown columns');
}

async function profilesUpsertResilient(rows, options) {
  let current = rows.map((r) => ({ ...r }));
  for (let attempt = 0; attempt < 24; attempt++) {
    const { error } = await supabase.from('profiles').upsert(current, options);
    if (!error) return;
    if (!isUnknownColumnError(error)) throw error;
    const col = unknownColumnFromError(error);
    if (!col) throw error;
    current = current.map((r) => {
      const c = { ...r };
      delete c[col];
      return c;
    });
  }
  throw new Error('Profile upsert failed: too many unknown columns');
}

export const authService = {
  /**
   * Register a new user and create their profile
   */
  async signUp(email, password, fullName, charityId = null, plan = null, charityPercentage = 10) {
    const emailNorm = String(email).trim().toLowerCase();

    // 1. Register with Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: emailNorm,
      password,
      options: {
        ...(typeof window !== 'undefined'
          ? { emailRedirectTo: `${window.location.origin}/` }
          : {}),
        data: {
          full_name: fullName
        }
      }
    });

    if (authError) throw toFriendlyAuthError(authError);

    // If email confirmations are enabled, signUp may not create a session immediately.
    // In that case, we cannot write to RLS-protected tables with the anon key (would 401).
    if (authData.user && authData.session) {
      try {
        await profilesUpsertResilient(
          [
            {
              id: authData.user.id,
              email: emailNorm,
              full_name: fullName,
              charity_id: charityId,
              plan,
              charity_percentage: charityPercentage,
              status: 'inactive',
            },
          ],
          { onConflict: 'id' }
        );
      } catch (profileError) {
        console.error('Profile creation error:', profileError);
      }
    }

    return authData;
  },

  /**
   * Log an existing user in
   */
  async signIn(email, password) {
    const emailNorm = String(email).trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailNorm,
      password
    });
    if (error) throw toFriendlyAuthError(error);
    return data;
  },

  /**
   * Log out the current session
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get the current session (does not throw — callers can clear storage on error).
   * A stale refresh token often yields 400 on /auth/v1/token until local session is cleared.
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    return { session: data?.session ?? null, error };
  },

  /**
   * Fetch a user's rich profile data from the profiles table
   */
  async getProfile(userId) {
    // Use maybeSingle: .single() returns HTTP 406 when no row exists (PGRST116)
    const { data, error } = await supabase
      .from('profiles')
      .select('*, charities(name, image_url)')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
    }
    return data;
  },

  /**
   * Ensure a profile row exists for the current authenticated user.
   * Safe to call after login; requires a valid session for RLS.
   */
  async ensureProfile({
    id,
    email,
    full_name,
    charity_id = null,
    plan = null,
    charity_percentage = 10,
  }) {
    const safeName = normalizeProfileFullName(full_name);
    const existing = await this.getProfile(id);
    if (existing) {
      const patch = {};
      if (email && existing.email !== email) patch.email = email;
      if (safeName && existing.full_name !== safeName) patch.full_name = safeName;
      if (Object.keys(patch).length) await profilesUpdateResilient(id, patch);
      return;
    }

    await profilesInsertResilient({
      id,
      email: email || null,
      full_name: safeName,
      charity_id,
      plan,
      charity_percentage,
      status: 'inactive',
    });
  },

  async updateProfileFields(userId, patch) {
    await profilesUpdateResilient(userId, patch);
  },
};
