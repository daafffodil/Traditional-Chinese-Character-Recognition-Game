import { ScoreRow } from '@/types/game';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export const saveScore = async (playerName: string, gridSize: number, completionTime: number) => {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, message: 'Supabase is not configured. Score was not saved.' };
  }

  const { error } = await supabase
    .schema('public')
    .from('tc_game_scores')
    .insert({
      player_name: playerName || 'Anonymous',
      grid_size: gridSize,
      completion_time: completionTime,
    });

  if (error) {
    return { success: false, message: `Save failed: ${error.message}` };
  }

  return { success: true, message: 'Score saved!' };
};

export const fetchRecentHistory = async (limit = 8): Promise<ScoreRow[]> => {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .schema('public')
    .from('tc_game_scores')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data;
};

export const fetchLeaderboard = async (gridSize: number, limit = 10): Promise<ScoreRow[]> => {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .schema('public')
    .from('tc_game_scores')
    .select('*')
    .eq('grid_size', gridSize)
    .order('completion_time', { ascending: true })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data;
};
