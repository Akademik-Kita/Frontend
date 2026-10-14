import { ApiError } from '../services/api';

export function getErrorMessage(error: unknown, fallback = 'Terjadi kesalahan. Coba lagi sebentar lagi.'): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
