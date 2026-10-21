import { request } from './api';
import type { AdmissionHistory, School, SchoolListResponse } from '../types/school';

export interface SchoolFilters {
  search?: string;
  kecamatan?: string;
  ownership?: string;
  accreditation?: string;
  page?: number;
}

interface BackendSchool extends School {
  npsn_or_code?: string;
  fasilitas?: string[];
  biaya?: Array<{ monthly_equivalent: number }>;
  jurusan?: Array<{
    id: string; name: string; description?: string;
    jalur_seleksi?: Array<{ quota: number }>;
  }>;
}

function normalizeSchool(raw: BackendSchool): School {
  const costs = raw.biaya?.map((cost) => cost.monthly_equivalent)
    .filter((cost) => Number.isFinite(cost) && cost >= 0) ?? [];
  return {
    ...raw,
    npsn: raw.npsn ?? raw.npsn_or_code,
    monthly_fee: raw.monthly_fee ?? (costs.length ? Math.min(...costs) : null),
    facilities: raw.facilities ?? raw.fasilitas ?? [],
    majors: raw.majors ?? raw.jurusan?.map((program) => ({
      id: program.id, name: program.name, description: program.description,
      quota: program.jalur_seleksi?.reduce((sum, track) => sum + track.quota, 0),
    })) ?? [],
  };
}

export async function getSchools(filters: SchoolFilters = {}): Promise<SchoolListResponse> {
  const params = new URLSearchParams();
  if (filters.kecamatan) params.set('kecamatan', filters.kecamatan);
  if (filters.ownership) params.set('ownership', filters.ownership);
  if (filters.accreditation) params.set('accreditation', filters.accreditation);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.search) params.set('search', filters.search);
  const query = params.toString();
  const raw = await request<School[] | SchoolListResponse>({
    method: 'GET',
    url: `/schools${query ? `?${query}` : ''}`,
  });
  if (Array.isArray(raw)) return { items: raw.map(normalizeSchool), page: filters.page ?? 1 };
  return {
    ...raw,
    items: (raw.items ?? (raw as unknown as { data?: School[] }).data ?? []).map(normalizeSchool),
  };
}

export async function getSchool(id: string): Promise<School> {
  return normalizeSchool(await request<BackendSchool>({ method: 'GET', url: `/schools/${encodeURIComponent(id)}` }));
}

export async function getSchoolComparison(ids: Array<string | number>): Promise<School[]> {
  const schools = await request<BackendSchool[]>({
    method: 'GET',
    url: `/schools/compare?ids=${ids.map(encodeURIComponent).join(',')}`,
  });
  return schools.map(normalizeSchool);
}

export function getAdmissionHistory(schoolId: string, majorId: string): Promise<AdmissionHistory[]> {
  return request<AdmissionHistory[]>({
    method: 'GET',
    url: `/schools/${encodeURIComponent(schoolId)}/jurusan/${encodeURIComponent(majorId)}/riwayat-penerimaan`,
  });
}
