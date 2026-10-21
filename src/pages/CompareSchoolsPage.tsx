import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { PageHeader } from '../components/common/PageHeader';
import { CompareSelector } from '../components/schools/CompareSelector';
import { CompareTable } from '../components/schools/CompareTable';
import { SchoolFilters } from '../components/schools/SchoolFilters';
import { SchoolSearchList } from '../components/schools/SchoolSearchList';
import { getSchoolComparison, getSchools, type SchoolFilters as FilterValues } from '../services/schoolService';
import { getLatestRecommendations } from '../services/recommendationService';
import type { Recommendation } from '../types/recommendation';
import { ApiError } from '../services/api';
import type { School } from '../types/school';

export default function CompareSchoolsPage() {
  const location = useLocation();
  const [filters, setFilters] = useState<FilterValues>({});
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [schools, setSchools] = useState<School[]>([]);
  const [selected, setSelected] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState('');
  const [compareError, setCompareError] = useState('');
  const [compared, setCompared] = useState<School[] | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    const timer = window.setTimeout(() => {
      getSchools({ ...filters, page })
        .then((result) => { if (active) setSchools(result.items); })
        .catch((err) => { if (active) setError(err instanceof ApiError ? err.message : 'Daftar sekolah belum bisa dimuat.'); })
        .finally(() => { if (active) setLoading(false); });
    }, 300);
    return () => { active = false; window.clearTimeout(timer); };
  }, [filters, page, reload]);
  useEffect(() => { getLatestRecommendations().then((r) => setRecommendations(r.recommendations)).catch(() => setRecommendations([])); }, []);
  useEffect(() => {
    const ids = (location.state as { schoolIds?: Array<string | number> } | null)?.schoolIds;
    if (!ids?.length) return;
    let active = true;
    getSchoolComparison(ids).then((results) => { if (active) { setSelected(results.slice(0, 4)); setCompared(results.slice(0, 4)); } })
      .catch(() => { /* IDs from recommendation can be loaded through search list if compare API is not ready. */ });
    return () => { active = false; };
  }, [location.state]);

  const toggle = (school: School) => {
    setSelected((current) => {
      const exists = current.some((item) => String(item.id) === String(school.id));
      const next = exists ? current.filter((item) => String(item.id) !== String(school.id)) : current.length < 4 ? [...current, school] : current;
      setCompared(null);
      return next;
    });
    setCompareError('');
  };
  const compare = async () => {
    if (selected.length < 2 || selected.length > 4) return;
    setComparing(true); setCompareError('');
    try {
      const result = await getSchoolComparison(selected.map((s) => s.id));
      setCompared(result);
    } catch (err) { setCompareError(err instanceof ApiError ? err.message : 'Sekolah belum bisa dibandingkan.'); }
    finally { setComparing(false); }
  };

  return <div className="space-y-7">
    <PageHeader title="Bandingkan SMA" description="Bandingkan biaya, akreditasi, jarak, dan jurusan sebelum menentukan pilihan." />
    <CompareSelector selected={selected} onRemove={(id) => { setSelected((current) => current.filter((s) => String(s.id) !== String(id))); setCompared(null); }} onClear={() => { setSelected([]); setCompared(null); }} />
    <div className="flex flex-wrap items-center gap-3"><Button onClick={() => void compare()} loading={comparing} disabled={selected.length < 2}>Bandingkan {selected.length ? `(${selected.length})` : ''}</Button><span className="text-sm text-muted">Pilih minimal 2 dan maksimal 4 sekolah.</span></div>
    {compareError && <ErrorState title="Perbandingan gagal" message={compareError} onRetry={() => void compare()} />}
    {compared && compared.length > 0 && <section className="space-y-3"><h2 className="text-lg font-bold text-ink">Hasil perbandingan</h2><CompareTable schools={compared} recommendations={recommendations} /></section>}
    <section className="space-y-4"><div><h2 className="text-lg font-bold text-ink">Cari sekolah</h2><p className="text-sm text-muted">Ketik nama, NPSN, atau wilayah. Hasil pencarian diperbarui otomatis.</p></div><SchoolFilters filters={filters} onChange={(values) => { setFilters(values); setPage(1); }} onSearch={() => { setPage(1); setReload((value) => value + 1); }} loading={loading} />
      {loading ? <LoadingState rows={4} /> : error ? <ErrorState message={error} onRetry={() => setReload((value) => value + 1)} /> : <SchoolSearchList schools={schools} onSelect={toggle} selectedIds={selected.map((s) => s.id)} />}
      <nav aria-label="Halaman daftar sekolah" className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" disabled={loading || page === 1} onClick={() => setPage((value) => value - 1)}>Sebelumnya</Button>
        <span className="text-sm text-muted" aria-live="polite">Halaman {page}</span>
        <Button variant="secondary" disabled={loading || !!error || schools.length < 10} onClick={() => setPage((value) => value + 1)}>Berikutnya</Button>
      </nav>
    </section>
    <p className="text-sm text-muted">Ingin melihat informasi lengkap dulu? <Link to="/recommendations" className="font-semibold text-link hover:underline">Buka rekomendasi SMA</Link>.</p>
  </div>;
}
