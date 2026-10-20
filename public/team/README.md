# Foto tim About Us

Letakkan empat foto profil di folder ini. Contoh nama:

- `anggota-01.jpg`
- `anggota-02.jpg`
- `anggota-03.jpg`
- `anggota-04.jpg`

Lalu isi `src/config/team.ts` untuk setiap anggota:

```ts
{
  id: 'anggota-01',
  name: 'Nama asli anggota',
  role: 'Peran anggota',
  photo: '/team/anggota-01.jpg',
  photoPosition: 'center',
}
```

Gunakan foto portrait, idealnya rasio 4:5. Foto dipotong dengan `object-fit: cover`.
Atur `photoPosition`, misalnya `'center 30%'`, jika posisi wajah perlu disesuaikan.
JPG, PNG, atau WebP bisa dipakai; samakan ekstensi file dengan nilai `photo`.

Nilai kosong menampilkan slot yang jelas, tanpa foto atau identitas rekaan.
Halaman tersedia di `/about`, termasuk sebelum login. Perubahan konfigurasi dan file
akan ikut terlihat oleh semua pengunjung setelah aplikasi dibuild dan dipublikasikan.
