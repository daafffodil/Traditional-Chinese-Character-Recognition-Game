import { ScoreRow } from '@/types/game';

type ScoreTableProps = {
  title: string;
  scores: ScoreRow[];
  gameMode: 'single_mapping' | 'multi_mapping';
};

export default function ScoreTable({ title, scores, gameMode }: ScoreTableProps) {
  const isMultiMode = gameMode === 'multi_mapping';

  return (
    <section className="rounded-2xl bg-white p-4 shadow">
      <h2 className="mb-3 text-xl font-bold">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Name</th>
              {isMultiMode ? (
                <>
                  <th className="py-2">Simplified</th>
                  <th className="py-2">Accuracy</th>
                  <th className="py-2">Perfect</th>
                </>
              ) : (
                <>
                  <th className="py-2">Grid</th>
                  <th className="py-2">Time</th>
                </>
              )}
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.length === 0 ? (
              <tr>
                <td colSpan={isMultiMode ? 5 : 4} className="py-3 text-slate-500">
                  No records yet.
                </td>
              </tr>
            ) : (
              scores.map((score) => {
                const blankCount = Math.max(0, score.blank_count ?? 0);
                const correctBlankCount = Math.min(blankCount, Math.max(0, score.correct_blank_count ?? 0));

                return (
                  <tr key={score.id} className="border-b last:border-0">
                    <td className="py-2">{score.player_name}</td>
                    {isMultiMode ? (
                      <>
                        <td className="py-2">{score.target_simplified ?? '-'}</td>
                        <td className="py-2">{correctBlankCount} / {blankCount}</td>
                        <td className="py-2">{score.is_correct ? '✅' : ''}</td>
                      </>
                    ) : (
                      <>
                        <td className="py-2">{score.grid_size}×{score.grid_size}</td>
                        <td className="py-2">{score.completion_time.toFixed(2)}s</td>
                      </>
                    )}
                    <td className="py-2">{new Date(score.created_at).toLocaleDateString()}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
