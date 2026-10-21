import type { School } from '../../types/school';
import { Button } from '../common/Button';

export function CompareSelector({ selected, onRemove, onClear }: {
  selected: School[];
  onRemove: (id: School['id']) => void;
  onClear: () => void;
}) {
  if (!selected.length) return <p className="rounded-xl bg-lavender p-4 text-sm text-ink">Pilih sekolah dari daftar di bawah untuk mulai membandingkan (maksimal 4).</p>;
  return <div className="rounded-2xl border border-line bg-surface p-4">
    <div className="mb-3 flex items-center justify-between gap-3"><p className="font-bold text-ink">Pilihan ({selected.length}/4)</p><Button variant="ghost" className="h-9 px-3" onClick={onClear}>Kosongkan</Button></div>
    <div className="flex flex-wrap gap-2">{selected.map((school) => <span key={school.id} className="inline-flex items-center gap-2 rounded-full bg-lavender px-3 py-2 text-sm font-semibold text-ink">{school.name}<button type="button" aria-label={`Hapus ${school.name}`} onClick={() => onRemove(school.id)} className="font-bold text-link">×</button></span>)}</div>
  </div>;
}
