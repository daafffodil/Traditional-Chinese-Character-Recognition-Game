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
};
