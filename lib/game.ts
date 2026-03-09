import { CharacterItem } from '@/types/game';

export const shuffle = <T,>(items: T[]): T[] => {
  const copied = [...items];
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
};

export const pickRandomCharacter = (characters: CharacterItem[]): CharacterItem => {
  return characters[Math.floor(Math.random() * characters.length)];
};

export const createRoundGrid = (characters: CharacterItem[], gridSize: number, correctTraditional: string): string[] => {
  const totalCells = gridSize * gridSize;
  const distractors = shuffle(
    characters
      .map((entry) => entry.traditional)
      .filter((traditional) => traditional !== correctTraditional),
  ).slice(0, totalCells - 1);

  return shuffle([correctTraditional, ...distractors]);
};

export const formatTime = (milliseconds: number): string => {
  const seconds = (milliseconds / 1000).toFixed(2);
  return `${seconds}s`;
};
