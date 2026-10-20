import { useState, type FormEvent } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import type { AchievementLevel, AchievementPayload } from '../../types/profile';
import { getErrorMessage } from '../../utils/errors';

export const ACHIEVEMENT_LEVELS: Array<{ value: AchievementLevel; label: string }> = [
  { value: 'sekolah', label: 'Sekolah' },
  { value: 'kecamatan', label: 'Kecamatan' },
  { value: 'kota', label: 'Kota/Kabupaten' },
  { value: 'provinsi', label: 'Provinsi' },
  { value: 'nasional', label: 'Nasional' },
  { value: 'internasional', label: 'Internasional' },
];

interface AchievementFormProps {
  onSubmit: (payload: AchievementPayload) => Promise<void>;
}

interface Errors {
  title?: string;
  level?: string;
  year?: string;
}

export function AchievementForm({ onSubmit }: AchievementFormProps) {
  const currentYear = new Date().getFullYear();
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState('');
  const [year, setYear] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    const next: Errors = {};
    if (!title.trim()) next.title = 'Nama prestasi wajib diisi.';
    if (!ACHIEVEMENT_LEVELS.some((item) => item.value === level)) next.level = 'Pilih tingkat lomba atau kegiatan.';
    const numericYear = Number(year);
    if (year === '') next.year = 'Tahun wajib diisi.';
    else if (!Number.isInteger(numericYear) || numericYear < currentYear - 10 || numericYear > currentYear) {
      next.year = `Isi tahun antara ${currentYear - 10} dan ${currentYear}.`;
    }
    setErrors(next);
    setSubmitError(null);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), level: level as AchievementLevel, year: numericYear });
      setTitle('');
      setLevel('');
      setYear('');
    } catch (error) {
      setSubmitError(getErrorMessage(error, 'Prestasi belum tersimpan. Coba lagi.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card>
        <h2 className="text-xl font-semibold text-ink">Tambah prestasi</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Input
            label="Nama prestasi"
            className="sm:col-span-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            placeholder="Juara 2 Olimpiade Matematika"
          />
          <Select label="Tingkat" value={level} onChange={(e) => setLevel(e.target.value)} error={errors.level}>
            <option value="">Pilih tingkat</option>
            {ACHIEVEMENT_LEVELS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
          <Input
            label="Tahun"
            type="number"
            inputMode="numeric"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            error={errors.year}
            placeholder={String(currentYear)}
          />
        </div>
        {submitError ? (
          <div role="alert" className="mt-6 rounded-xl bg-dangersoft px-4 py-3 text-sm text-danger">
            {submitError}
          </div>
        ) : null}
        <div className="mt-6">
          <Button type="submit" loading={submitting} loadingText="Menyimpan…">
            Tambah prestasi
          </Button>
        </div>
      </Card>
    </form>
  );
}
