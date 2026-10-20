export type Id = string | number;

export interface SchoolMajor {
  id: Id;
  name: string;
  quota?: number | null;
  applicants?: number | null;
  tuition_monthly?: number | null;
  description?: string | null;
}

export interface School {
  id: Id;
  name: string;
  npsn?: string | null;
  address?: string | null;
  kecamatan?: string | null;
  city?: string | null;
  province?: string | null;
  ownership?: 'negeri' | 'swasta' | string | null;
  accreditation?: string | null;
  distance_km?: number | null;
  monthly_fee?: number | null;
  facilities?: string[] | null;
  description?: string | null;
  website?: string | null;
  majors?: SchoolMajor[];
  image_url?: string | null;
}

export interface SchoolListResponse {
  items: School[];
  page?: number;
  total_pages?: number;
  total?: number;
}

export interface AdmissionHistory {
  year: number;
  jurusan_id?: Id;
  jurusan_name?: string;
  quota?: number | null;
  applicants?: number | null;
  accepted?: number | null;
}
