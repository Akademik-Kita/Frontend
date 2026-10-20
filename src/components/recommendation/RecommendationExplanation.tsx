import type { RecommendationExplanation as Explanation } from '../../types/recommendation';
import './RecommendationExplanation.css';

function asList(value: string[] | string | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function RecommendationExplanation({ explanation }: { explanation?: Explanation }) {
  const positive = asList(explanation?.positive);
  const negative = asList(explanation?.negative);
  if (!positive.length && !negative.length) return <p className="text-sm text-muted">Belum ada penjelasan untuk rekomendasi ini.</p>;
  return (
    <div className="ak-recommendation-explanation">
      <div className="rounded-xl bg-softgreen p-4">
        <p className="mb-2 text-sm font-bold text-ink">Yang mendukung</p>
        {positive.length ? <ul className="list-disc space-y-1 pl-5 text-sm text-ink">{positive.map((item, i) => <li key={`${item}-${i}`}>{item}</li>)}</ul> : <p className="text-sm text-muted">Tidak ada catatan.</p>}
      </div>
      <div className="rounded-xl bg-softyellow p-4">
        <p className="mb-2 text-sm font-bold text-ink">Yang perlu dipertimbangkan</p>
        {negative.length ? <ul className="list-disc space-y-1 pl-5 text-sm text-ink">{negative.map((item, i) => <li key={`${item}-${i}`}>{item}</li>)}</ul> : <p className="text-sm text-muted">Tidak ada catatan.</p>}
      </div>
    </div>
  );
}
