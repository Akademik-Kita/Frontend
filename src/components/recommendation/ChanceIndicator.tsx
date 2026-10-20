import { Badge } from '../common/Badge';
import type { Recommendation } from '../../types/recommendation';

export function getChanceCategory(low: number, high: number): 'ambisius' | 'realistis' | 'aman' {
  const midpoint = (low + high) / 2;
  if (midpoint < 35) return 'ambisius';
  if (midpoint <= 70) return 'realistis';
  return 'aman';
}

export function ChanceIndicator({ recommendation }: { recommendation: Recommendation }) {
  const allowed = ['ambisius', 'realistis', 'aman'];
  const category = allowed.includes(String(recommendation.category).toLowerCase())
    ? String(recommendation.category).toLowerCase() as 'ambisius' | 'realistis' | 'aman'
    : getChanceCategory(recommendation.chance_low, recommendation.chance_high);
  const tone = category === 'ambisius' ? 'yellow' : category === 'realistis' ? 'lavender' : 'green';
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge tone={tone}>{category.charAt(0).toUpperCase() + category.slice(1)}</Badge>
      <span className="text-sm font-semibold text-ink">
        {recommendation.chance_low}%–{recommendation.chance_high}% peluang
      </span>
    </div>
  );
}
