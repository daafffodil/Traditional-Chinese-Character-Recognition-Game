import { formatTime } from '@/lib/game';
import { ScoreRow } from '@/types/game';

type ScoreTableProps = {
  title: string;
  scores: ScoreRow[];
};

export default function ScoreTable({ title, scores }: ScoreTableProps) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow">
      <h2 className="mb-3 text-xl font-bold">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Name</th>
              <th className="py-2">Grid</th>
              <th className="py-2">Time</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-3 text-slate-500">
                  No records yet.
                </td>
              </tr>
            ) : (
              scores.map((score) => (
                <tr key={score.id} className="border-b last:border-0">
                  <td className="py-2">{score.player_name}</td>
                  <td className="py-2">{score.grid_size}×{score.grid_size}</td>
                  <td className="py-2">{formatTime(score.completion_time * 1000)}</td>
                  <td className="py-2">{new Date(score.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
