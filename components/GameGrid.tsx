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
      className="grid gap-3 rounded-2xl bg-white p-4 shadow"
      style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
    >
      {cells.map((value, index) => {
        const isCorrect = value === correctAnswer;
        const isSelected = value === selectedCell;

        let color = 'bg-slate-100 hover:bg-slate-200';
        if (status === 'correct' && isCorrect) {
          color = 'bg-green-300';
        } else if (status === 'incorrect' && isSelected && !isCorrect) {
          color = 'bg-red-300';
        }

        return (
          <button
            key={`${value}-${index}`}
            onClick={() => onCellClick(value)}
            className={`h-16 rounded-xl text-3xl font-bold ${color}`}
            disabled={status === 'correct'}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}
