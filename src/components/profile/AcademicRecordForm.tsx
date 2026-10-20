import { useState, type FormEvent } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import type { AcademicRecord, AcademicRecordPayload, Subject } from '../../types/profile';
import { getErrorMessage } from '../../utils/errors';

interface AcademicRecordFormProps {
  subjects: Subject[];
  /** Isi untuk mengubah nilai yang sudah ada; kosongkan untuk menambah. */
  editing: AcademicRecord | null;
  onSubmit: (payload: AcademicRecordPayload) => Promise<void>;
  onCancelEdit: () => void;
}

interface Errors {
  subject_id?: string;
  grade?: string;
  semester?: string;
  score?: string;
}

/** Beri `key` berbeda saat berganti data yang diedit supaya isian ikut berganti. */
export function AcademicRecordForm({ subjects, editing, onSubmit, onCancelEdit }: AcademicRecordFormProps) {
  const [subjectId, setSubjectId] = useState(editing ? String(editing.subject_id) : '');
  const [grade, setGrade] = useState(editing ? String(editing.grade) : '');
  const [semester, setSemester] = useState(editing ? String(editing.semester) : '');
  const [score, setScore] = useState(editing ? String(editing.score) : '');
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    const next: Errors = {};
    if (!subjectId) next.subject_id = 'Pilih mata pelajaran.';
    if (!['7', '8', '9'].includes(grade)) next.grade = 'Pilih kelas.';
    if (!['1', '2'].includes(semester)) next.semester = 'Pilih semester.';
    const numeric = Number(score);
    if (score === '') next.score = 'Nilai wajib diisi.';
    else if (!Number.isFinite(numeric) || numeric < 0 || numeric > 100) next.score = 'Nilai harus antara 0 dan 100.';
    setErrors(next);
    setSubmitError(null);
    if (Object.keys(next).length > 0) return;

    const subject = subjects.find((item) => String(item.id) === subjectId);
    if (!subject) {
      setErrors({ subject_id: 'Mata pelajaran tidak ditemukan. Muat ulang halaman.' });
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ subject_id: subject.id, grade: Number(grade), semester: Number(semester), score: numeric });
      if (!editing) {
        setScore('');
        setSubjectId('');
      }
    } catch (error) {
      setSubmitError(getErrorMessage(error, 'Nilai belum tersimpan. Coba lagi.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card tone={editing ? 'yellow' : 'white'}>
        <h2 className="text-xl font-semibold text-ink">{editing ? 'Ubah nilai' : 'Tambah nilai'}</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Select
            label="Mata pelajaran"
            className="sm:col-span-2"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            error={errors.subject_id}
          >
            <option value="">Pilih mata pelajaran</option>
            {subjects.map((subject) => (
              <option key={String(subject.id)} value={String(subject.id)}>
                {subject.name}
              </option>
            ))}
          </Select>
          <Select label="Kelas" value={grade} onChange={(e) => setGrade(e.target.value)} error={errors.grade}>
            <option value="">Pilih kelas</option>
            <option value="7">Kelas 7</option>
            <option value="8">Kelas 8</option>
            <option value="9">Kelas 9</option>
          </Select>
          <Select
            label="Semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            error={errors.semester}
          >
            <option value="">Pilih semester</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </Select>
          <Input
            label="Nilai (0–100)"
            type="number"
            min={0}
            max={100}
            step="0.01"
            inputMode="decimal"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            error={errors.score}
          />
        </div>
        {submitError ? (
          <div role="alert" className="mt-6 rounded-xl bg-dangersoft px-4 py-3 text-sm text-danger">
            {submitError}
          </div>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="submit" loading={submitting} loadingText="Menyimpan…">
            {editing ? 'Simpan perubahan' : 'Tambah nilai'}
          </Button>
          {editing ? (
            <Button variant="ghost" disabled={submitting} onClick={onCancelEdit}>
              Batal
            </Button>
          ) : null}
        </div>
      </Card>
    </form>
  );
}
