import type { Difficulty } from "../features/posts/post.types";
import { DIFFICULTY_LABELS } from "../utils/difficulty";

type DifficultyBadgeProps = {
  level: Difficulty;
};

const colors: Record<Difficulty, string> = {
  Easy:        "bg-green-200 text-green-700",
  Easy_Medium: "bg-green-300 text-green-800",
  Medium:      "bg-yellow-200 text-yellow-700",
  Medium_Hard: "bg-orange-300 text-orange-800",
  Hard:        "bg-red-200 text-red-700",
};

export default function DifficultyBadge({ level }: DifficultyBadgeProps) {
  return (
    <span
  className={`inline-flex items-center whitespace-nowrap text-xs font-medium px-3 py-1 rounded-full ${colors[level]}`}
>
  {DIFFICULTY_LABELS[level]}
</span>
  );
}
