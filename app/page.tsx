'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import GameGrid from '@/components/GameGrid';
import ScoreTable from '@/components/ScoreTable';
import { CHARACTER_DATA } from '@/data/characters';
import { speakCharacter } from '@/lib/audio';
import { fetchLeaderboard, fetchRecentHistory, saveScore } from '@/lib/scoreService';
import { createRoundGrid, formatTime, pickRandomCharacter } from '@/lib/game';
import { DifficultyOption, GameStatus, ScoreRow } from '@/types/game';
import { isSupabaseConfigured } from '@/lib/supabase';

const getConnectionHint = (message: string) => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('not configured')) {
    return '连接诊断：未检测到 Supabase 环境变量。请检查 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY。';
  }

  if (lowerMessage.includes('failed to fetch') || lowerMessage.includes('network')) {
    return '连接诊断：无法连接到服务。请确认 Supabase URL 可访问、网络正常，且未被代理/防火墙拦截。';
  }

  if (lowerMessage.includes('row-level security') || lowerMessage.includes('rls')) {
    return '连接诊断：数据库 RLS 拒绝写入。请为 public.tc_game_scores 添加允许 anon insert/select 的策略。';
  }

  if (lowerMessage.includes('permission denied')) {
    return '连接诊断：数据库权限不足。请确认使用的 Key 有权限写入 public.tc_game_scores。';
  }

  return '连接诊断：写入失败。请检查 Supabase 项目 URL/Key、表名 public.tc_game_scores、以及表字段是否为 player_name/grid_size/completion_time。';
};

export default function HomePage() {
  const [playerName, setPlayerName] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyOption>(3);
  const [targetChar, setTargetChar] = useState('');
  const [questionChar, setQuestionChar] = useState('');
  const [gridCells, setGridCells] = useState<string[]>([]);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('Press start to begin!');
  const [connectionHint, setConnectionHint] = useState('');
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [history, setHistory] = useState<ScoreRow[]>([]);
  const [leaderboard, setLeaderboard] = useState<ScoreRow[]>([]);

  const timerIsRunning = status === 'playing' && startTime !== null;

  const loadScorePanels = useCallback(async () => {
    const [historyData, leaderboardData] = await Promise.all([
      fetchRecentHistory(),
      fetchLeaderboard(difficulty),
    ]);
    setHistory(historyData);
    setLeaderboard(leaderboardData);
  }, [difficulty]);

  useEffect(() => {
    void loadScorePanels();
  }, [loadScorePanels]);

  useEffect(() => {
    if (!timerIsRunning || startTime === null) {
      return;
    }

    const interval = window.setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 50);

    return () => window.clearInterval(interval);
  }, [timerIsRunning, startTime]);

  const startRound = useCallback(() => {
    const selected = pickRandomCharacter(CHARACTER_DATA);
    const cells = createRoundGrid(CHARACTER_DATA, difficulty, selected.traditional);

    setTargetChar(selected.traditional);
    setQuestionChar(selected.simplified);
    setGridCells(cells);
    setStatus('playing');
    setStatusMessage('Listen and click the correct Traditional Chinese character!');
    setConnectionHint('');
    setSelectedCell(null);
    setStartTime(Date.now());
    setElapsedMs(0);
    speakCharacter(selected.simplified);
  }, [difficulty]);

  const onCellClick = async (value: string) => {
    if (status !== 'playing') {
      return;
    }

    setSelectedCell(value);

    if (value === targetChar) {
      const finishedMs = startTime ? Date.now() - startTime : elapsedMs;
      const completionTime = Number((finishedMs / 1000).toFixed(2));

      setElapsedMs(finishedMs);
      setStatus('correct');
      setStatusMessage(`Great job! Time: ${completionTime}s`);

      const result = await saveScore(playerName.trim(), difficulty, completionTime);
      if (result.success) {
        setStatusMessage(`Great job! Time: ${completionTime}s. Score saved.`);
        setConnectionHint('');
      } else {
        setStatusMessage(`Great job! Time: ${completionTime}s. ${result.message}`);
        setConnectionHint(getConnectionHint(result.message));
      }

      await loadScorePanels();
      return;
    }

    setStatus('incorrect');
    setStatusMessage('Oops! Try again.');

    window.setTimeout(() => {
      setStatus('playing');
      setSelectedCell(null);
      setStatusMessage('Keep trying!');
    }, 450);
  };

  const formattedTimer = useMemo(() => formatTime(elapsedMs), [elapsedMs]);

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-center text-4xl font-extrabold text-orange-600">
        Traditional Chinese Character Recognition Game
      </h1>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-4 rounded-2xl bg-orange-50 p-5 shadow">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-lg font-semibold">Player Name:</label>
            <input
              value={playerName}
              onChange={(event) => setPlayerName(event.target.value)}
              placeholder="Optional"
              className="rounded-lg border border-orange-200 px-3 py-2 text-lg"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-semibold">Difficulty:</span>
            {[3, 4, 5].map((size) => (
              <button
                key={size}
                onClick={() => setDifficulty(size as DifficultyOption)}
                className={`rounded-lg px-4 py-2 text-lg font-semibold ${
                  difficulty === size ? 'bg-orange-500 text-white' : 'bg-white'
                }`}
              >
                {size}×{size}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-lg bg-white px-4 py-2 text-xl font-bold">Timer: {formattedTimer}</div>
            <button onClick={startRound} className="rounded-lg bg-blue-500 px-4 py-2 text-lg text-white">
              {status === 'idle' ? 'Start' : 'Restart / Next Round'}
            </button>
            <button
              onClick={() => speakCharacter(questionChar)}
              disabled={!questionChar}
              className="rounded-lg bg-purple-500 px-4 py-2 text-lg text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Replay Audio
            </button>
          </div>

          <p className="text-lg font-semibold text-slate-700">{statusMessage}</p>
          {connectionHint && <p className="rounded-lg bg-yellow-100 p-3 text-sm text-yellow-900">{connectionHint}</p>}
          {questionChar && (
            <p className="text-lg">Question (Simplified): <span className="text-2xl font-bold">{questionChar}</span></p>
          )}

          {gridCells.length > 0 && (
            <GameGrid
              cells={gridCells}
              gridSize={difficulty}
              selectedCell={selectedCell}
              correctAnswer={targetChar}
              status={status}
              onCellClick={onCellClick}
            />
          )}
        </section>

        <aside className="space-y-4">
          {!isSupabaseConfigured && (
            <div className="rounded-2xl bg-yellow-100 p-4 text-sm text-yellow-800 shadow">
              Supabase is not configured. Gameplay still works locally, but score saving is disabled.
            </div>
          )}
          <ScoreTable title="Recent History" scores={history} />
          <ScoreTable title={`Leaderboard (${difficulty}×${difficulty})`} scores={leaderboard} />
        </aside>
      </div>
    </main>
  );
}
