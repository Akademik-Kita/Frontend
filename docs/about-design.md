# About Us: empat anggota AkademikKita

Arahan pemilik: halaman About Us dengan empat slot foto profil tim.
Design Read: halaman tim untuk pengunjung AkademikKita, memakai bahasa visual lembar akademik biru yang sudah dipilih.
Dials: ENERGY 3 / RHYTHM 2 / MOTION 2.

- Judul besar meneruskan suara homepage. Potret tim menjadi isi utama, dengan satu pengantar singkat tentang produk yang memang tersedia.
- Empat figure sejajar mewakili empat anggota yang disebut pemilik. Ukuran portrait sama agar tiap orang mendapat ruang setara, bukan deretan fitur pemasaran.
- Desktop mulai 1200 piksel memakai empat kolom, tablet mulai 640 piksel dua kolom, ponsel satu kolom. Minmax dan margin fluid menjaga ruang antarpotret ketika resize.
- Sesuai permintaan terbaru, area tim dibatasi 1040 piksel dan dipusatkan. Foto desktop menjadi sekitar 242 × 303 piksel; tablet dibatasi 240 piksel dan ponsel 260 piksel lebarnya agar foto tidak mendominasi layar.
- Sela antarprofil menjadi 24 piksel; padding placeholder 18 piksel, angka maksimal 5rem, dan caption lebih rapat. Rasio 4:5 serta ruang baca teks tetap dipertahankan.
- Rasio 4:5 menyediakan tempat foto portrait dan menjaga layout saat gambar dimuat. Object-fit cover serta photoPosition memungkinkan pemilik menyesuaikan potongan wajah.
- Clip hanya untuk crop foto dan sudut bingkai. Teks placeholder tetap dapat tumbuh; teks 200% diperiksa tanpa clipping.
- Sudut lembar menghubungkan potret dengan motif dokumen homepage. Tidak menambah shadow, glow, gradient, atau ikon generik.
- Primary, primary-dark, tint, ink, dan muted meneruskan token tema biru. Dua warna permukaan placeholder membedakan slot sementara foto belum tersedia.
- Plus Jakarta Sans tetap menjadi font aplikasi; Georgia italic meneruskan penekanan editorial pada nama produk.
- Angka 01 sampai 04 adalah urutan slot nyata. Nama, peran, dan foto sengaja kosong dalam konfigurasi karena pemilik belum memberikan identitas tim.
- Placeholder diberi keterangan Foto anggota dan Slot foto profil. Tidak memakai wajah stok, avatar rekaan, jabatan, atau biografi yang belum diberikan.
- Satu file src/config/team.ts menyimpan empat profil. Foto lokal ditempatkan di public/team. Ini adalah pengisian konten proyek, bukan upload publik atau penyimpanan per browser.
- Keadaan gambar meliputi kosong, sedang dimuat, berhasil, dan gagal. Gagal memuat mengembalikan keterangan yang jelas, tanpa ikon gambar rusak; alt memakai nama asli jika tersedia.
- GSAP memberi judul dan potret gerak masuk singkat, tanpa opacity nol atau loop. Gerak memperkenalkan empat profil; reduced motion menghapus tween dan transisi.
- About Us adalah route publik /about dengan navigasi Beranda dan About us. Homepage dan navigasi siswa mendapat tautan ke route nyata ini. Pengunjung yang login tetap dapat kembali lewat Home saya.
- Tidak menambah FAQ, statistik pemasaran, ulasan, kontak, tautan sosial, atau identitas yang belum diberikan.

Petunjuk pengisian: [public/team/README.md](../public/team/README.md).
Pengujian: [about-review.md](about-review.md).
