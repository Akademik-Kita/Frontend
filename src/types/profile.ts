
export type Id = string | number;

export type SchoolPreference = 'negeri' | 'swasta' | 'semua';

export interface Profile {
  current_school: string | null;
  grade: number | null;
  kecamatan: string | null;
  latitude: number | null;
  longitude: number | null;
  max_budget_monthly: number | null;
  max_distance_km: number | null;
  school_type_preference: SchoolPreference | null;
  /** Dihitung backend. Frontend hanya menampilkan. */
  profile_completeness: number | null;
}

export type ProfileUpdatePayload = Omit<Profile, 'profile_completeness'>;

export interface Subject {
  id: Id;
  name: string;
}

export interface AcademicRecord {
  id: Id;
  subject_id: Id;
  subject_name?: string;
  grade: number;
  semester: number;
  score: number;
}

export interface AcademicRecordPayload {
  subject_id: Id;
  grade: number;
  semester: number;
  score: number;
}

export type AchievementLevel =
  | 'sekolah'
  | 'kecamatan'
  | 'kota'
  | 'provinsi'
  | 'nasional'
  | 'internasional';

export interface Achievement {
  id: Id;
  title: string;
  level: AchievementLevel;
  year: number;
}

export interface AchievementPayload {
  title: string;
  level: AchievementLevel;
  year: number;
}

/* Key dimensi harus sama dengan payload tes minat di backend. */
export type InterestDimension =
  | 'realistic'
  | 'investigative'
  | 'artistic'
  | 'social'
  | 'enterprising'
  | 'conventional';

export type InterestScores = Record<InterestDimension, number>;

export interface InterestAssessmentPayload {
  instrument_version: string;
  scores: InterestScores;
}

export interface InterestAssessment extends InterestAssessmentPayload {
  created_at?: string;
}
