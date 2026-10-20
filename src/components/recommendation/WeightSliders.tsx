import type { WeightKey, WeightMap } from '../../types/recommendation';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

const options: Array<{ key: WeightKey; label: string; hint: string }> = [
  { key: 'academic', label: 'Akademik', hint: 'Kesesuaian nilai sekolahmu' },
  { key: 'interest', label: 'Minat', hint: 'Kesesuaian hasil tes minat' },
  { key: 'chance', label: 'Peluang diterima', hint: 'Perkiraan peluang masuk' },
  { key: 'distance', label: 'Jarak', hint: 'Kedekatan sekolah dari domisili' },
  { key: 'cost', label: 'Biaya', hint: 'Kesesuaian biaya dengan budget' },
];

interface Props {
  weights: WeightMap;
  onChange: (key: WeightKey, value: number) => void;
  onApply: () => void;
  loading: boolean;
  dirty: boolean;
}

export function WeightSliders({ weights, onChange, onApply, loading, dirty }: Props) {
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-ink">Atur prioritasmu</h2>
        <p className="mt-1 text-sm text-muted">Geser bobot sesuai hal yang paling penting buatmu. Hasil baru dihitung setelah tombol diterapkan.</p>
      </div>
      <div className="space-y-5">
        {options.map(({ key, label, hint }) => (
          <div key={key}>
            <div className="mb-1 flex items-center justify-between gap-3">
              <label htmlFor={`weight-${key}`} className="text-sm font-semibold text-ink">{label}</label>
              <span className="text-sm font-bold tabular-nums text-primary">{Math.round(weights[key] * 100)}%</span>
            </div>
            <input id={`weight-${key}`} aria-label={`Bobot ${label}`} type="range" min="0" max="100" step="5" value={Math.round(weights[key] * 100)} onChange={(event) => onChange(key, Number(event.target.value) / 100)} className="w-full accent-primary" />
            <p className="text-xs text-muted">{hint}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className={`text-sm font-bold ${Math.abs(total - 1) < 0.001 ? 'text-ink' : 'text-danger'}`}>Total bobot: {Math.round(total * 100)}%</p>
          <p className="text-xs text-muted">Total harus 100% sebelum diterapkan.</p>
        </div>
        <Button onClick={onApply} loading={loading} disabled={!dirty || Math.abs(total - 1) >= 0.001}>Terapkan bobot</Button>
      </div>
    </Card>
  );
}
