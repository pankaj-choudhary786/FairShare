import { supabase } from '../config/supabase';

export const adminService = {
  async listProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async updateProfile(userId, patch) {
    const { error } = await supabase.from('profiles').update(patch).eq('id', userId);
    if (error) throw error;
  },

  async countScoresForUser(userId) {
    const { count, error } = await supabase
      .from('scores')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    if (error) throw error;
    return count ?? 0;
  },
};
