import { useState, type FormEvent } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import type { Profile, ProfileUpdatePayload, SchoolPreference } from '../../types/profile';
import { getErrorMessage } from '../../utils/errors';

interface ProfileFormProps {
  profile: Profile | null;
  onSubmit: (payload: ProfileUpdatePayload) => Promise<void>;
}

interface FormState {
  current_school: string;
  grade: string;
  kecamatan: string;
  latitude: string;
  longitude: string;
  max_budget_monthly: string;
  max_distance_km: string;
  school_type_preference: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const text = (value: string | number | null | undefined): string => (value === null || value === undefined ? '' : String(value));

function toFormState(profile: Profile | null): FormState {
  return {
    current_school: text(profile?.current_school),
    grade: text(profile?.grade),
    kecamatan: text(profile?.kecamatan),
    latitude: text(profile?.latitude),
    longitude: text(profile?.longitude),
    max_budget_monthly: text(profile?.max_budget_monthly),
    max_distance_km: text(profile?.max_distance_km),
    school_type_preference: text(profile?.school_type_preference),
  };
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.current_school.trim()) errors.current_school = 'Nama sekolah wajib diisi.';
  if (!['7', '8', '9'].includes(form.grade)) errors.grade = 'Pilih kelasmu saat ini.';
  if (!form.kecamatan.trim()) errors.kecamatan = 'Kecamatan wajib diisi.';

  const budget = Number(form.max_budget_monthly);
  if (form.max_budget_monthly === '') errors.max_budget_monthly = 'Isi biaya maksimal. Isi 0 kalau tidak ada batas.';
  else if (!Number.isFinite(budget) || budget < 0) errors.max_budget_monthly = 'Biaya harus berupa angka 0 atau lebih.';

  const distance = Number(form.max_distance_km);
  if (form.max_distance_km === '') errors.max_distance_km = 'Jarak maksimal wajib diisi.';
  else if (!Number.isFinite(distance) || distance <= 0) errors.max_distance_km = 'Jarak harus lebih dari 0 km.';

  if (!['negeri', 'swasta', 'semua'].includes(form.school_type_preference)) {
    errors.school_type_preference = 'Pilih jenis sekolah yang kamu mau.';
  }

  const hasLat = form.latitude.trim() !== '';
  const hasLng = form.longitude.trim() !== '';
  if (hasLat !== hasLng) {
    if (!hasLat) errors.latitude = 'Isi garis lintang juga, atau kosongkan keduanya.';
    if (!hasLng) errors.longitude = 'Isi garis bujur juga, atau kosongkan keduanya.';
  }
  if (hasLat) {
    const lat = Number(form.latitude);
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) errors.latitude = 'Lintang harus antara -90 dan 90.';
  }
  if (hasLng) {
    const lng = Number(form.longitude);
    if (!Number.isFinite(lng) || lng < -180 || lng > 180) errors.longitude = 'Bujur harus antara -180 dan 180.';
  }
  return errors;
}

function toPayload(form: FormState): ProfileUpdatePayload {
  const hasCoords = form.latitude.trim() !== '' && form.longitude.trim() !== '';
  return {
    current_school: form.current_school.trim(),
    grade: Number(form.grade),
    kecamatan: form.kecamatan.trim(),
    latitude: hasCoords ? Number(form.latitude) : null,
    longitude: hasCoords ? Number(form.longitude) : null,
    max_budget_monthly: Number(form.max_budget_monthly),
    max_distance_km: Number(form.max_distance_km),
    school_type_preference: form.school_type_preference as SchoolPreference,
  };
}

