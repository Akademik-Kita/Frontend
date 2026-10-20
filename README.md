# AkademikKita Frontend

## About Us dan empat profil tim

Halaman `/about` dapat dibuka tanpa login. Tautan About us tersedia di navigasi homepage
dan aplikasi. Ada empat slot foto, nama, dan peran; nilai kosong ditampilkan sebagai placeholder.

1. Letakkan foto di `public/team/`, misalnya `anggota-01.jpg` sampai `anggota-04.jpg`.
2. Isi `name`, `role`, dan `photo` setiap anggota di `src/config/team.ts`.
3. Gunakan path seperti `photo: '/team/anggota-01.jpg'`; sesuaikan `photoPosition` jika posisi wajah perlu digeser.

Foto tampil dengan rasio 4:5. PNG, JPG, dan WebP dapat dipakai. Petunjuk lengkap ada di
`public/team/README.md`. Pengisian dilakukan melalui file proyek; halaman publik tidak mempunyai form upload.

## Homepage dengan GSAP

Halaman publik tersedia di `/`, tanpa perlu login atau backend untuk melihat homepage.
Desain memakai biru tema awal aplikasi, dengan komposisi lebih berani dan motif lembar pilihan.
Homepage publik memakai tujuh slide vertikal dengan scroll snap. Satu gestur roda mouse
berpindah satu slide; layar sentuh tetap memakai scroll native. Tombol naik/turun,
PageDown/PageUp, dan dash navigasi desktop tersedia untuk berpindah bagian.
GSAP membuat transisi lembar SVG dengan kurva morph dan garis putus-putus selama 0,6 detik.
Judul, penjelasan, faktor, dan CTA muncul dengan efek reveal saat masuk layar seperti AOS,
menggunakan GSAP yang sudah ada. Teks memakai fade-up; panel bab memakai zoom ringan.
Efek berjalan sekali per elemen dan menunggu transisi slide agar tetap terlihat.
Reduced motion menonaktifkan morph dan memakai perpindahan langsung dengan proximity snap.
Reveal juga dinonaktifkan pada reduced motion; elemen yang mendapat fokus keyboard langsung ditampilkan.
Hook `useGSAP` membersihkan animasi, scroll snap, dan event handler saat halaman ditinggalkan.
Pada layar pendek atau ukuran teks besar, isi slide tetap dapat dibaca sampai bawah.
Layout berubah mengikuti lebar dan tinggi jendela: desktop berdampingan, tablet dengan
panel bab mendatar, ponsel bertumpuk, dan landscape pendek lebih ringkas. Resize tanpa
reload mempertahankan slide yang sedang dibaca dan menghitung ulang posisi scroll GSAP.

Home setelah login tersedia di `/home` dan mengambil profil, nilai, tes minat, serta
rekomendasi terakhir dari backend. Login dan daftar mengarah ke `/home` secara default;
login dari halaman terproteksi tetap kembali ke tujuan awal. Menu Home tersedia di navigasi.
Tautan `/profile?section=nilai` membuka tab nilai rapor secara langsung.
Panel Lembar pilihanmu mengikuti scroll sepanjang empat bab di Home. Nomor, judul,
kata kunci, dan tombol aktif mengikuti bagian yang dibaca. Panel menjadi ringkas pada
layar kecil dan kembali ke alur normal jika tingginya tidak muat, termasuk saat teks diperbesar.

Jalankan dari PowerShell:

```powershell
cd "C:\Users\Haikal\Documents\Akademik Kita\akademikkita-frontend"
npm.cmd install
npm.cmd run dev -- --port 5173 --strictPort
```

Buka <http://localhost:5173/>. Untuk mencoba login dan fitur aplikasi dengan backend demo
pada port 8001, isi `.env.local` dengan `VITE_API_BASE_URL=http://localhost:8001/api`.
Untuk backend utama pada port 8000, gunakan `VITE_API_BASE_URL=http://localhost:8000/api`.
Jalankan ulang server frontend setelah mengubah konfigurasi environment.

Homepage publik menjelaskan alur aplikasi tanpa sekolah atau skor rekaan. Home setelah
login menampilkan data akun, termasuk loading, retry saat error, dan keadaan belum ada data.
Arahan desain ada di `DESIGN.md`; alasan teknik di `docs/home-design.md`.

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

Build produksi (`npm run build`) telah berhasil setelah integrasi homepage GSAP.
Integrasi seluruh fitur dengan backend perlu diuji dengan backend yang berjalan.

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


## Frontend 2 — rekomendasi dan sekolah

Implementasi Frontend 2 berada di branch `feature/recommendation-ui` dan menggunakan
komponen bersama, Axios client, serta auth store yang sudah ada. Halaman yang ditambahkan:
`/recommendations`, `/schools/:id`, dan `/compare`.

### Catatan integrasi backend
- Service memakai endpoint yang tercantum pada `AkademikKita_Brief_Frontend.pdf`.
- Brief belum menetapkan bentuk body untuk `POST /recommendations/generate`; implementasi mengirim
  `{ "weights": { "academic": 0.2, "interest": 0.2, "chance": 0.2, "distance": 0.2, "cost": 0.2 } }`.
  Cocokkan bentuk ini dengan backend sebelum integrasi.
- Service sekolah menormalkan respons daftar yang berupa array atau objek berisi `items`/`data`.
  Pastikan bentuk response aktual backend sesuai.
- Frontend 2 memakai asumsi field sekolah yang didefinisikan di `src/types/school.ts`. Cocokkan dengan
  schema backend; field yang belum tersedia ditampilkan sebagai “Belum tersedia”.
- Halaman rekomendasi memeriksa profil (`profile_completeness` harus 100), minimal satu nilai akademik,
  dan hasil tes minat terbaru sebelum memanggil endpoint rekomendasi.
- API belum diverifikasi secara live karena diperlukan backend yang berjalan dan kredensial pengujian.
