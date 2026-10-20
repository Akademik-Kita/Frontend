import type { Recommendation } from '../../types/recommendation';
import { EmptyState } from '../common/EmptyState';
import { SchoolCard } from './SchoolCard';

interface Props {
  items: Recommendation[];
  selectedIds: Array<string | number>;
  onToggleCompare: (item: Recommendation) => void;
}

const getItemKey = (item: Recommendation, index: number = 0): string => {
  const rec = item as unknown as Record<string, any>;
  const rawId = rec.school_id ?? rec.id ?? rec.npsn;
  if (rawId !== undefined && rawId !== null && rawId !== '') {
    return String(rawId);
  }
  const name = rec.school_name || rec.nama_sekolah || `sekolah-${index}`;
  const jurusan = rec.jurusan_name || rec.jurusan_id || rec.jurusan || 'umum';
  return `${name}-${jurusan}`;
};

export function RecommendationList({ items, selectedIds, onToggleCompare }: Props) {
  if (!items.length) return <EmptyState title="Belum ada rekomendasi" description="Belum ada hasil yang bisa ditampilkan. Periksa pesan di atas; katalog sekolah juga harus memiliki data program, biaya, dan histori penerimaan yang didukung." />;
  
  return (
    <div className="space-y-5">
      {items.map((item, index) => {
        const key = getItemKey(item, index);
        const selected = selectedIds.some((id) => String(id) === String(key));
        
        return (
          <SchoolCard 
            key={`${key}-${index}`} 
            recommendation={item} 
            selected={selected} 
            onToggleCompare={onToggleCompare} 
            compareDisabled={selectedIds.length >= 4 && !selected} 
          />
        );
      })}
    </div>
  );
}