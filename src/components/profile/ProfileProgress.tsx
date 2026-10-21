import { Card } from '../common/Card';

interface ProfileProgressProps {
  /** Nilai `profile_completeness` dari backend, dipakai apa adanya. */
  completeness: number | null;
}

/** Backend bisa mengirim 0–1 atau 0–100; keduanya dibaca sebagai persen. Rumus tetap milik backend. */
function toPercent(value: number | null): number {
  if (value === null || Number.isNaN(value)) return 0;
  const percent = value > 0 && value <= 1 ? value * 100 : value;
  return Math.min(100, Math.max(0, Math.round(percent)));
}

export function ProfileProgress({ completeness }: ProfileProgressProps) {
  const percent = toPercent(completeness);
  const done = percent >= 100;

  return (
    <Card tone={done ? 'green' : 'lavender'}>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-semibold text-ink">Kelengkapan profil</h2>
        <p className="text-2xl font-bold text-ink">{percent}%</p>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Kelengkapan profil"
        className="mt-4 h-3 w-full overflow-hidden rounded-full bg-surface"
      >
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-4 text-sm text-muted">
        {done
          ? 'Profilmu sudah lengkap. Kamu bisa lanjut ke tes minat.'
          : 'Lengkapi data diri, nilai, dan prestasi supaya rekomendasi lebih sesuai denganmu.'}
      </p>
    </Card>
  );
}
