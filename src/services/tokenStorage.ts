// Token di localStorage bisa dibaca JavaScript dan terekspos jika ada celah XSS.
// Beralih ke cookie HttpOnly memerlukan dukungan backend.
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
      /* Browser memblokir localStorage; token tidak tersimpan. */
    }
  },
  clear(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
    }
  },
};
