# Antislop: panel Home mengikuti scroll

Status: PASS. Mode: during. Tanggal: 20 Oktober 2026, Asia/Jakarta.
Ruang lingkup: panel Lembar pilihanmu dan empat bab Home setelah login.
Design Read tetap visual akademik ekspresif untuk siswa dan orang tua; ENERGY 3 / RHYTHM 3 / MOTION 3.
Arahan ada di DESIGN.md; alasan sticky, ukuran panel, offset, dan fallback ada di [home-design.md](home-design.md).

## Bukti pengujian

- Build TypeScript dan Vite produksi berhasil: `npm.cmd run build`.
- [Hasil browser](journey-follow-results.json): enam ukuran, 24 posisi bab, sembilan klik tautan bab, lima pemeriksaan perilaku, tanpa exception JavaScript.
- Ukuran yang diperiksa: 1440 × 1000, 1200 × 650, 1024 × 500, 820 × 900, 390 × 844, 320 × 640. Resize dilakukan dalam halaman yang sama.
- Panel tetap terlihat pada empat bab, termasuk bab terakhir, lalu keluar sebelum hasil rekomendasi. Nomor/aria-current mengikuti bab aktif.
- Scroll mouse naik dan turun mempertahankan posisi panel. Empat tautan bab diuji pada desktop dan ponsel; keyboard Enter bekerja dengan fokus terlihat.
- Reduced motion tetap memakai sticky tanpa tween. Pada teks 200%, panel yang terlalu tinggi kembali ke alur normal; semua tautannya dapat dijangkau tanpa overflow horizontal.
- Keluar ke Profil membersihkan komponen dan tidak menyisakan pin spacer. Login memakai akun demo yang tersedia, tanpa mengubah profil atau hasil rekomendasi.
- Pratinjau diperiksa: [desktop](../../output/journey-follow-1440.png), [desktop pendek](../../output/journey-follow-1024.png), [ponsel](../../output/journey-follow-390.png).

Pengujian memakai Edge headless; perangkat sentuh fisik tidak diklaim diuji.
Bagian aplikasi di luar panel meneruskan [pemeriksaan sebelumnya](home-review.md).

## Block 1: Hard Gate

| Butir | Status dan bukti |
| --- | --- |
| R-02 | PASS: source panel dan copy tidak menambahkan em dash. |
| R-03 | PASS: 24 posisi bab pada enam ukuran tanpa overflow; panel tidak menutupi heading ponsel; teks 200% dapat dibaca. |
| R-17 | PASS: 01 sampai 04 adalah urutan empat bab nyata, tanpa statistik baru. |
| R-18 | PASS: tidak menambahkan testimonial atau identitas rekaan. |
| R-23 | PASS: panel yang diminta pemilik dipertahankan, tanpa aset atau struktur navigasi baru. |
| R-24 | PASS: semua anchor panel menuju empat ID artikel yang diuji. |
| R-25 | PASS: warna tetap white pada primary #4569e8, 4,73:1; teks aktif primary-dark pada page, 5,90:1. Ukuran teks ringkas tetap memenuhi ambang normal 4,5:1. |
| R-26 | PASS: sembilan klik anchor dan Enter memilih bab; penanda aktif diperiksa pada 24 posisi. |
| R-27 | PASS: data panel tetap memakai overview yang sudah memiliki loading/error/empty; tidak ada permintaan data baru. |
| R-28 | PASS: tidak menambahkan FAQ. |
| R-32 | PASS: Tab memberi fokus terlihat, Enter memilih bab; semua kontrol tetap anchor semantik. |
| R-33 | PASS: TSX dan CSS diedit langsung dengan apply_patch; skrip QA hanya mengoperasikan UI dan menyimpan bukti. |
| R-34 | PASS: tema biru terang tetap satu tema lengkap tanpa toggle baru. |
| R-35 | PASS: build produksi dan pengujian browser dijalankan; seluruh empat kontrol panel diklik pada desktop dan ponsel. |
| R-36 | PASS: tidak menambahkan klaim keamanan, pelanggan, performa, atau penerimaan. |
| R-37 | PASS: permintaan panel mengikuti scroll dicatat di DESIGN.md, meneruskan arah biru pemilik. |
| R-38 | PASS: isi bab berasal dari data akun dan fitur aplikasi yang sudah ada. |

