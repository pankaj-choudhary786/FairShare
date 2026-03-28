import { supabase } from '../config/supabase';

export const verificationService = {
  /**
   * Fetch all verifications for a specific user
   */
  async getUserVerifications(userId) {
    const { data, error } = await supabase
      .from('verifications')
      .select('*, draws(month_name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },

  /**
   * Submit a new verification claim with proof URL (after uploading to storage)
   */
  async submitVerification(userId, drawId, proofUrl, matchTier, estimatedPrize) {
    const { data, error } = await supabase
      .from('verifications')
      .insert([
        {
          user_id: userId,
          draw_id: drawId,
          proof_image_url: proofUrl,
          match_tier: matchTier,
          prize_amount: estimatedPrize,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Admin: fetch all pending verifications
   */
  async getPendingVerifications() {
    const { data, error } = await supabase
      .from('verifications')
      .select('*, profiles(full_name), draws(month_name)')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    return data;
  },

  /**
   * Admin: approve or reject a verification
   */
  async updateVerificationStatus(verificationId, status) {
    const { data, error } = await supabase
      .from('verifications')
      .update({ status })
      .eq('id', verificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
