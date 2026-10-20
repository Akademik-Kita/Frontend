import type { ScoreBreakdown as ScoreBreakdownType } from '../../types/recommendation';

const labels: Record<string, string> = {
  academic: 'Akademik',
  interest: 'Minat',
  chance: 'Peluang',
  distance: 'Jarak',
  cost: 'Biaya',
};

export function ScoreBreakdown({ scores }: { scores: ScoreBreakdownType }) {
  const entries = Object.entries(scores).filter((entry): entry is [string, number] => typeof entry[1] === 'number');
  if (!entries.length) return <p className="text-sm text-muted">Rincian skor belum tersedia.</p>;
  return (
    <div className="space-y-3">
      {entries.map(([key, score]) => (
        <div key={key}>
          <div className="mb-1 flex justify-between gap-3 text-sm">
            <span className="text-muted">{labels[key] ?? key}</span>
            <span className="font-semibold text-ink">{Math.round(score)}<span className="font-normal text-muted">/100</span></span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-lavender">
            <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(0, Math.min(100, score))}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
