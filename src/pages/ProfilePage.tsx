import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ConfirmDelete } from '../components/common/ConfirmDelete';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { PageHeader } from '../components/common/PageHeader';
import { Badge } from '../components/common/Badge';
import { AcademicRecordForm } from '../components/profile/AcademicRecordForm';
import { AcademicRecordList } from '../components/profile/AcademicRecordList';
import { ACHIEVEMENT_LEVELS, AchievementForm } from '../components/profile/AchievementForm';
import { ProfileForm } from '../components/profile/ProfileForm';
import { ProfileProgress } from '../components/profile/ProfileProgress';
import * as profileService from '../services/profileService';
import type {
  AcademicRecord,
  AcademicRecordPayload,
  Achievement,
  AchievementPayload,
  Id,
  Profile,
  ProfileUpdatePayload,
  Subject,
} from '../types/profile';
import { cx } from '../utils/cx';
import { getErrorMessage } from '../utils/errors';

type Section = 'data' | 'nilai' | 'prestasi';

const sections: Array<{ id: Section; label: string }> = [
  { id: 'data', label: 'Data diri' },
  { id: 'nilai', label: 'Nilai rapor' },
  { id: 'prestasi', label: 'Prestasi' },
];

export default function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedSection = searchParams.get('section');
  const section: Section =
    requestedSection === 'nilai' || requestedSection === 'prestasi' ? requestedSection : 'data';
  const setSection = (value: Section) =>
    setSearchParams(value === 'data' ? {} : { section: value }, { replace: true });
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading');
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [records, setRecords] = useState<AcademicRecord[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [editing, setEditing] = useState<AcademicRecord | null>(null);
  const [deletingAchievement, setDeletingAchievement] = useState<Id | null>(null);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const [p, s, r, a] = await Promise.all([
        profileService.getProfile(),
        profileService.getSubjects(),
        profileService.listAcademicRecords(),
        profileService.listAchievements(),
      ]);
      setProfile(p);
      setSubjects(s);
      setRecords(r);
      setAchievements(a);
      setStatus('ready');
    } catch (error) {
      setLoadError(getErrorMessage(error));
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  /** Kelengkapan profil dihitung backend, jadi diambil ulang setelah data berubah. */
  const refreshProfile = async () => {
    try {
      setProfile(await profileService.getProfile());
    } catch {
      /* angka kelengkapan lama tetap tampil; tidak perlu mengganggu pengguna */
    }
  };

  const saveProfile = async (payload: ProfileUpdatePayload) => {
    await profileService.updateProfile(payload);
    await refreshProfile();
  };

  const saveRecord = async (payload: AcademicRecordPayload) => {
    if (editing) {
      await profileService.updateAcademicRecord(editing.id, payload);
      setEditing(null);
    } else {
      await profileService.createAcademicRecord(payload);
    }
    setRecords(await profileService.listAcademicRecords());
    void refreshProfile();
  };

  const removeRecord = async (id: Id) => {
    setActionError(null);
    try {
      await profileService.deleteAcademicRecord(id);
      if (editing && editing.id === id) setEditing(null);
      setRecords(await profileService.listAcademicRecords());
      void refreshProfile();
    } catch (error) {
      setActionError(getErrorMessage(error, 'Nilai belum terhapus. Coba lagi.'));
    }
  };

  const saveAchievement = async (payload: AchievementPayload) => {
    await profileService.createAchievement(payload);
    setAchievements(await profileService.listAchievements());
    void refreshProfile();
  };

  const removeAchievement = async (id: Id) => {
    setActionError(null);
    setDeletingAchievement(id);
    try {
      await profileService.deleteAchievement(id);
      setAchievements(await profileService.listAchievements());
      void refreshProfile();
    } catch (error) {
      setActionError(getErrorMessage(error, 'Prestasi belum terhapus. Coba lagi.'));
    } finally {
      setDeletingAchievement(null);
    }
  };

  const levelLabel = (level: string) =>
    ACHIEVEMENT_LEVELS.find((item) => item.value === level)?.label ?? level;

  return (
    <div className="space-y-12">
      <PageHeader
        title="Profilku"
        description="Isi satu bagian dulu, lalu pindah ke bagian berikutnya kapan saja."
        action={
          <Link to="/interest-test">
            <Button variant="secondary">Lanjut ke tes minat</Button>
          </Link>
        }
      />

      {status === 'loading' ? <LoadingState rows={4} label="Memuat profilmu…" /> : null}
      {status === 'error' ? <ErrorState message={loadError} onRetry={() => void load()} /> : null}

      {status === 'ready' ? (
        <>
          <ProfileProgress completeness={profile?.profile_completeness ?? null} />

          <div className="space-y-6">
            <div role="tablist" aria-label="Bagian profil" className="flex gap-2 overflow-x-auto">
              {sections.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`tab-${item.id}`}
                  aria-selected={section === item.id}
                  aria-controls={`panel-${item.id}`}
                  onClick={() => setSection(item.id)}
                  className={cx(
                    'h-11 shrink-0 rounded-xl px-5 text-sm font-semibold transition-colors',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                    section === item.id
                      ? 'bg-primary text-white'
                      : 'bg-surface text-ink ring-1 ring-line hover:bg-lavender',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {actionError ? (
              <div role="alert" className="rounded-xl bg-dangersoft px-4 py-3 text-sm text-danger">
                {actionError}
              </div>
            ) : null}

            {section === 'data' ? (
              <div role="tabpanel" id="panel-data" aria-labelledby="tab-data" className="step-in">
                <ProfileForm profile={profile} onSubmit={saveProfile} />
              </div>
            ) : null}

            {section === 'nilai' ? (
              <div
                role="tabpanel"
                id="panel-nilai"
                aria-labelledby="tab-nilai"
                className="step-in space-y-12"
              >
                {subjects.length === 0 ? (
                  <EmptyState
                    title="Daftar mata pelajaran kosong"
                    description="Mata pelajaran belum bisa dimuat dari server, jadi nilai belum bisa ditambah."
                    action={<Button onClick={() => void load()}>Muat ulang</Button>}
                  />
                ) : (
                  <AcademicRecordForm
                    key={editing ? String(editing.id) : 'baru'}
                    subjects={subjects}
                    editing={editing}
                    onSubmit={saveRecord}
                    onCancelEdit={() => setEditing(null)}
                  />
                )}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-ink">Nilai yang sudah kamu isi</h2>
                  <AcademicRecordList
                    records={records}
                    subjects={subjects}
                    onEdit={(record) => {
                      setEditing(record);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onDelete={removeRecord}
                  />
                </div>
              </div>
            ) : null}

            {section === 'prestasi' ? (
              <div
                role="tabpanel"
                id="panel-prestasi"
                aria-labelledby="tab-prestasi"
                className="step-in space-y-12"
              >
                <AchievementForm onSubmit={saveAchievement} />
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-ink">Prestasi yang sudah kamu isi</h2>
                  {achievements.length === 0 ? (
                    <EmptyState
                      title="Belum ada prestasi"
                      description="Lomba, olimpiade, atau kejuaraan boleh ditambahkan. Kalau belum ada, bagian ini boleh kosong."
                    />
                  ) : (
                    <Card flush>
                      <ul>
                        {achievements.map((item) => (
                          <li
                            key={String(item.id)}
                            className="flex flex-col gap-3 border-b border-line px-6 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:px-8"
                          >
                            <div>
                              <p className="text-base font-semibold text-ink">{item.title}</p>
                              <div className="mt-2 flex items-center gap-2">
                                <Badge tone="lavender">{levelLabel(item.level)}</Badge>
                                <span className="text-sm text-muted">{item.year}</span>
                              </div>
                            </div>
                            <ConfirmDelete
                              subject={`prestasi ${item.title}`}
                              busy={deletingAchievement === item.id}
                              onConfirm={() => removeAchievement(item.id)}
                            />
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
