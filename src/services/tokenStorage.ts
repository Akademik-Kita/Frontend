/*
 * Penyimpanan token: localStorage (dipilih karena praktis dan bertahan antar sesi).
 * Risiko: token bisa dibaca skrip jahat kalau ada celah XSS. HttpOnly cookie lebih aman
 * tetapi butuh dukungan backend. Kalau tim memilih cookie, hanya file ini, api.ts,
 * dan authStore.ts yang berubah.
 */
const TOKEN_KEY = 'akademikkita.token';

export const tokenStorage = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* storage tidak tersedia; sesi hanya hidup selama tab terbuka */
    }
  },
  clear(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* diabaikan */
    }
  },
};
