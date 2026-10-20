import { ApiError, request } from './api';
import type {
  AcademicRecord,
  AcademicRecordPayload,
  Achievement,
  AchievementPayload,
  Id,
  InterestAssessment,
  InterestAssessmentPayload,
  Profile,
  ProfileUpdatePayload,
  SchoolPreference,
  Subject,
} from '../types/profile';

/** 404 berarti datanya belum ada (profil kosong, tes belum diambil), bukan error. */
async function nullOn404<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

interface BackendProfile {
  id: string;
  user_id: string;
  current_school_name: string | null;
  grade: number | null;
  domisili_kecamatan: string | null;
  latitude: number | null;
  longitude: number | null;
  budget_max_per_bulan: number | null;
  max_distance_km: number | null;
  preferred_ownership: string[] | null;
  profile_completeness: number;
}

interface BackendAcademicRecord {
  id: Id;
  subject_id: Id;
  subject_name?: string;
  grade_level: number;
  semester: number;
  score: number;
}

function fromBackendProfile(bp: BackendProfile): Profile {
  let preference: SchoolPreference = 'semua';
  if (bp.preferred_ownership) {
    if (bp.preferred_ownership.includes('negeri') && !bp.preferred_ownership.includes('swasta')) {
      preference = 'negeri';
    } else if (bp.preferred_ownership.includes('swasta') && !bp.preferred_ownership.includes('negeri')) {
      preference = 'swasta';
    }
  }

  return {
    current_school: bp.current_school_name,
    grade: bp.grade,
    kecamatan: bp.domisili_kecamatan,
    latitude: bp.latitude,
    longitude: bp.longitude,
    max_budget_monthly: bp.budget_max_per_bulan,
    max_distance_km: bp.max_distance_km,
    school_type_preference: preference,
    profile_completeness: bp.profile_completeness,
  };
}

function toBackendProfilePayload(payload: ProfileUpdatePayload): Record<string, unknown> {
  let ownership: string[] | null = null;
  if (payload.school_type_preference === 'negeri') {
    ownership = ['negeri'];
  } else if (payload.school_type_preference === 'swasta') {
    ownership = ['swasta'];
  } else if (payload.school_type_preference === 'semua') {
    ownership = ['negeri', 'swasta'];
  }

  return {
    current_school_name: payload.current_school,
    grade: payload.grade,
    domisili_kecamatan: payload.kecamatan,
    latitude: payload.latitude,
    longitude: payload.longitude,
    budget_max_per_bulan: payload.max_budget_monthly,
    max_distance_km: payload.max_distance_km,
    preferred_ownership: ownership,
  };
}

export async function getProfile(): Promise<Profile | null> {
  const data = await nullOn404(request<BackendProfile>({ method: 'get', url: '/profile' }));
  return data ? fromBackendProfile(data) : null;
}

export async function updateProfile(payload: ProfileUpdatePayload): Promise<Profile> {
  const data = await request<BackendProfile>({
    method: 'put',
    url: '/profile',
    data: toBackendProfilePayload(payload),
  });
  return fromBackendProfile(data);
}

export function getSubjects(): Promise<Subject[]> {
  return request<Subject[]>({ method: 'get', url: '/profile/subjects' }, { public: true });
}

export async function listAcademicRecords(): Promise<AcademicRecord[]> {
  const data = await request<BackendAcademicRecord[]>({ method: 'get', url: '/profile/academic-records' });
  return (data || []).map((item) => ({
    id: item.id,
    subject_id: item.subject_id,
    subject_name: item.subject_name,
    grade: item.grade_level,
    semester: item.semester,
    score: item.score,
  }));
}

export async function createAcademicRecord(payload: AcademicRecordPayload): Promise<AcademicRecord> {
  const data = await request<BackendAcademicRecord>({
    method: 'post',
    url: '/profile/academic-records',
    data: {
      subject_id: payload.subject_id,
      grade_level: payload.grade,
      semester: payload.semester,
      score: payload.score,
    },
  });
  return {
    id: data.id,
    subject_id: data.subject_id,
    subject_name: data.subject_name,
    grade: data.grade_level,
    semester: data.semester,
    score: data.score,
  };
}

export async function updateAcademicRecord(id: Id, payload: AcademicRecordPayload): Promise<AcademicRecord> {
  const data = await request<BackendAcademicRecord>({
    method: 'put',
    url: `/profile/academic-records/${id}`,
    data: { score: payload.score },
  });
  return {
    id: data.id,
    subject_id: data.subject_id,
    subject_name: data.subject_name,
    grade: data.grade_level,
    semester: data.semester,
    score: data.score,
  };
}

export async function deleteAcademicRecord(id: Id): Promise<void> {
  await request<unknown>({ method: 'delete', url: `/profile/academic-records/${id}` });
}

export function listAchievements(): Promise<Achievement[]> {
  return request<Achievement[]>({ method: 'get', url: '/profile/achievements' });
}

export function createAchievement(payload: AchievementPayload): Promise<Achievement> {
  return request<Achievement>({ method: 'post', url: '/profile/achievements', data: payload });
}

export async function deleteAchievement(id: Id): Promise<void> {
  await request<unknown>({ method: 'delete', url: `/profile/achievements/${id}` });
}

export function saveInterestAssessment(payload: InterestAssessmentPayload): Promise<InterestAssessment> {
  return request<InterestAssessment>({ method: 'post', url: '/profile/interest-assessment', data: payload });
}

export function getLatestInterestAssessment(): Promise<InterestAssessment | null> {
  return nullOn404(request<InterestAssessment>({ method: 'get', url: '/profile/interest-assessment/latest' }));
}