## Block 2: Purpose-Gate

| Butir | Status dan bukti |
| --- | --- |
| R-01 | PASS: biru mengikuti token aplikasi; tidak menambahkan gradient. |
| R-04 | PASS: tidak menambahkan ikon. |
| R-06 | PASS: font produk tetap Plus Jakarta Sans; angka besar menyatakan bab aktif. |
| R-07 | PASS: garis progres menyatakan perjalanan empat bab, tanpa pola latar baru. |
| R-08 | PASS: tidak menambahkan panah dekoratif. |
| R-09 | PASS: tidak menambahkan badge pemasaran. |
| R-10 | PASS: tidak memakai glassmorphism. |
| R-12 | PASS: panel tetap tanpa shadow. |
| R-13 | PASS: tidak memakai glow. |
| R-14 | PASS: satu panel konteks mengikuti empat bab, dengan ukuran penuh atau ringkas berdasarkan ruang baca. |
| R-19 | PASS: sticky mempertahankan konteks tanpa tween; GSAP hanya memperbarui konteks bab, reveal, dan progres; reduced motion mematikan tween. |
| R-22 | PASS: panel memakai motif lembar akademik yang sudah dipilih; tidak ada ilustrasi baru. |

## Block 3: Liveliness

| Butir | Status dan bukti |
| --- | --- |
| Dials eksplisit | PASS: ENERGY 3 / RHYTHM 3 / MOTION 3 meneruskan DESIGN.md. |
| Konsistensi dials | PASS: angka dominan pada desktop, komposisi ringkas pada ponsel, dan progres mengikuti scroll. |
| Fokus | PASS: judul bab menjadi konteks; judul isi tetap terlihat di samping atau di bawah panel. |
| Whitespace | PASS: tinggi bab menampung panel dan memberi ruang baca sampai bab terakhir. |
| Aksen | PASS: hijau tetap terbatas pada titik nomor dan progres. |
| Motif | PASS: lembar pilihan tetap menjadi identitas panel. |
| Design Read | PASS: arah akademik ekspresif yang sudah dinyatakan tetap dipakai; implementasi sticky dijelaskan sebelum perubahan. |

## Block 4: Craftsmanship dan Quality Locks

| Butir | Status dan bukti |
| --- | --- |
| C-1 | PASS: alasan sticky, panel ringkas, fallback, tinggi bab, dan offset ditulis di home-design.md. |
| C-2 | PASS: empat anchor bekerja dan penanda aktif mengikuti isi. |
| C-3 | PASS: tidak menambahkan bagian pengisi; panel melayani empat bab yang sudah ada. |
| C-4 | PASS: resize, scroll dua arah, teks besar, reduced motion, keyboard, dan batas akhir bagian diuji. |
| C-5 | PASS: tidak menambahkan data atau klaim rekaan. |
| R-05 | PASS: perubahan pada satu panel konteks yang diminta, tanpa susunan template baru. |
| R-11 | PASS: radius kecil pada tombol dan sudut lembar tetap dipakai, tanpa pill baru. |
| R-15 | PASS: label CTA bab tetap berupa tindakan fitur spesifik. |
| R-16 | PASS: tidak menambahkan buzzword pemasaran. |
| R-20 | PASS: panel menghubungkan profil, nilai, minat, dan rekomendasi SMA. |
| R-21 | PASS: tema terang biru tetap mengikuti arahan pemilik. |
| R-29 | PASS: palet tetap biru, netral, dan satu aksen hijau. |
| R-30 | PASS: meneruskan motif produk yang sudah ada, tanpa mengambil template baru. |
| R-31 | PASS: seluruh keputusan layout dan perilaku baru memiliki alasan tertulis. |

Checklist tambahan: UI PASS (konteks bab nyata), human PASS (kontras, keyboard, teks besar,
reduced motion), layoutmobile PASS (panel ringkas, ukuran antara diuji, target 44px dengan gap,
feedback tap, tanpa clipping, budget ruang baca), copywriting PASS (isi dan CTA dipertahankan).
