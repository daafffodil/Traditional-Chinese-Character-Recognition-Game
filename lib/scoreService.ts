import { ScoreRow } from '@/types/game';

type GameMode = 'single_mapping' | 'multi_mapping';

type SaveScoreInput = {
  playerName: string;
  gridSize: number;
  completionTime: number;
  gameMode: GameMode;
  targetSimplified: string;
  questionType: 'single_choice' | 'multi_blank';
  blankCount: number;
  isCorrect: boolean;
};

const toSearchParams = (params: Record<string, string | number>) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    query.set(key, String(value));
  });

  return query.toString();
};

export const saveScore = async ({
  playerName,
  gridSize,
  completionTime,
  gameMode,
  targetSimplified,
  questionType,
  blankCount,
  isCorrect,
}: SaveScoreInput) => {
  try {
    const response = await fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerName,
        gridSize,
        completionTime,
        gameMode,
        targetSimplified,
        questionType,
        blankCount,
        isCorrect,
      }),
    });

    const payload = (await response.json()) as { success?: boolean; message?: string };

    if (!response.ok || !payload.success) {
      return { success: false, message: payload.message ?? 'Score was not saved.' };
    }

    return { success: true, message: 'Score saved!' };
  } catch {
    return { success: false, message: 'Save failed due to a network or configuration issue.' };
  }
};

export const fetchRecentHistory = async (gameMode: GameMode, limit = 8): Promise<ScoreRow[]> => {
  try {
    const query = toSearchParams({ historyLimit: limit, leaderboardLimit: 1, gridSize: 3, gameMode });
    const response = await fetch(`/api/scores?${query}`, { method: 'GET' });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as { history?: ScoreRow[] };
    return payload.history ?? [];
  } catch {
    return [];
  }
};

export const fetchLeaderboard = async (gridSize: number, gameMode: GameMode, limit = 10): Promise<ScoreRow[]> => {
  try {
    const query = toSearchParams({ historyLimit: 1, leaderboardLimit: limit, gridSize, gameMode });
    const response = await fetch(`/api/scores?${query}`, { method: 'GET' });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as { leaderboard?: ScoreRow[] };
    return payload.leaderboard ?? [];
  } catch {
    return [];
  }
};
