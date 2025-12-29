type DifficultyBadgeProps = {
  level: 'Easy' | 'Easy_Medium' | 'Medium' | 'Medium_Hard' | 'Hard';
};

const colors = {
  Easy: 'bg-green-100 text-green-700',
  Easy_Medium: 'bg-green-300 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-700',
  Medium_Hard: 'bg-orange-300 text-orange-800',
  Hard: 'bg-red-100 text-red-700',
};

export default function DifficultyBadge({ level }: DifficultyBadgeProps) {
  return (
    <span
      className={`text-xs font-medium px-2 py-1 rounded-full ${colors[level]}`}
    >
      {level}
    </span>
  );
}
