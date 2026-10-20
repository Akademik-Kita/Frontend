import { request } from './api';
import type { AdmissionHistory, School, SchoolListResponse } from '../types/school';

export interface SchoolFilters {
  search?: string;
  kecamatan?: string;
  ownership?: string;
  accreditation?: string;
  page?: number;
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
  if (Array.isArray(raw)) return { items: raw, page: filters.page ?? 1 };
  return {
    ...raw,
    items: raw.items ?? (raw as unknown as { data?: School[] }).data ?? [],
  };
}

export function getSchool(id: string): Promise<School> {
  return request<School>({ method: 'GET', url: `/schools/${encodeURIComponent(id)}` });
}

export function getSchoolComparison(ids: Array<string | number>): Promise<School[]> {
  return request<School[]>({
    method: 'GET',
    url: `/schools/compare?ids=${ids.map(encodeURIComponent).join(',')}`,
  });
}

export function getAdmissionHistory(schoolId: string, majorId: string): Promise<AdmissionHistory[]> {
  return request<AdmissionHistory[]>({
    method: 'GET',
    url: `/schools/${encodeURIComponent(schoolId)}/jurusan/${encodeURIComponent(majorId)}/riwayat-penerimaan`,
  });
}
