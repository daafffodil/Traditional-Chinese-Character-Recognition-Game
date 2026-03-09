import { ScoreRow } from '@/types/game';

type ScoreTableProps = {
  title: string;
  scores: ScoreRow[];
  gameMode: 'single_mapping' | 'multi_mapping';
  variant?: 'history' | 'leaderboard';
};

const truncateDisplayName = (name: string) => {
  const trimmed = name.trim();
  if (!trimmed) {
    return '匿名';
  }
  return trimmed.length > 8 ? `${trimmed.slice(0, 4)}…` : trimmed;
};

export default function ScoreTable({ title, scores, gameMode, variant = 'history' }: ScoreTableProps) {
  const isMultiMode = gameMode === 'multi_mapping';

  return (
    <section className="rounded-3xl bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-sm">
      <h2 className="mb-4 text-xl font-extrabold text-slate-800">{title}</h2>

      {scores.length === 0 ? (
        <p className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">暂无记录。</p>
      ) : (
        <div className="space-y-3">
          {scores.map((score) => {
            const blankCount = Math.max(0, score.blank_count ?? 0);
            const correctBlankCount = Math.min(blankCount, Math.max(0, score.correct_blank_count ?? 0));

            return (
              <article
                key={score.id}
                className="grid gap-2 rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-sky-50/60 px-4 py-3 text-sm text-slate-700 shadow-sm md:grid-cols-5 md:items-center"
              >
                <p>
                  <span className="block text-xs tracking-wide text-slate-400">名字</span>
                  <span className="font-semibold">{truncateDisplayName(score.player_name)}</span>
                </p>

                {isMultiMode ? (
                  <>
                    <p>
                      <span className="block text-xs tracking-wide text-slate-400">简体字</span>
                      <span className="font-semibold">{score.target_simplified ?? '-'}</span>
                    </p>
                    <p>
                      <span className="block text-xs tracking-wide text-slate-400">正确率</span>
                      <span className="font-semibold">
                        {correctBlankCount} / {blankCount}
                      </span>
                    </p>
                    {variant === 'leaderboard' ? (
                      <p>
                        <span className="block text-xs tracking-wide text-slate-400">Perfect</span>
                        <span className="font-semibold">{score.is_correct ? '⭐' : ''}</span>
                      </p>
                    ) : null}
                  </>
                ) : (
                  <>
                    <p>
                      <span className="block text-xs tracking-wide text-slate-400">格数</span>
                      <span className="font-semibold">
                        {score.grid_size}×{score.grid_size}
                      </span>
                    </p>
                    <p>
                      <span className="block text-xs tracking-wide text-slate-400">用时</span>
                      <span className="font-semibold">{score.completion_time.toFixed(2)}s</span>
                    </p>
                  </>
                )}

                <p>
                  <span className="block text-xs tracking-wide text-slate-400">日期</span>
                  <span className="font-semibold">{new Date(score.created_at).toLocaleDateString()}</span>
                </p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
