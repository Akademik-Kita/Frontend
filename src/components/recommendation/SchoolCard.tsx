import { Link } from 'react-router-dom';
import type { Recommendation } from '../../types/recommendation';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { ChanceIndicator } from './ChanceIndicator';
import { RecommendationExplanation } from './RecommendationExplanation';
import { ScoreBreakdown } from './ScoreBreakdown';

interface Props {
  recommendation: Recommendation;
  selected: boolean;
  onToggleCompare: (recommendation: Recommendation) => void;
  compareDisabled?: boolean;
}

export function SchoolCard({ recommendation, selected, onToggleCompare, compareDisabled = false }: Props) {
  return (
    <Card className="min-w-0">
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-lavender text-lg font-extrabold text-link">
            #{recommendation.rank}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-ink">{recommendation.school_name}</h2>
              <Badge>{recommendation.jurusan_name}</Badge>
              {recommendation.data_is_simulated && <Badge tone="yellow">Data simulasi</Badge>}
            </div>
            <p className="mt-1 text-sm text-muted">Skor kecocokan berdasarkan data profil dan preferensimu</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="text-2xl font-extrabold text-link">{Math.round(recommendation.total_score)}<span className="text-sm font-semibold text-muted">/100</span></span>
              <ChanceIndicator recommendation={recommendation} />
            </div>
          </div>
        </div>
        <div className="grid min-w-0 gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <h3 className="mb-3 text-sm font-bold text-ink">Rincian skor</h3>
            <ScoreBreakdown scores={recommendation.score_breakdown ?? {}} />
          </div>
          <div className="min-w-0">
            <h3 className="mb-3 text-sm font-bold text-ink">Alasan rekomendasi</h3>
            <RecommendationExplanation explanation={recommendation.explanation} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-line pt-4">
          <Link to={`/schools/${recommendation.school_id}`} className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-dark">Lihat detail</Link>
          <Button variant={selected ? 'secondary' : 'ghost'} disabled={compareDisabled && !selected} onClick={() => onToggleCompare(recommendation)}>
            {selected ? '✓ Dipilih untuk dibandingkan' : '＋ Bandingkan'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
