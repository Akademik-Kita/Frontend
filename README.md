# AkademikKita, Frontend 1

Cakupan: autentikasi, profil siswa, nilai, prestasi, tes minat, dan fondasi bersama
(`api.ts`, komponen umum, routing awal).

## Menjalankan

```bash
npm install
cp .env.example .env     # isi VITE_API_BASE_URL
npm run dev
npm run build            # menjalankan tsc --noEmit lalu vite build
```

## Status

Kode ini ditulis tanpa `npm install`, karena registry npm diblokir di lingkungan penulisan.
Belum pernah dijalankan, di-type-check, atau diuji ke backend. Jalankan `npm run build`
lebih dulu dan perbaiki error yang muncul. Versi paket di `package.json` perlu dicek.

## Asumsi yang perlu dicocokkan dengan backend

| Hal | Asumsi | File |
| --- | --- | --- |
| Respons `/auth/login` | `data.access_token` (atau `data.token`); `user` opsional, kalau kosong diambil dari `/auth/me` | `types/auth.ts`, `services/authService.ts` |
| Setelah register | Frontend langsung login dengan email dan password yang sama | `store/authStore.ts` |
| Nama field profil | `current_school, grade, kecamatan, latitude, longitude, max_budget_monthly, max_distance_km, school_type_preference, profile_completeness` | `types/profile.ts` |
| Nilai preferensi sekolah | `negeri`, `swasta`, `semua` | `types/profile.ts` |
| Nilai rapor | `subject_id, grade, semester, score` | `types/profile.ts` |
| Prestasi | `title, level, year`; level: `sekolah, kecamatan, kota, provinsi, nasional, internasional` | `types/profile.ts` |
| `profile_completeness` | Boleh 0–1 atau 0–100; ditampilkan apa adanya sebagai persen | `components/profile/ProfileProgress.tsx` |
| `/profile` atau tes terakhir belum ada | Backend membalas 404, dibaca sebagai "belum ada data" | `services/profileService.ts` |

Kontrak tes minat memakai persis `instrument_version: "riasec-lite-v1"` dan enam key
`realistic, investigative, artistic, social, enterprising, conventional`.

## Skoring tes minat (perlu disetujui tim)

Dua pertanyaan per dimensi: satu positif, satu negatif. Jawaban pertanyaan negatif dibalik
(`6 - jawaban`). Skor dimensi = `((rata-rata - 1) / 4) × 100`, dibulatkan. Pemetaan lengkap ada di
`src/config/interestInstrument.ts`.

## Token login

Disimpan di `localStorage` lewat `services/tokenStorage.ts`. Praktis, tetapi terbaca skrip jika ada
celah XSS. Kalau tim memilih HttpOnly cookie, ubah `tokenStorage.ts`, `api.ts`, dan `authStore.ts`.

## File di luar daftar brief

`services/tokenStorage.ts`, `config/interestInstrument.ts`, `utils/cx.ts`, `utils/errors.ts`,
`components/common/{AppLayout,AuthLayout,ProtectedRoute,ConfirmDelete}.tsx`.

## Routing

Tiga route milik Frontend 2 (`/recommendations`, `/schools/:id`, `/compare`) memakai placeholder di
`App.tsx` sampai PR Frontend 2 masuk.

## Git

Branch `feature/profile-assessment`, PR ke `dev-frontend`.
