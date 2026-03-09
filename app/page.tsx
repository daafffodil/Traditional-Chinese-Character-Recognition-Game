'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import GameGrid from '@/components/GameGrid';
import ScoreTable from '@/components/ScoreTable';
import { CHARACTER_DATA } from '@/data/characters';
import { MULTI_BLANK_QUESTIONS, MultiBlankQuestion } from '@/data/multiBlankQuestions';
import { speakCharacter } from '@/lib/audio';
import { fetchLeaderboard, fetchRecentHistory, saveScore } from '@/lib/scoreService';
import { createRoundGrid, formatTime, pickRandomCharacter } from '@/lib/game';
import { DifficultyOption, GameStatus, ScoreRow } from '@/types/game';
import { isSupabaseConfigured } from '@/lib/supabase';

type GameMode = 'single_mapping' | 'multi_mapping';
type MultiMappingStatus = 'idle' | 'playing' | 'correct' | 'incorrect';

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

  return '连接诊断：写入失败。请检查 Supabase 项目 URL/Key、表名 public.tc_game_scores、以及所需字段是否完整（如 game_mode/target_simplified/question_type/blank_count/correct_blank_count/is_correct）。';
};

const pickRandomMultiQuestion = (excludeText?: string) => {
  const pool = MULTI_BLANK_QUESTIONS.filter((item) => item.text !== excludeText);
  const source = pool.length > 0 ? pool : MULTI_BLANK_QUESTIONS;
  return source[Math.floor(Math.random() * source.length)];
};

