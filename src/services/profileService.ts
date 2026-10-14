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

export function getProfile(): Promise<Profile | null> {
  return nullOn404(request<Profile>({ method: 'get', url: '/profile' }));
}

export function updateProfile(payload: ProfileUpdatePayload): Promise<Profile> {
  return request<Profile>({ method: 'put', url: '/profile', data: payload });
}

export function getSubjects(): Promise<Subject[]> {
  return request<Subject[]>({ method: 'get', url: '/profile/subjects' }, { public: true });
}

export function listAcademicRecords(): Promise<AcademicRecord[]> {
  return request<AcademicRecord[]>({ method: 'get', url: '/profile/academic-records' });
}

export function createAcademicRecord(payload: AcademicRecordPayload): Promise<AcademicRecord> {
  return request<AcademicRecord>({ method: 'post', url: '/profile/academic-records', data: payload });
}

export function updateAcademicRecord(id: Id, payload: AcademicRecordPayload): Promise<AcademicRecord> {
  return request<AcademicRecord>({ method: 'put', url: `/profile/academic-records/${id}`, data: payload });
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
