import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { PageHeader } from '../components/common/PageHeader';
import { RecommendationList } from '../components/recommendation/RecommendationList';
import { WeightSliders } from '../components/recommendation/WeightSliders';
import { generateRecommendations, getLatestRecommendations } from '../services/recommendationService';
import { getProfile, getLatestInterestAssessment, listAcademicRecords } from '../services/profileService';
import { ApiError } from '../services/api';
import type { WeightKey, WeightMap, Recommendation } from '../types/recommendation';

const initialWeights: WeightMap = { academic: 0.2, interest: 0.2, chance: 0.2, distance: 0.2, cost: 0.2 };
type Gate = 'profile' | 'grades' | 'interest' | null;

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

export default function RecommendationPage() {
  const [items, setItems] = useState<Recommendation[]>([]);
  const [weights, setWeights] = useState<WeightMap>(initialWeights);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [dirty, setDirty] = useState(true);
  const [error, setError] = useState('');
  const [gate, setGate] = useState<Gate>(null);
  const [selectedIds, setSelectedIds] = useState<Array<string | number>>([]);

  const load = useCallback(async () => {
    setLoading(true); setError(''); setGate(null);
    try {
      const [profile, records, assessment] = await Promise.all([getProfile(), listAcademicRecords(), getLatestInterestAssessment()]);
      if (!profile || (profile.profile_completeness ?? 0) < 100) { setGate('profile'); setLoading(false); return; }
      if (!records.length) { setGate('grades'); setLoading(false); return; }
      if (!assessment) { setGate('interest'); setLoading(false); return; }
      try {
        const latest = await getLatestRecommendations();
        setItems(latest.recommendations);
        if (latest.weights) { setWeights(latest.weights); setDirty(false); }
      } catch (latestErr) {
        if (latestErr instanceof ApiError && latestErr.status === 404) {
          setItems([]);
        } else {
          throw latestErr;
        }
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Rekomendasi belum bisa dimuat.');
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const changeWeight = (key: WeightKey, value: number) => {
    setWeights((current) => {
      const others = (Object.keys(current) as WeightKey[]).filter((k) => k !== key);
      const remaining = Math.max(0, 1 - value);
      const previousOtherTotal = others.reduce((sum, k) => sum + current[k], 0);
      const next = { ...current, [key]: value };
      others.forEach((k) => { next[k] = previousOtherTotal > 0 ? (current[k] / previousOtherTotal) * remaining : remaining / others.length; });
      return next;
    });
    setDirty(true);
  };

  const applyWeights = async () => {
    if (applying || Math.abs(Object.values(weights).reduce((a, b) => a + b, 0) - 1) > 0.001) return;
    setApplying(true); setError('');
    try {
      const response = await generateRecommendations({ weights });
      setItems(response.recommendations);
      setWeights(response.weights ?? weights);
      setDirty(false);
      setSelectedIds([]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Rekomendasi belum bisa dibuat. Hasil sebelumnya tetap disimpan di layar.');
    } finally { setApplying(false); }
  };

  const toggleCompare = (item: Recommendation) => {
    const key = getItemKey(item);
    setSelectedIds((current) =>
      current.some((id) => String(id) === String(key))
        ? current.filter((id) => String(id) !== String(key))
        : current.length < 4 ? [...current, key] : current
    );
  };

  if (loading) return <div className="space-y-6"><PageHeader title="Rekomendasi SMA" description="Mencari sekolah yang sesuai dengan kebutuhanmu." /><LoadingState rows={5} /></div>;

  return <div className="space-y-7">
    <PageHeader title="Rekomendasi SMA" description="Temukan pilihan sekolah berdasarkan nilai, minat, peluang, jarak, dan budget kamu." />
    {gate && <Card tone="yellow"><div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center"><div className="flex-1"><h2 className="font-bold text-ink">Lengkapi datamu dulu, yuk!</h2><p className="mt-1 text-sm text-ink">{gate === 'profile' ? 'Profil belum lengkap. Lengkapi informasi profil agar rekomendasi mempertimbangkan kebutuhanmu.' : gate === 'grades' ? 'Tambahkan nilai akademik agar sistem dapat menilai kecocokan sekolah.' : 'Selesaikan tes minat terlebih dahulu agar rekomendasi lebih sesuai.'}</p></div><Link to={gate === 'profile' || gate === 'grades' ? '/profile' : '/interest-test'} className="inline-flex h-11 shrink-0 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-white">{gate === 'profile' || gate === 'grades' ? 'Lengkapi profil' : 'Mulai tes minat'}</Link></div></Card>}
    {!gate && <>
      {error && <ErrorState title="Pembaruan belum berhasil" message={error} />}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.5fr)]">
        <div className="lg:sticky lg:top-5"><WeightSliders weights={weights} onChange={changeWeight} onApply={() => void applyWeights()} loading={applying} dirty={dirty} /></div>
        <div className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-xl font-bold text-ink">Pilihan untukmu</h2><p className="mt-1 text-sm text-muted">{items.length ? `${items.length} rekomendasi dari hasil perhitungan terakhir` : 'Belum ada hasil. Terapkan bobot untuk membuat rekomendasi.'}</p></div>{selectedIds.length > 0 && <Link to="/compare" state={{ schoolIds: selectedIds }} className="inline-flex h-10 items-center rounded-xl border border-primary px-4 text-sm font-semibold text-primary">Bandingkan ({selectedIds.length})</Link>}</div>
          <RecommendationList items={items} selectedIds={selectedIds} onToggleCompare={toggleCompare} />
        </div>
      </div>
      <p className="text-xs text-muted">Kategori peluang ditentukan dari estimasi peluang penerimaan, bukan dari total skor. Hasil ini merupakan estimasi dan bukan jaminan diterima.</p>
    </>}
  </div>;
}