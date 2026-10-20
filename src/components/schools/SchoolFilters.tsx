import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import type { SchoolFilters as FilterValues } from '../../services/schoolService';

interface Props {
  filters: FilterValues;
  onChange: (next: FilterValues) => void;
  onSearch: () => void;
  loading?: boolean;
}
export function SchoolFilters({ filters, onChange, onSearch, loading = false }: Props) {
  return (
    <form className="grid gap-4 rounded-2xl border border-line bg-white p-5 sm:grid-cols-2 lg:grid-cols-4" onSubmit={(e) => { e.preventDefault(); onSearch(); }}>
      <Input label="Cari sekolah" placeholder="Nama sekolah..." value={filters.search ?? ''} onChange={(e) => onChange({ ...filters, search: e.target.value })} />
      <Input label="Kecamatan" placeholder="Contoh: Cilandak" value={filters.kecamatan ?? ''} onChange={(e) => onChange({ ...filters, kecamatan: e.target.value })} />
      <Select label="Status sekolah" value={filters.ownership ?? ''} onChange={(e) => onChange({ ...filters, ownership: e.target.value })}>
        <option value="">Semua status</option><option value="negeri">Negeri</option><option value="swasta">Swasta</option>
      </Select>
      <div className="flex flex-col justify-end"><Button type="submit" loading={loading} fullWidth>Terapkan filter</Button></div>
    </form>
  );
}
