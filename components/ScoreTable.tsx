import { ScoreRow } from '@/types/game';

type ScoreTableProps = {
  title: string;
  scores: ScoreRow[];
  gameMode: 'single_mapping' | 'multi_mapping';
};

export default function ScoreTable({ title, scores, gameMode }: ScoreTableProps) {
  const isMultiMode = gameMode === 'multi_mapping';

  return (
    <section className="rounded-3xl bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-sm">
      <h2 className="mb-4 text-xl font-extrabold text-slate-800">{title}</h2>

      {scores.length === 0 ? (
        <p className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">No records yet.</p>
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
                  <span className="block text-xs uppercase tracking-wide text-slate-400">Name</span>
                  <span className="font-semibold">{score.player_name}</span>
                </p>

                {isMultiMode ? (
                  <>
                    <p>
                      <span className="block text-xs uppercase tracking-wide text-slate-400">Simplified</span>
                      <span className="font-semibold">{score.target_simplified ?? '-'}</span>
                    </p>
                    <p>
                      <span className="block text-xs uppercase tracking-wide text-slate-400">Accuracy</span>
                      <span className="font-semibold">{correctBlankCount} / {blankCount}</span>
                    </p>
                    <p>
                      <span className="block text-xs uppercase tracking-wide text-slate-400">Perfect</span>
                      <span className="font-semibold">{score.is_correct ? '✅' : ''}</span>
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <span className="block text-xs uppercase tracking-wide text-slate-400">Grid</span>
                      <span className="font-semibold">{score.grid_size}×{score.grid_size}</span>
                    </p>
                    <p>
                      <span className="block text-xs uppercase tracking-wide text-slate-400">Time</span>
                      <span className="font-semibold">{score.completion_time.toFixed(2)}s</span>
                    </p>
                  </>
                )}

                <p>
                  <span className="block text-xs uppercase tracking-wide text-slate-400">Date</span>
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
