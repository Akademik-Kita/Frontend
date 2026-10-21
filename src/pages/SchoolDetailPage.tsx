import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { PageHeader } from '../components/common/PageHeader';
import { SchoolDetail } from '../components/schools/SchoolDetail';
import { getSchool } from '../services/schoolService';
import { ApiError } from '../services/api';
import type { School } from '../types/school';

export default function SchoolDetailPage() {
  const { id = '' } = useParams();
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    getSchool(id).then((data) => { if (active) setSchool(data); })
      .catch((err: unknown) => { if (active) setError(err instanceof ApiError ? err.message : 'Detail sekolah belum bisa dimuat.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);
  return <div className="space-y-6">
    <div><Link to="/recommendations" className="text-sm font-semibold text-link hover:underline">← Kembali ke rekomendasi</Link></div>
    {loading ? <LoadingState rows={4} /> : error ? <ErrorState message={error} onRetry={() => { setLoading(true); setError(''); getSchool(id).then(setSchool).catch((err: unknown) => setError(err instanceof ApiError ? err.message : 'Detail sekolah belum bisa dimuat.')).finally(() => setLoading(false)); }} /> : school ? <><PageHeader title={school.name} description="Informasi sekolah, jurusan, fasilitas, dan riwayat penerimaan yang tersedia." action={<Button variant="secondary" onClick={() => window.history.back()}>Kembali</Button>} /><SchoolDetail school={school} /></> : null}
  </div>;
}
