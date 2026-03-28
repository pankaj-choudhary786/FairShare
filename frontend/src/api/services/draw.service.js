import { supabase } from '../config/supabase';

export const drawService = {
  /**
   * Get all completed draws
   */
  async getDrawHistory() {
    const { data, error } = await supabase
      .from('draws')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },

  /**
   * Admin: Simulate and create a new draw
   */
  async runDraw(monthName, prizePool, winningNumbers, drawMode = 'random', jackpotRollover = 0) {
    const { data, error } = await supabase
      .from('draws')
      .insert([
        {
          month_name: monthName,
          winning_numbers: winningNumbers,
          prize_pool: prizePool,
          status: 'completed',
          draw_mode: drawMode,
          jackpot_rollover: jackpotRollover,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
