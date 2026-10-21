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

/** Menerima access_token atau token; user yang belum disertakan diambil lewat /auth/me. */
export interface LoginResponse {
  access_token?: string;
  token?: string;
  token_type?: string;
  user?: User;
}
