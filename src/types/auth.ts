export type UserRole = 'siswa' | 'orang_tua';

export interface User {
  id: string | number;
  email: string;
  full_name: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
}

/**
 * ASUMSI: bentuk respons login belum ada di brief.
 * Service menerima `access_token` atau `token`, dan `user` boleh kosong
 * (kalau kosong, user diambil dari GET /auth/me). Sesuaikan setelah backend dicek.
 */
export interface LoginResponse {
  access_token?: string;
  token?: string;
  token_type?: string;
  user?: User;
}
