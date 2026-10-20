import { ApiError, request } from './api';
import type { LoginPayload, LoginResponse, RegisterPayload, User } from '../types/auth';

export interface AuthSession {
  token: string;
  user: User | null;
}

export async function register(payload: RegisterPayload): Promise<void> {
  await request<unknown>({ method: 'post', url: '/auth/register', data: payload }, { public: true });
}

export async function login(payload: LoginPayload): Promise<AuthSession> {
  const data = await request<LoginResponse>(
    { method: 'post', url: '/auth/login', data: payload },
    { public: true },
  );
  const token = data.access_token ?? data.token;
  if (!token) {
    throw new ApiError('Respons login dari server tidak berisi token.');
  }
  return { token, user: data.user ?? null };
}

export async function getMe(): Promise<User> {
  return request<User>({ method: 'get', url: '/auth/me' });
}
