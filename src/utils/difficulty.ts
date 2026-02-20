import type { Difficulty } from "../features/posts/post.types";

type DifficultyInfo = {
  label: string;
  value: Difficulty;
};

const DIFFICULTY_MAP: Record<number, DifficultyInfo> = {
  1: { label: "Easy",        value: "Easy"        },
  2: { label: "Easy–Medium", value: "Easy_Medium"  },
  3: { label: "Medium",      value: "Medium"       },
  4: { label: "Medium–Hard", value: "Medium_Hard"  },
  5: { label: "Hard",        value: "Hard"         },
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  Easy:        "Easy",
  Easy_Medium: "Easy–Medium",
  Medium:      "Medium",
  Medium_Hard: "Medium–Hard",
  Hard:        "Hard",
};

export function mapDifficulty(rating: number): DifficultyInfo {
  return DIFFICULTY_MAP[rating] ?? DIFFICULTY_MAP[3];
}