export function ProfileForm({ profile, onSubmit }: ProfileFormProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(profile));
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationNote, setLocationNote] = useState<string | null>(null);

  const set = (key: keyof FormState) => (value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const useMyLocation = () => {
    if (!('geolocation' in navigator)) {
      setLocationNote('Browsermu tidak mendukung lokasi. Isi koordinat secara manual.');
      return;
    }
    setLocating(true);
    setLocationNote(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((current) => ({
          ...current,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        setSaved(false);
        setLocating(false);
      },
      () => {
        setLocationNote('Lokasi tidak bisa diambil. Izinkan akses lokasi, atau isi koordinat secara manual.');
        setLocating(false);
      },
      { timeout: 10000 },
    );
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    const next = validate(form);
    setErrors(next);
    setSubmitError(null);
    setSaved(false);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit(toPayload(form));
      setSaved(true);
    } catch (error) {
      setSubmitError(getErrorMessage(error, 'Profil belum tersimpan. Coba lagi.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card>
        <div className="space-y-12">
          <section aria-labelledby="sekolah-heading">
            <h2 id="sekolah-heading" className="text-xl font-semibold text-ink">
              Sekolahmu sekarang
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <Input
                label="Nama sekolah"
                className="sm:col-span-2"
                value={form.current_school}
                onChange={(e) => set('current_school')(e.target.value)}
                error={errors.current_school}
              />
              <Select
                label="Kelas"
                value={form.grade}
                onChange={(e) => set('grade')(e.target.value)}
                error={errors.grade}
              >
                <option value="">Pilih kelas</option>
                <option value="7">Kelas 7</option>
                <option value="8">Kelas 8</option>
                <option value="9">Kelas 9</option>
              </Select>
              <Input
                label="Kecamatan tempat tinggal"
                value={form.kecamatan}
                onChange={(e) => set('kecamatan')(e.target.value)}
                error={errors.kecamatan}
              />
            </div>
          </section>

          <section aria-labelledby="lokasi-heading">
            <h2 id="lokasi-heading" className="text-xl font-semibold text-ink">
              Lokasi rumah
            </h2>
            <p className="mt-2 text-sm text-muted">
              Boleh dikosongkan. Koordinat dipakai untuk menghitung jarak rumah ke sekolah.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <Input
                label="Lintang (latitude)"
                inputMode="decimal"
                value={form.latitude}
                onChange={(e) => set('latitude')(e.target.value)}
                error={errors.latitude}
                placeholder="-6.2383"
              />
              <Input
                label="Bujur (longitude)"
                inputMode="decimal"
                value={form.longitude}
                onChange={(e) => set('longitude')(e.target.value)}
                error={errors.longitude}
                placeholder="106.9756"
              />
            </div>
            <div className="mt-4">
              <Button variant="secondary" loading={locating} loadingText="Mencari lokasi…" onClick={useMyLocation}>
                Pakai lokasiku sekarang
              </Button>
              {locationNote ? <p className="mt-2 text-sm text-danger">{locationNote}</p> : null}
            </div>
          </section>

          <section aria-labelledby="pilihan-heading">
            <h2 id="pilihan-heading" className="text-xl font-semibold text-ink">
              Pilihan SMA yang kamu cari
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <Input
                label="Biaya maksimal per bulan (Rp)"
                type="number"
                min={0}
                inputMode="numeric"
                value={form.max_budget_monthly}
                onChange={(e) => set('max_budget_monthly')(e.target.value)}
                error={errors.max_budget_monthly}
              />
              <Input
                label="Jarak maksimal dari rumah (km)"
                type="number"
                min={0}
                step="0.5"
                inputMode="decimal"
                value={form.max_distance_km}
                onChange={(e) => set('max_distance_km')(e.target.value)}
                error={errors.max_distance_km}
              />
              <Select
                label="Jenis sekolah"
                className="sm:col-span-2"
                value={form.school_type_preference}
                onChange={(e) => set('school_type_preference')(e.target.value)}
                error={errors.school_type_preference}
              >
                <option value="">Pilih jenis sekolah</option>
                <option value="negeri">Negeri</option>
                <option value="swasta">Swasta</option>
                <option value="semua">Negeri atau swasta, tidak masalah</option>
              </Select>
            </div>
          </section>

          <div>
            {submitError ? (
              <div role="alert" className="mb-4 rounded-xl bg-dangersoft px-4 py-3 text-sm text-danger">
                {submitError}
              </div>
            ) : null}
            {saved ? (
              <div role="status" className="mb-4 rounded-xl bg-softgreen px-4 py-3 text-sm text-ink">
                Profil tersimpan.
              </div>
            ) : null}
            <Button type="submit" loading={submitting} loadingText="Menyimpan…">
              Simpan profil
            </Button>
          </div>
        </div>
      </Card>
    </form>
  );
}
