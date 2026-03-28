import { supabase } from '../config/supabase';

export const charityService = {
  /**
   * Fetch all active charities for the directory
   */
  async getAllCharities() {
    const { data, error } = await supabase
      .from('charities')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('name');
      
    if (error) throw error;
    return data;
  },

  /**
   * Fetch a single charity by ID
   */
  async getCharityById(id) {
    const { data, error } = await supabase
      .from('charities')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createCharity(row) {
    const { data, error } = await supabase.from('charities').insert([row]).select().single();
    if (error) throw error;
    return data;
  },

  async updateCharity(id, patch) {
    const { data, error } = await supabase.from('charities').update(patch).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteCharity(id) {
    const { error } = await supabase.from('charities').delete().eq('id', id);
    if (error) throw error;
  },

  async listEvents(charityId) {
    const { data, error } = await supabase
      .from('charity_events')
      .select('*')
      .eq('charity_id', charityId)
      .order('event_date', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async saveEvent(payload) {
    const { id, ...rest } = payload;
    if (id) {
      const { data, error } = await supabase.from('charity_events').update(rest).eq('id', id).select().single();
      if (error) throw error;
      return data;
    }
    const { data, error } = await supabase.from('charity_events').insert([rest]).select().single();
    if (error) throw error;
    return data;
  },

  async deleteEvent(eventId) {
    const { error } = await supabase.from('charity_events').delete().eq('id', eventId);
    if (error) throw error;
  },

  /**
   * Update a user's chosen charity and contribution percentage
   */
  async updateUserCharityPrefs(userId, charityId, percentage) {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        charity_id: charityId,
        charity_percentage: percentage
      })
      .eq('id', userId);

    if (error) throw error;
  }
};