export default function HomePage() {
  const [mode, setMode] = useState<GameMode>('single_mapping');
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

  const [multiQuestion, setMultiQuestion] = useState<MultiBlankQuestion | null>(null);
  const [multiFilledAnswers, setMultiFilledAnswers] = useState<(string | null)[]>([]);
  const [currentBlankIndex, setCurrentBlankIndex] = useState(0);
  const [multiStatus, setMultiStatus] = useState<MultiMappingStatus>('idle');
  const [multiStatusMessage, setMultiStatusMessage] = useState('按「开始多空题」来挑战吧！');

  const [history, setHistory] = useState<ScoreRow[]>([]);
  const [leaderboard, setLeaderboard] = useState<ScoreRow[]>([]);
  const [scoreMessage, setScoreMessage] = useState('');

  const timerIsRunning = status === 'playing' && startTime !== null;

  const loadScorePanels = useCallback(async () => {
    const [historyData, leaderboardData] = await Promise.all([
      fetchRecentHistory(mode),
      fetchLeaderboard(difficulty, mode),
    ]);
    setHistory(historyData);
    setLeaderboard(leaderboardData);
  }, [difficulty, mode]);

  const persistScore = useCallback(
    async ({
      completionTime,
      gameMode,
      targetSimplified,
      questionType,
      blankCount,
      correctBlankCount,
      isCorrect,
      gridSize,
      successMessage,
      failureMessage,
      setModeStatusMessage,
    }: {
      completionTime: number;
      gameMode: GameMode;
      targetSimplified: string;
      questionType: 'single_choice' | 'multi_blank';
      blankCount: number;
      correctBlankCount: number;
      isCorrect: boolean;
      gridSize: number;
      successMessage?: string;
      failureMessage: string;
      setModeStatusMessage?: (message: string) => void;
    }) => {
      const normalizedPlayerName = playerName.trim() || 'Anonymous';
      const result = await saveScore({
        playerName: normalizedPlayerName,
        gridSize,
        completionTime,
        gameMode,
        targetSimplified,
        questionType,
        blankCount,
        correctBlankCount,
        isCorrect,
      });

      if (!result.success) {
        console.error('[scores] Failed to save score:', result.message);
        const errorHint = getConnectionHint(result.message);
        setConnectionHint(errorHint);
        setScoreMessage(failureMessage);
        if (setModeStatusMessage) {
          setModeStatusMessage(failureMessage);
        }
        return;
      }

      setConnectionHint('');
      setScoreMessage('');
      if (successMessage && setModeStatusMessage) {
        setModeStatusMessage(successMessage);
      }
      await loadScorePanels();
    },
    [loadScorePanels, playerName],
  );

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

  const startMultiQuestion = useCallback((excludeText?: string) => {
    const nextQuestion = pickRandomMultiQuestion(excludeText);

    setMultiQuestion(nextQuestion);
    setMultiFilledAnswers(Array.from({ length: nextQuestion.blanks.length }, () => null));
    setCurrentBlankIndex(0);
    setMultiStatus('playing');
    setMultiStatusMessage('请点击下方按钮，把正确的繁体字填进高亮空格。');
  }, []);

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

      await persistScore({
        gridSize: difficulty,
        completionTime,
        gameMode: 'single_mapping',
        targetSimplified: questionChar,
        questionType: 'single_choice',
        blankCount: 1,
        correctBlankCount: 1,
        isCorrect: true,
        successMessage: `Great job! Time: ${completionTime}s. Score saved.`,
        failureMessage: `Great job! Time: ${completionTime}s. 已完成本局，暂时无法同步到云端，游戏可继续进行。`,
        setModeStatusMessage: setStatusMessage,
      });
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

  const onMultiOptionClick = async (value: string) => {
    if (!multiQuestion || multiStatus !== 'playing') {
      return;
    }

    const updatedAnswers = [...multiFilledAnswers];
    updatedAnswers[currentBlankIndex] = value;

    const isLastBlank = currentBlankIndex >= multiQuestion.blanks.length - 1;

    setMultiFilledAnswers(updatedAnswers);

    if (!isLastBlank) {
      setCurrentBlankIndex(currentBlankIndex + 1);
      setMultiStatusMessage('很好！继续填下一格。');
      return;
    }

    const blankCount = multiQuestion.blanks.length;
    const rawCorrectBlankCount = multiQuestion.blanks.reduce(
      (count, blank, index) => (updatedAnswers[index] === blank.answer ? count + 1 : count),
      0,
    );
    const correctBlankCount = Math.min(blankCount, Math.max(0, rawCorrectBlankCount));
    const isAllCorrect = correctBlankCount === blankCount;

    if (isAllCorrect) {
      setMultiStatus('correct');
      setMultiStatusMessage('全对了！你真棒！');
    } else {
      setMultiStatus('incorrect');
      setMultiStatusMessage('有些空格还不对，按「重置本题」再试一次。');
    }

    await persistScore({
      gridSize: difficulty,
      completionTime: 0,
      gameMode: 'multi_mapping',
      targetSimplified: multiQuestion.simplified,
      questionType: 'multi_blank',
      blankCount,
      correctBlankCount,
      isCorrect: isAllCorrect,
      failureMessage: '多空题结果已在本地完成判定，云端保存暂时失败。',
    });
  };

  const resetMultiQuestion = () => {
    if (!multiQuestion) {
      return;
    }

    setMultiFilledAnswers(Array.from({ length: multiQuestion.blanks.length }, () => null));
    setCurrentBlankIndex(0);
    setMultiStatus('playing');
    setMultiStatusMessage('已重置，请从第一个空格开始。');
  };

  const multiSentenceParts = useMemo(() => {
    if (!multiQuestion) {
      return [];
    }
    return multiQuestion.text.split('□');
  }, [multiQuestion]);

  const multiExplanation = useMemo(() => {
    if (!multiQuestion || multiStatus === 'playing' || multiStatus === 'idle') {
      return '';
    }

    if (multiStatus === 'correct' && multiQuestion.overallExplanation) {
      return multiQuestion.overallExplanation;
    }

    return multiQuestion.blanks
      .map((blank, index) => `${index + 1}. ${blank.explanation ?? `正确答案：${blank.answer}`}`)
      .join(' ');
  }, [multiQuestion, multiStatus]);

  const formattedTimer = useMemo(() => formatTime(elapsedMs), [elapsedMs]);

  const multiCorrectCount = useMemo(() => {
    if (!multiQuestion) {
      return 0;
    }
    return multiQuestion.blanks.reduce(
      (count, blank, index) => (multiFilledAnswers[index] === blank.answer ? count + 1 : count),
      0,
    );
  }, [multiFilledAnswers, multiQuestion]);

  const feedbackMessage = useMemo(() => {
    if (mode === 'multi_mapping' && multiQuestion && (multiStatus === 'correct' || multiStatus === 'incorrect')) {
      return multiStatus === 'correct'
        ? `✅ Great job! You answered ${multiCorrectCount} / ${multiQuestion.blanks.length} correctly.`
        : `🌱 Good try! You answered ${multiCorrectCount} / ${multiQuestion.blanks.length} correctly.`;
    }

    if (mode === 'single_mapping') {
      if (status === 'correct') {
        return '✅ Great job! You found the right Traditional character.';
      }
      if (status === 'incorrect') {
        return '🌱 Good try! Keep listening and choose again.';
      }
    }

    return '';
  }, [mode, multiCorrectCount, multiQuestion, multiStatus, status]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 via-orange-50 to-rose-100 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl bg-white/85 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.1)] backdrop-blur-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-3xl font-black tracking-tight text-sky-700 md:text-4xl">🌟 Character Adventure</h1>
            <p className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">Traditional Chinese Learning Game</p>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-600">Player Name</span>
              <input
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
                placeholder="Optional (defaults to Anonymous)"
                className="w-full rounded-2xl border-0 bg-slate-100 px-4 py-3 text-base text-slate-700 shadow-inner outline-none ring-sky-300 transition focus:ring-2"
              />
            </label>

            <div className="space-y-2">
              <span className="text-sm font-semibold text-slate-600">Mode</span>
              <div className="flex rounded-2xl bg-slate-100 p-1">
                <button
                  onClick={() => setMode('single_mapping')}
                  className={`flex-1 rounded-xl px-3 py-2 text-sm font-bold transition-all ${
                    mode === 'single_mapping' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  single_mapping
                </button>
                <button
                  onClick={() => {
                    setMode('multi_mapping');
                    if (!multiQuestion) {
                      startMultiQuestion();
                    }
                  }}
                  className={`flex-1 rounded-xl px-3 py-2 text-sm font-bold transition-all ${
                    mode === 'multi_mapping' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  multi_mapping
                </button>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-[2rem] bg-white/90 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.12)] backdrop-blur-sm md:p-8">
              {mode === 'single_mapping' ? (
                <>
                  <div className="mb-5 flex flex-wrap items-center gap-3">
                    <p className="text-sm font-semibold text-slate-600">Difficulty</p>
                    {[3, 4, 5].map((size) => (
                      <button
                        key={size}
                        onClick={() => setDifficulty(size as DifficultyOption)}
                        className={`rounded-full px-4 py-2 text-sm font-bold transition-all active:scale-95 ${
                          difficulty === size
                            ? 'bg-sky-500 text-white shadow-[0_10px_20px_rgba(14,165,233,0.35)]'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {size}×{size}
                      </button>
                    ))}
                  </div>

                  <div className="mb-6 flex flex-wrap gap-3">
                    <button
                      onClick={startRound}
                      className="rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-3 text-base font-bold text-white shadow-[0_14px_30px_rgba(56,189,248,0.35)] transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {status === 'idle' ? 'Start' : 'Restart / Next Round'}
                    </button>
                    <button
                      onClick={() => speakCharacter(questionChar)}
                      disabled={!questionChar}
                      className="rounded-2xl bg-white px-5 py-3 text-base font-bold text-indigo-600 shadow-sm transition-all hover:bg-indigo-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Replay Audio
                    </button>
                    <div className="rounded-2xl bg-slate-100 px-4 py-3 text-base font-semibold text-slate-700">⏱️ {formattedTimer}</div>
                  </div>

                  <div className="space-y-3 text-center">
                    <p className="text-sm font-semibold tracking-wide text-slate-500">SIMPLIFIED PROMPT</p>
                    <p className="text-6xl font-black text-orange-500">{questionChar || '？'}</p>
                    <p className="text-base font-semibold text-slate-700">{statusMessage}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-5 flex flex-wrap gap-3">
                    <button
                      onClick={() => startMultiQuestion()}
                      className="rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-3 text-base font-bold text-white shadow-[0_14px_30px_rgba(56,189,248,0.35)] transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                      开始多空题
                    </button>
                    <button
                      onClick={resetMultiQuestion}
                      disabled={!multiQuestion}
                      className="rounded-2xl bg-white px-5 py-3 text-base font-bold text-amber-600 shadow-sm transition-all hover:bg-amber-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      重置本题
                    </button>
                    <button
                      onClick={() => startMultiQuestion(multiQuestion?.text)}
                      disabled={!multiQuestion}
                      className="rounded-2xl bg-white px-5 py-3 text-base font-bold text-emerald-600 shadow-sm transition-all hover:bg-emerald-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      下一题
                    </button>
                  </div>

                  <div className="mb-5 space-y-2 text-center">
                    <p className="text-sm font-semibold tracking-wide text-slate-500">SIMPLIFIED PROMPT</p>
                    <p className="text-5xl font-black text-orange-500">{multiQuestion?.simplified ?? '？'}</p>
                    <p className="text-base font-semibold text-slate-700">{multiStatusMessage}</p>
                  </div>

                  {multiQuestion && (
                    <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-white p-5 text-3xl leading-relaxed">
                      {multiSentenceParts.map((part, index) => {
                        const hasBlank = index < multiQuestion.blanks.length;
                        const filledValue = multiFilledAnswers[index];
                        const isActive = currentBlankIndex === index && multiStatus === 'playing';
                        const isFilled = Boolean(filledValue);
                        const isCorrect = filledValue && filledValue === multiQuestion.blanks[index]?.answer;

                        const blankClass = isActive
                          ? 'border-sky-400 bg-sky-100 text-sky-900 shadow-sm'
                          : isFilled && multiStatus !== 'playing'
                            ? isCorrect
                              ? 'border-emerald-300 bg-emerald-100 text-emerald-900'
                              : 'border-rose-300 bg-rose-100 text-rose-900'
                            : isFilled
                              ? 'border-indigo-300 bg-indigo-100 text-indigo-900'
                              : 'border-slate-200 bg-slate-100 text-slate-500';

                        return (
                          <span key={`${part}-${index}`}>
                            {part}
                            {hasBlank && (
                              <span
                                className={`mx-1 inline-flex min-w-16 justify-center rounded-xl border-2 px-3 py-1.5 font-black transition-all ${blankClass}`}
                              >
                                {filledValue ?? '＿'}
                              </span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {connectionHint && <p className="mt-4 rounded-2xl bg-yellow-100 p-3 text-sm text-yellow-900">{connectionHint}</p>}
              {scoreMessage && <p className="mt-4 rounded-2xl bg-amber-100 p-3 text-sm text-amber-900">{scoreMessage}</p>}
            </section>

            {mode === 'single_mapping' && gridCells.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-extrabold text-slate-700">Answer Buttons</h2>
                <GameGrid
                  cells={gridCells}
                  gridSize={difficulty}
                  selectedCell={selectedCell}
                  correctAnswer={targetChar}
                  status={status}
                  onCellClick={onCellClick}
                />
              </section>
            )}

            {mode === 'multi_mapping' && multiQuestion && (
              <section>
                <h2 className="mb-3 text-lg font-extrabold text-slate-700">Answer Buttons</h2>
                <div className="flex flex-wrap gap-3 rounded-3xl bg-white/80 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
                  {multiQuestion.options.map((option) => {
                    const isSelected = multiFilledAnswers.includes(option);

                    return (
                      <button
                        key={option}
                        onClick={() => onMultiOptionClick(option)}
                        disabled={multiStatus !== 'playing'}
                        className={`rounded-2xl px-6 py-4 text-3xl font-black transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${
                          isSelected
                            ? 'bg-indigo-500 text-white shadow-[0_10px_20px_rgba(79,70,229,0.35)]'
                            : 'bg-gradient-to-b from-white to-indigo-50 text-indigo-700 shadow-sm hover:-translate-y-0.5 hover:shadow-md'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {(feedbackMessage || (multiStatus !== 'playing' && multiExplanation)) && (
              <section className="rounded-3xl bg-white/90 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
                <h2 className="mb-2 text-lg font-extrabold text-slate-700">Feedback Card</h2>
                {feedbackMessage && <p className="text-base font-semibold text-slate-700">{feedbackMessage}</p>}
                {multiStatus !== 'playing' && multiExplanation && (
                  <p className="mt-3 rounded-2xl bg-emerald-100 p-3 text-base text-emerald-900">解析：{multiExplanation}</p>
                )}
              </section>
            )}
          </div>

          <aside className="space-y-5">
            {!isSupabaseConfigured && (
              <div className="rounded-3xl bg-yellow-100 p-4 text-sm text-yellow-800 shadow-[0_14px_35px_rgba(202,138,4,0.15)]">
                Supabase is not configured. Gameplay still works locally, but score saving is disabled.
              </div>
            )}
            <section>
              <h2 className="mb-3 text-lg font-extrabold text-slate-700">History Section</h2>
              <ScoreTable title="Recent History" scores={history} gameMode={mode} />
            </section>
            <section>
              <h2 className="mb-3 text-lg font-extrabold text-slate-700">Accuracy Leaderboard</h2>
              <ScoreTable
                title={mode === 'multi_mapping' ? 'Accuracy Leaderboard' : `Leaderboard (${difficulty}×${difficulty})`}
                scores={leaderboard}
                gameMode={mode}
              />
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
