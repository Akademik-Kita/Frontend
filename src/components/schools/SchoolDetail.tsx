import { useEffect, useState } from 'react';
import { getAdmissionHistory } from '../../services/schoolService';
import type { AdmissionHistory, School } from '../../types/school';
import { ApiError } from '../../services/api';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { LoadingState } from '../common/LoadingState';

function money(value?: number | null) {
  return value == null ? 'Belum tersedia' : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}
export function SchoolDetail({ school }: { school: School }) {
  const [majorId, setMajorId] = useState('');
  const [history, setHistory] = useState<AdmissionHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyMessage, setHistoryMessage] = useState('');
  useEffect(() => {
    setHistory([]);
    setHistoryMessage('');
    if (!majorId) return;
    let active = true;
    setLoadingHistory(true);
    getAdmissionHistory(String(school.id), majorId).then((data) => { if (active) setHistory(Array.isArray(data) ? data : []); })
      .catch((error: unknown) => { if (active) setHistoryMessage(error instanceof ApiError ? error.message : 'Riwayat penerimaan belum bisa dimuat.'); })
      .finally(() => { if (active) setLoadingHistory(false); });
    return () => { active = false; };
  }, [school.id, majorId]);
  return <div className="space-y-5">
    {school.data_is_simulated && <p className="rounded-xl bg-softyellow p-4 text-sm text-ink" role="note">Biaya, jurusan, fasilitas, dan histori tambahan menggunakan simulasi untuk pengujian fitur.</p>}
    <Card>
      <div className="flex flex-wrap gap-2">{school.ownership && <Badge>{school.ownership}</Badge>}{school.accreditation && <Badge tone="green">Akreditasi {school.accreditation}</Badge>}{school.npsn && <Badge tone="neutral">NPSN {school.npsn}</Badge>}</div>
      <p className="mt-4 text-base leading-7 text-muted">{school.description || 'Deskripsi sekolah belum tersedia dari data sekolah.'}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Info label="Alamat" value={[school.address, school.kecamatan, school.city, school.province].filter(Boolean).join(', ') || 'Belum tersedia'} />
        <Info label="Biaya per bulan" value={money(school.monthly_fee)} />
        <Info label="Jarak dari domisili" value={school.distance_km == null ? 'Belum tersedia' : `${school.distance_km.toFixed(1)} km`} />
        <Info label="Website" value={school.website || 'Belum tersedia'} />
      </div>
    </Card>
    <Card>
      <h2 className="text-lg font-bold text-ink">Fasilitas</h2>
      {school.facilities?.length ? <div className="mt-3 flex flex-wrap gap-2">{school.facilities.map((item) => <Badge key={item} tone="neutral">{item}</Badge>)}</div> : <p className="mt-2 text-sm text-muted">Informasi fasilitas belum tersedia.</p>}
    </Card>
    <Card>
      <h2 className="text-lg font-bold text-ink">Jurusan dan riwayat penerimaan</h2>
      {!school.majors?.length ? <p className="mt-2 text-sm text-muted">Informasi jurusan belum tersedia.</p> : <>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">{school.majors.map((major) => <button type="button" key={major.id} onClick={() => setMajorId(String(major.id))} className={`rounded-xl border p-4 text-left ${majorId === String(major.id) ? 'border-primary bg-lavender' : 'border-line hover:border-primary/50'}`}><span className="font-bold text-ink">{major.name}</span><span className="mt-1 block text-sm text-muted">{major.quota == null ? 'Kuota belum tersedia' : `Kuota: ${major.quota}`}</span></button>)}</div>
        <div className="mt-5 border-t border-line pt-5"><h3 className="font-bold text-ink">Riwayat penerimaan</h3>
          {!majorId ? <p className="mt-2 text-sm text-muted">Pilih jurusan untuk melihat riwayat, jika tersedia.</p> : loadingHistory ? <LoadingState label="Memuat riwayat penerimaan..." /> : historyMessage ? <p className="mt-2 text-sm text-danger">{historyMessage}</p> : history.length ? <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[460px] text-left text-sm"><thead><tr className="bg-page"><th className="p-3">Tahun</th><th className="p-3">Kuota</th><th className="p-3">Pendaftar</th><th className="p-3">Diterima</th></tr></thead><tbody>{history.map((h, i) => <tr key={`${h.year}-${i}`} className="border-t border-line"><td className="p-3">{h.year}</td><td className="p-3">{h.quota ?? '—'}</td><td className="p-3">{h.applicants ?? '—'}</td><td className="p-3">{h.accepted ?? '—'}</td></tr>)}</tbody></table></div> : <p className="mt-2 text-sm text-muted">Belum ada riwayat penerimaan yang tersedia untuk jurusan ini.</p>}
        </div>
      </>}
    </Card>
  </div>;
}
function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-page p-4"><p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p><p className="mt-1 break-words font-semibold text-ink">{value}</p></div>; }
