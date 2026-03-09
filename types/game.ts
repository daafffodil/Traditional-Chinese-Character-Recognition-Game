export type CharacterItem = {
  simplified: string;
  traditional: string;
};

export type DifficultyOption = 3 | 4 | 5;

export type GameStatus = 'idle' | 'playing' | 'correct' | 'incorrect';

export type ScoreRow = {
  id: string;
  player_name: string;
  grid_size: number;
  completion_time: number;
  created_at: string;
  game_mode?: 'single_mapping' | 'multi_mapping';
  target_simplified?: string | null;
  question_type?: 'single_choice' | 'multi_blank' | null;
  blank_count?: number | null;
  is_correct?: boolean | null;
};
