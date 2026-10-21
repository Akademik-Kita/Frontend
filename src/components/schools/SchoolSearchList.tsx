import { Link } from 'react-router-dom';
import type { School } from '../../types/school';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';

export function SchoolSearchList({ schools, onSelect, selectedIds = [] }: {
  schools: School[];
  onSelect?: (school: School) => void;
  selectedIds?: Array<string | number>;
}) {
  if (!schools.length) return <div className="rounded-2xl border border-dashed border-line bg-surface p-8 text-center"><p className="font-bold text-ink">Sekolah tidak ditemukan</p><p className="mt-1 text-sm text-muted">Coba ubah kata kunci atau filter pencarianmu.</p></div>;
  return <div className="grid gap-4 md:grid-cols-2">
    {schools.map((school) => {
      const selected = selectedIds.includes(school.id);
      return <Card key={school.id} className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div><h3 className="font-bold text-ink">{school.name}</h3><p className="mt-1 text-sm text-muted">{[school.kecamatan, school.city].filter(Boolean).join(', ') || school.address || 'Lokasi belum tersedia'}</p></div>
          {school.ownership && <Badge>{school.ownership}</Badge>}
        </div>
        <div className="flex flex-wrap gap-2">{school.accreditation && <Badge tone="green">Akreditasi {school.accreditation}</Badge>}{typeof school.distance_km === 'number' && <Badge tone="neutral">{school.distance_km.toFixed(1)} km</Badge>}</div>
        <div className="mt-auto flex flex-wrap gap-2">
          <Link to={`/schools/${school.id}`} className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-dark">Detail sekolah</Link>
          {onSelect && <button type="button" onClick={() => onSelect(school)} disabled={!selected && selectedIds.length >= 4} className="rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-link disabled:opacity-40">{selected ? 'Hapus pilihan' : 'Bandingkan'}</button>}
        </div>
      </Card>;
    })}
  </div>;
}
