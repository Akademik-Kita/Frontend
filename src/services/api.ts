import axios, { type AxiosRequestConfig } from 'axios';
import { tokenStorage } from './tokenStorage';

/** Envelope respons backend: { success, data, message } */
export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message: string;
}

export class ApiError extends Error {
  status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface RequestOptions {
  /** Endpoint publik (login, register, subjects): 401 tidak memicu logout otomatis. */
  public?: boolean;
}

let unauthorizedHandler: (() => void) | null = null;

/** authStore memasang handler ini agar tidak terjadi import melingkar. */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string | undefined,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

function defaultMessage(status: number): string {
  if (status === 401) return 'Sesimu sudah berakhir. Silakan masuk lagi.';
  if (status === 403) return 'Kamu tidak punya akses ke halaman ini.';
  if (status === 404) return 'Data tidak ditemukan.';
  if (status === 422) return 'Data yang dikirim belum sesuai. Periksa lagi isiannya.';
  if (status >= 500) return 'Server sedang bermasalah. Coba lagi beberapa saat lagi.';
  return 'Permintaan gagal. Coba lagi.';
}

function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return new ApiError('Tidak bisa terhubung ke server. Periksa koneksi internetmu, lalu coba lagi.');
    }
    const status = error.response.status;
    const body = error.response.data as { message?: unknown; detail?: unknown } | undefined;
    const fromBody =
      typeof body?.message === 'string' && body.message
        ? body.message
        : typeof body?.detail === 'string' && body.detail
          ? body.detail
          : null;
    return new ApiError(fromBody ?? defaultMessage(status), status);
  }
  return new ApiError('Terjadi kesalahan. Coba lagi.');
}

/** Mengembalikan data dari envelope; kegagalan HTTP atau success: false menjadi ApiError. */
export async function request<T>(config: AxiosRequestConfig, options: RequestOptions = {}): Promise<T> {
  try {
    const response = await api.request<ApiEnvelope<T>>(config);
    const body = response.data;
    if (body && typeof body === 'object' && 'success' in body) {
      if (!body.success) {
        throw new ApiError(body.message || 'Permintaan gagal.', response.status);
      }
      return body.data;
    }
    return body as unknown as T;
  } catch (error) {
    const apiError = error instanceof ApiError ? error : toApiError(error);
    if (apiError.status === 401 && !options.public && tokenStorage.get()) {
      unauthorizedHandler?.();
    }
    throw apiError;
  }
}
