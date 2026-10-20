import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { PageHeader } from '../components/common/PageHeader';
import { InterestRadarChart } from '../components/interest/InterestRadarChart';
import { DIMENSIONS } from '../config/interestInstrument';
import { getLatestInterestAssessment } from '../services/profileService';
import type { InterestAssessment } from '../types/profile';
import { getErrorMessage } from '../utils/errors';

export default function InterestResultPage() {
  const [status, setStatus] = useState<'loading' | 'error' | 'empty' | 'ready'>('loading');
  const [error, setError] = useState('');
  const [assessment, setAssessment] = useState<InterestAssessment | null>(null);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const result = await getLatestInterestAssessment();
      setAssessment(result);
      setStatus(result ? 'ready' : 'empty');
    } catch (err) {
      setError(getErrorMessage(err));
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const ranked = assessment
    ? [...DIMENSIONS].sort((a, b) => assessment.scores[b.key] - assessment.scores[a.key])
    : [];

  return (
    <div className="space-y-12">
      <PageHeader
        title="Hasil tes minat"
        description="Makin jauh titik dari tengah, makin kuat minatmu di bidang itu."
      />

      {status === 'loading' ? <LoadingState rows={4} label="Memuat hasil tesmu…" /> : null}
      {status === 'error' ? <ErrorState message={error} onRetry={() => void load()} /> : null}

      {status === 'empty' ? (
        <EmptyState
          title="Kamu belum mengerjakan tes minat"
          description="Kerjakan 12 pertanyaan singkat dulu, lalu hasilnya muncul di sini."
          action={
            <Link to="/interest-test">
              <Button>Mulai tes minat</Button>
            </Link>
          }
        />
      ) : null}

      {status === 'ready' && assessment ? (
        <>
          <div className="grid gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3">
              <InterestRadarChart scores={assessment.scores} />
            </Card>

            <Card className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-ink">Minat terkuatmu</h2>
              <ol className="mt-6 space-y-6">
                {ranked.map((dimension, position) => (
                  <li key={dimension.key}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-base font-semibold text-ink">{dimension.label}</span>
                      <div className="flex items-center gap-2">
                        {position < 2 ? <Badge tone={position === 0 ? 'yellow' : 'green'}>Teratas</Badge> : null}
                        <span className="text-base font-bold text-primary">{assessment.scores[dimension.key]}</span>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-muted">{dimension.description}</p>
                  </li>
                ))}
              </ol>
            </Card>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/recommendations">
              <Button>Lihat rekomendasi SMA</Button>
            </Link>
            <Link to="/interest-test">
              <Button variant="secondary">Ulangi tes</Button>
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}
