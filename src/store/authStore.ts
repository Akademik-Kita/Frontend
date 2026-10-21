import { create } from 'zustand';
import * as authService from '../services/authService';
import { setUnauthorizedHandler } from '../services/api';
import { tokenStorage } from '../services/tokenStorage';
import type { LoginPayload, RegisterPayload, User } from '../types/auth';

interface AuthState {
  token: string | null;
  user: User | null;
  /** Token tersimpan diperiksa sebelum route terproteksi ditampilkan. */
  initialized: boolean;
  hydrate: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const storedToken = tokenStorage.get();

export const useAuthStore = create<AuthState>((set, get) => ({
  token: storedToken,
  user: null,
  initialized: storedToken === null,

  hydrate: async () => {
    if (!get().token) {
      set({ initialized: true });
      return;
    }
    try {
      const user = await authService.getMe();
      set({ user, initialized: true });
    } catch {
      tokenStorage.clear();
      set({ token: null, user: null, initialized: true });
    }
  },

  login: async (payload) => {
    const session = await authService.login(payload);
    tokenStorage.set(session.token);
    set({ token: session.token });
    try {
      const user = session.user ?? (await authService.getMe());
      set({ user, initialized: true });
    } catch (error) {
      tokenStorage.clear();
      set({ token: null, user: null, initialized: true });
      throw error;
    }
  },

  register: async (payload) => {
    await authService.register(payload);
    await get().login({ email: payload.email, password: payload.password });
  },

  logout: () => {
    tokenStorage.clear();
    set({ token: null, user: null, initialized: true });
  },
}));

// Setelah logout, ProtectedRoute mengarahkan pengguna ke halaman login.
setUnauthorizedHandler(() => {
  useAuthStore.getState().logout();
});
