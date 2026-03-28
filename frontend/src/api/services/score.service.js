import { supabase } from '../config/supabase';

function isLikelyNetworkError(err) {
  const msg = err?.message || String(err);
  return (
    msg.includes('Failed to fetch') ||
    msg.includes('NetworkError') ||
    msg.includes('ERR_NETWORK') ||
    msg.includes('Load failed')
  );
}

async function withNetworkRetry(operation, retries = 2, baseDelayMs = 600) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (e) {
      lastErr = e;
      if (!isLikelyNetworkError(e) || attempt === retries) throw e;
      await new Promise((r) => setTimeout(r, baseDelayMs * (attempt + 1)));
    }
  }
  throw lastErr;
}

export const scoreService = {
  /**
   * Fetch the user's latest 5 scores (Stableford rolling 5 rule)
   */
  async getUserScores(userId) {
    return withNetworkRetry(async () => {
      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .eq('user_id', userId)
        .order('played_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    });
  },

  /**
   * Add a new score. If they have 5, the trigger (or logic here) drops the oldest.
   * For simplicity in this logic, we just insert. We can manage the "rolling 5" on read 
   * by only taking the top 5, or by actually deleting the 6th oldest here.
   */
  async submitScore(userId, scoreValue, playedAt = new Date().toISOString()) {
    const { data, error } = await supabase
      .from('scores')
      .insert([
        { 
          user_id: userId,
          score: scoreValue, 
          played_at: playedAt 
        }
      ])
      .select();

    if (error) throw error;
    
    // Optional: Housekeeping to actually delete old scores to keep DB clean
    // This enforces the rolling 5 strictly at the DB level
    const { data: allScores, error: countErr } = await supabase
      .from('scores')
      .select('id')
      .eq('user_id', userId)
      .order('played_at', { ascending: false });

    if (!countErr && allScores && allScores.length > 5) {
      const idsToDelete = allScores.slice(5).map(s => s.id);
      await supabase.from('scores').delete().in('id', idsToDelete);
    }
    
    return data[0];
  },

  /**
   * Delete a specific score entry
   */
  async deleteScore(scoreId, userId) {
    const { error } = await supabase
      .from('scores')
      .delete()
      .eq('id', scoreId)
      .eq('user_id', userId); // Ensure they only delete their own
      
    if (error) throw error;
  }
};
