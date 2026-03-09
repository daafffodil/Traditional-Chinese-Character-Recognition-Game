import { GameStatus } from '@/types/game';

type GameGridProps = {
  cells: string[];
  gridSize: number;
  selectedCell: string | null;
  correctAnswer: string;
  status: GameStatus;
  onCellClick: (value: string) => void;
};

export default function GameGrid({
  cells,
  gridSize,
  selectedCell,
  correctAnswer,
  status,
  onCellClick,
}: GameGridProps) {
  return (
    <div
      className="grid gap-3 rounded-3xl bg-white/85 p-4 shadow-[0_16px_45px_rgba(15,23,42,0.08)] backdrop-blur-sm"
      style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
    >
      {cells.map((value, index) => {
        const isCorrect = value === correctAnswer;
        const isSelected = value === selectedCell;

        let color =
          'bg-gradient-to-br from-sky-50 to-indigo-50 text-slate-800 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0';
        if (status === 'correct' && isCorrect) {
          color = 'bg-gradient-to-br from-emerald-300 to-green-400 text-emerald-950 shadow-lg';
        } else if (status === 'incorrect' && isSelected && !isCorrect) {
          color = 'bg-gradient-to-br from-rose-300 to-red-400 text-red-950';
        }

        return (
          <button
            key={`${value}-${index}`}
            onClick={() => onCellClick(value)}
            className={`h-16 rounded-2xl text-3xl font-black transition-all duration-200 ${color}`}
            disabled={status === 'correct'}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}
