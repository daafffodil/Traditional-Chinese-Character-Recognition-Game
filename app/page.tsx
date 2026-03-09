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

const truncateDisplayName = (name: string) => {
  const trimmed = name.trim();
  if (!trimmed) {
    return '匿名';
  }

  return trimmed.length > 8 ? `${trimmed.slice(0, 4)}…` : trimmed;
};

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
  const [statusMessage, setStatusMessage] = useState('点击「开始游戏」，听读音并选出正确繁体字。');
  const [connectionHint, setConnectionHint] = useState('');
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  const [multiQuestion, setMultiQuestion] = useState<MultiBlankQuestion | null>(null);
  const [multiFilledAnswers, setMultiFilledAnswers] = useState<(string | null)[]>([]);
  const [currentBlankIndex, setCurrentBlankIndex] = useState(0);
  const [multiStatus, setMultiStatus] = useState<MultiMappingStatus>('idle');
  const [multiStatusMessage, setMultiStatusMessage] = useState('点击「开始游戏」，准备挑战一简对多。');

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
      const normalizedPlayerName = playerName.trim() || '匿名';
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
    setStatusMessage('请听读音，点选正确的繁体字。');
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
      setStatusMessage(`太棒了！用时 ${completionTime} 秒。`);

      await persistScore({
        gridSize: difficulty,
        completionTime,
        gameMode: 'single_mapping',
        targetSimplified: questionChar,
        questionType: 'single_choice',
        blankCount: 1,
        correctBlankCount: 1,
        isCorrect: true,
        successMessage: `太棒了！用时 ${completionTime} 秒，成绩已保存。`,
        failureMessage: `太棒了！用时 ${completionTime} 秒。已完成本局，暂时无法同步到云端，游戏可继续进行。`,
        setModeStatusMessage: setStatusMessage,
      });
      return;
    }

    setStatus('incorrect');
    setStatusMessage('再试一次！');

    window.setTimeout(() => {
      setStatus('playing');
      setSelectedCell(null);
      setStatusMessage('继续尝试，你快成功了！');
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

  const resetSingleRound = () => {
    if (!questionChar) {
      return;
    }

    setStatus('playing');
    setSelectedCell(null);
    setStartTime(Date.now());
    setElapsedMs(0);
    setStatusMessage('已重置本题，请重新作答。');
    speakCharacter(questionChar);
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
        ? `太棒了！本题答对 ${multiCorrectCount}/${multiQuestion.blanks.length}。`
        : `再试一次！目前答对 ${multiCorrectCount}/${multiQuestion.blanks.length}。`;
    }

    if (mode === 'single_mapping') {
      if (status === 'correct') {
        return '太棒了！你选对了繁体字。';
      }
      if (status === 'incorrect') {
        return '再听一次，继续挑战！';
      }
    }

    return '';
  }, [mode, multiCorrectCount, multiQuestion, multiStatus, status]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 via-orange-50 to-rose-100 px-4 py-4 md:py-6">
      <div className="mx-auto max-w-4xl space-y-5">
        <header className="rounded-3xl bg-white/85 px-4 py-3 shadow-[0_14px_36px_rgba(15,23,42,0.1)] backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-black tracking-tight text-sky-700 md:text-3xl">繁体字挑战</h1>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500">模式切换</p>
              <div className="flex rounded-2xl bg-slate-100 p-1">
                <button
                  onClick={() => setMode('single_mapping')}
                  className={`flex-1 rounded-xl px-3 py-2 text-sm font-bold transition-all ${
                    mode === 'single_mapping' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  简繁对应
                </button>
                <button
                  onClick={() => {
                    setMode('multi_mapping');
                  }}
                  className={`flex-1 rounded-xl px-3 py-2 text-sm font-bold transition-all ${
                    mode === 'multi_mapping' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  一简对多
                </button>
              </div>
            </div>
          </div>
        </header>

        <section className="space-y-5">
          <section className="rounded-[2rem] bg-white/90 p-5 shadow-[0_20px_55px_rgba(15,23,42,0.12)] backdrop-blur-sm md:p-7">
            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-600">玩家名称</span>
                <input
                  value={playerName}
                  onChange={(event) => setPlayerName(event.target.value)}
                  placeholder="不填将显示为匿名"
                  className="w-full rounded-2xl border-0 bg-slate-100 px-4 py-3 text-base text-slate-700 shadow-inner outline-none ring-sky-300 transition focus:ring-2"
                />
              </label>
              <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700">
                当前玩家：{truncateDisplayName(playerName)}
              </div>
            </div>

              {mode === 'single_mapping' ? (
                <>
                  <div className="mb-5 flex flex-wrap items-center gap-3">
                    <p className="text-sm font-semibold text-slate-600">难度</p>
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

                  <div className="space-y-3 text-center">
                    <p className="text-sm font-semibold tracking-wide text-slate-500">简体提示</p>
                    <p className="text-6xl font-black text-orange-500">{questionChar || '？'}</p>
                    <p className="text-base font-semibold text-slate-700">{statusMessage}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-5 space-y-2 text-center">
                    <p className="text-sm font-semibold tracking-wide text-slate-500">简体提示</p>
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
                <h2 className="mb-3 text-lg font-extrabold text-slate-700">作答区</h2>
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
                <h2 className="mb-3 text-lg font-extrabold text-slate-700">作答区</h2>
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

            <section className="rounded-3xl bg-white/90 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
              <h2 className="mb-3 text-lg font-extrabold text-slate-700">游戏控制</h2>
              {mode === 'single_mapping' ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-3">
                    {status === 'idle' && (
                      <button
                        onClick={startRound}
                        className="rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-3 text-base font-bold text-white shadow-[0_14px_30px_rgba(56,189,248,0.35)] transition-all hover:-translate-y-0.5 active:translate-y-0"
                      >
                        开始游戏
                      </button>
                    )}
                    {(status === 'playing' || status === 'incorrect') && (
                      <button
                        onClick={resetSingleRound}
                        className="rounded-2xl bg-white px-5 py-3 text-base font-bold text-amber-600 shadow-sm transition-all hover:bg-amber-50 active:scale-95"
                      >
                        重置本题
                      </button>
                    )}
                    {status === 'correct' && (
                      <button
                        onClick={startRound}
                        className="rounded-2xl bg-white px-5 py-3 text-base font-bold text-emerald-600 shadow-sm transition-all hover:bg-emerald-50 active:scale-95"
                      >
                        下一题
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => speakCharacter(questionChar)}
                      disabled={!questionChar}
                      className="rounded-2xl bg-white px-5 py-3 text-base font-bold text-indigo-600 shadow-sm transition-all hover:bg-indigo-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      重听读音
                    </button>
                    <div className="rounded-2xl bg-slate-100 px-4 py-3 text-base font-semibold text-slate-700">⏱️ {formattedTimer}</div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {multiStatus === 'idle' && (
                    <button
                      onClick={() => startMultiQuestion()}
                      className="rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-3 text-base font-bold text-white shadow-[0_14px_30px_rgba(56,189,248,0.35)] transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                      开始游戏
                    </button>
                  )}
                  {(multiStatus === 'playing' || multiStatus === 'incorrect') && (
                    <button
                      onClick={resetMultiQuestion}
                      disabled={!multiQuestion}
                      className="rounded-2xl bg-white px-5 py-3 text-base font-bold text-amber-600 shadow-sm transition-all hover:bg-amber-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      重置本题
                    </button>
                  )}
                  {multiStatus === 'correct' && (
                    <button
                      onClick={() => startMultiQuestion(multiQuestion?.text)}
                      disabled={!multiQuestion}
                      className="rounded-2xl bg-white px-5 py-3 text-base font-bold text-emerald-600 shadow-sm transition-all hover:bg-emerald-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      下一题
                    </button>
                  )}
                </div>
              )}
            </section>

            {(feedbackMessage || (multiStatus !== 'playing' && multiExplanation)) && (
              <section className="rounded-3xl bg-white/90 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
                <h2 className="mb-2 text-lg font-extrabold text-slate-700">学习反馈</h2>
                {feedbackMessage && <p className="text-base font-semibold text-slate-700">{feedbackMessage}</p>}
                {multiStatus !== 'playing' && multiExplanation && (
                  <p className="mt-3 rounded-2xl bg-emerald-100 p-3 text-base text-emerald-900">解析：{multiExplanation}</p>
                )}
              </section>
            )}
          {!isSupabaseConfigured && (
            <div className="rounded-3xl bg-yellow-100 p-4 text-sm text-yellow-800 shadow-[0_14px_35px_rgba(202,138,4,0.15)]">
              Supabase 尚未配置，游戏可正常进行，但成绩暂时无法同步。
            </div>
          )}
          <section>
            <ScoreTable title="最近记录" scores={history} gameMode={mode} variant="history" />
          </section>
          <section>
            <ScoreTable
              title={mode === 'multi_mapping' ? '正确率排行榜' : `正确率排行榜（${difficulty}×${difficulty}）`}
              scores={leaderboard}
              gameMode={mode}
              variant="leaderboard"
            />
          </section>
        </section>
      </div>
    </main>
  );
}
