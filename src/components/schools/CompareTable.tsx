import type { School } from '../../types/school';
import type { Recommendation } from '../../types/recommendation';

function rupiah(value?: number | null) {
  if (value == null || isNaN(Number(value))) return 'Belum tersedia';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

export function CompareTable({ schools, recommendations = [] }: { schools: School[]; recommendations?: Recommendation[] }) {
  const getBiaya = (s: any) => {
    if (s.biaya_per_bulan && s.biaya_per_bulan !== 'Belum tersedia') return String(s.biaya_per_bulan);
    if (typeof s.monthly_fee === 'number') return rupiah(s.monthly_fee);
    if (Array.isArray(s.biaya) && s.biaya.length > 0) {
      const minCost = Math.min(...s.biaya.map((b: any) => b.monthly_equivalent || b.tuition_per_period || 0));
      if (minCost > 0) return rupiah(minCost);
    }
    const ownership = String(s.ownership || s.status || '').toLowerCase();
    if (ownership.includes('negeri')) return 'Gratis (Sekolah Negeri)';
    return 'Belum tersedia';
  };

  const getSkor = (s: any) => {
    const r: any = recommendations.find((rec: any) => String(rec.school_id ?? rec.id) === String(s.id));
    if (r?.total_score != null) return `${Math.round(r.total_score)}/100`;
    if (r?.score != null) return `${(r.score > 1 ? r.score : r.score * 100).toFixed(1)}%`;
    if (s.skor_rekomendasi) return String(s.skor_rekomendasi);
    if (typeof s.score === 'number') return `${s.score}%`;
    return 'Belum tersedia';
  };

  const getJurusan = (s: any) => {
    if (Array.isArray(s.jurusan_tersedia) && s.jurusan_tersedia.length > 0) return s.jurusan_tersedia.join(', ');
    if (Array.isArray(s.majors) && s.majors.length > 0) return s.majors.map((m: any) => (typeof m === 'string' ? m : m.name)).join(', ');
    if (Array.isArray(s.jurusan) && s.jurusan.length > 0) return s.jurusan.map((j: any) => (typeof j === 'string' ? j : j.name)).join(', ');
    if (typeof s.jurusan === 'string' && s.jurusan) return s.jurusan;
    return 'Belum tersedia';
  };

  const getFasilitas = (s: any) => {
    if (Array.isArray(s.fasilitas) && s.fasilitas.length > 0) return s.fasilitas.join(', ');
    if (Array.isArray(s.facilities) && s.facilities.length > 0) return s.facilities.map((f: any) => (typeof f === 'string' ? f : f.name)).join(', ');
    if (typeof s.fasilitas === 'string' && s.fasilitas) return s.fasilitas;
    return 'Belum tersedia';
  };

  const getJarak = (s: any) => {
    const dist = s.distance_km ?? s.distance;
    if (dist == null) return 'Belum tersedia';
    const num = typeof dist === 'number' ? dist : parseFloat(dist);
    return isNaN(num) ? 'Belum tersedia' : `${num.toFixed(1)} km`;
  };

  const getAlamat = (s: any) => {
    if (s.address && s.address !== '-') return String(s.address);
    const parts = [s.kecamatan, s.city, s.province].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Belum tersedia';
  };

  const rows: Array<[string, (school: any) => string]> = [
    ['Status', (s: any) => s.ownership ?? s.status ?? 'Belum tersedia'],
    ['Akreditasi', (s: any) => s.accreditation ?? 'Belum tersedia'],
    ['Alamat', getAlamat],
    ['Jarak', getJarak],
    ['Biaya per bulan', getBiaya],
    ['Skor rekomendasi', getSkor],
    ['Jurusan tersedia', getJurusan],
    ['Fasilitas', getFasilitas],
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-white">
      <table className="min-w-[720px] w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-lavender">
            <th className="sticky left-0 min-w-36 bg-lavender p-4 font-bold text-ink">Informasi</th>
            {schools.map((s) => (
              <th key={String(s.id)} className="min-w-48 p-4 font-bold text-ink">
                {s.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label} className="border-t border-line">
              <th className="sticky left-0 bg-white p-4 font-semibold text-muted">{label}</th>
              {schools.map((s) => (
                <td key={String(s.id)} className="p-4 align-top text-ink">
                  {value(s)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}