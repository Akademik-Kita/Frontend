# Antislop: reveal saat scroll, slideshow, dan layout dinamis

Status: PASS. Tanggal: 20 Oktober 2026, Asia/Jakarta. Mode: during, pilihan pemilik.
Arahan terbaru: tujuh slide vertikal dengan dash/morph, memakai biru tema awal.
Pembaruan: komposisi berbeda mengikuti lebar dan tinggi jendela, serta mempertahankan slide aktif ketika resize.
Klarifikasi terbaru: reveal seperti AOS ketika elemen masuk layar, memakai fade-up teks dan zoom ringan panel melalui GSAP.
Dials tetap ENERGY 3 / RHYTHM 3 / MOTION 3.

## Bukti

- PASS: [pengujian reveal](scroll-reveal-results.json): sampel frame membuktikan fade-up dan zoom terlihat setelah morph. Seluruh 30 target diperiksa pada desktop dan ponsel, total 60 pemeriksaan kemunculan, tanpa exception JavaScript.
- PASS: isi yang sudah dibaca tetap terlihat saat kembali; fokus keyboard menampilkan CTA segera. Mengaktifkan reduced motion saat halaman terbuka maupun saat reload menampilkan semua elemen tanpa transform.
- PASS: keluar halaman membersihkan elemen reveal dan mengembalikan scroll normal. Screenshot diperiksa pada [desktop](../../output/scroll-reveal-desktop.png) dan [ponsel](../../output/scroll-reveal-mobile.png).
- PASS: [18 keadaan resize, 42 pemeriksaan isi slide, dan 4 pemeriksaan perilaku](responsive-results.json), tanpa reload pada seluruh rangkaian resize.
- PASS: resize beruntun melewati tujuh lebar mempertahankan slide 4. Desktop, tablet, ponsel, dan landscape pendek memakai posisi elemen yang berbeda, diperiksa lewat geometri dan screenshot.
- PASS: rentang 320 sampai 1920 piksel dan tinggi 500 sampai 1080 piksel tanpa overflow horizontal; reduced motion, morph, roda mouse, teks 200%, CTA, dan pembersihan rute tetap bekerja setelah resize.
- PASS: build TypeScript dan Vite produksi, `npm.cmd run build`.
- PASS: [14 catatan navigasi dan 9 pemeriksaan perilaku](slides-results.json).
- PASS: [22 catatan klik tautan, 10 pemeriksaan fokus/target, dan 39 pasangan kontras](slides-links-results.json).
- PASS: gestur roda mouse 1600 piksel berhenti pada slide berikutnya, tepat di bawah header.
- PASS: sampel atribut path SVG berbeda selama morph turun; morph balik terlihat saat kembali ke slide sebelumnya. Overlay kembali tersembunyi setelah transisi.
- PASS: tujuh dash desktop memilih tujuh slide yang sesuai; aria-current dan nomor slide ikut berubah.
- PASS: PageDown berpindah satu slide; tombol sebelumnya/berikutnya bekerja dan nonaktif pada batas yang tepat.
- PASS: lebar 320, 390, 768, 1024, dan 1440 piksel; seluruh slide dapat dijangkau tanpa overflow horizontal.
- PASS: pada layar pendek 390 × 640 dan teks 200%, CTA terakhir tetap di atas kontrol dan dapat membuka register.
- PASS: reduced motion menonaktifkan morph, memakai proximity snap, dan mempertahankan kontrol langsung.
- PASS: meninggalkan homepage membersihkan snap dan kontrol; login demo dan Home siswa tetap bekerja tanpa snap yang terbawa.
- PASS: teks normal minimal 4,73:1. Target kontrol navigasi yang terlihat minimal 44 × 44 piksel dan focus ring terlihat.
- PASS: tidak ada exception JavaScript pada kedua rangkaian pengujian.

Pengujian memakai Edge headless. Interaksi touch memakai scroll native berdasarkan implementasi;
pengujian perangkat sentuh fisik tidak diklaim. Skrip pengujian tidak mengubah data backend.
Alasan teknik ada di [home-design.md](home-design.md).

Pratinjau: [pembuka desktop](../../output/responsive-desktop-1.png),
[pembuka tablet](../../output/responsive-tablet-1.png),
[profil tablet](../../output/responsive-tablet-2.png),
[landscape pendek](../../output/responsive-landscape-1.png),
[ponsel](../../output/responsive-mobile-1.png).

## Block 1: Hard Gate

| Butir | Status dan bukti |
| --- | --- |
| R-02, em dash | PASS: tidak ada em dash dalam source dan copy slideshow baru. |
| R-03, mobile | PASS: 18 keadaan resize dan 42 pemeriksaan slide tanpa overflow horizontal; layar pendek dan teks 200% tetap dapat menjangkau CTA. Tidak ada clipping untuk menyembunyikan teks. |
| R-17, angka | PASS: angka slide/bab menyatakan urutan nyata, bukan statistik pemasaran. Tidak membuat angka hasil rekomendasi pada homepage publik. |
| R-18, testimonial | PASS: tidak ada testimonial atau identitas rekaan. |
| R-23, aset | PASS: memakai wordmark produk yang sudah ada; bentuk transisi dibuat atas permintaan dash/morph pemilik. Tanpa logo, foto, atau avatar baru. |
| R-24, navigasi | PASS: seluruh 22 tautan yang tampil diklik; anchor menuju slide yang ada dan CTA menuju register/login atau fitur aplikasi. |
| R-25, kontras | PASS: 39 pasangan diaudit, teks normal minimal 4,73:1; dash dan batas kontrol memakai warna yang sudah dihitung melebihi 3:1. Kontrol disabled dikecualikan sesuai keadaan tidak aktif. |
| R-26, fungsi | PASS: sebelumnya/berikutnya, tujuh dash, menu ponsel, skip link, tautan header/footer, dan CTA diperiksa; reveal tidak membuat kontrol baru. |
| R-27, keadaan UI | PASS: homepage bersifat statis dan tidak meminta data. Keadaan loading/error/kosong Home siswa tetap memakai implementasi yang telah diuji pada home-review.md. Login demo ulang berhasil. |
| R-28, FAQ | PASS: tidak menambahkan FAQ generik. |
| R-32, keyboard | PASS: skip link, PageDown, serta fokus kontrol diuji; CTA tersembunyi oleh reveal langsung terlihat saat mendapat fokus keyboard. Menu mempertahankan Escape. |
| R-33, source | PASS: fitur ditulis langsung di TSX/CSS; skrip QA hanya membaca UI dan merekam bukti. |
| R-34, tema | PASS: tema biru terang tetap satu tema lengkap; tidak menambahkan toggle yang belum berfungsi. |
| R-35, eksekusi | PASS: build selesai; 22 tautan diperiksa ulang, 60 target reveal, 18 keadaan resize, dan 42 pemeriksaan slide lolos. Bukti 14 navigasi slide tetap tersedia. Tidak ada exception JavaScript. |
| R-36, klaim | PASS: tidak menambah klaim pelanggan, keamanan, performa, atau peluang penerimaan. |
| R-37, arah | PASS: klarifikasi reveal seperti AOS, layout dinamis, per slide, dash/morph, dan arah biru pemilik dicatat di DESIGN.md. |
| R-38, konten | PASS: isi berasal dari alur profil, nilai, minat, dan rekomendasi yang tersedia; tidak ada hasil sekolah atau data orang yang dibuat-buat. |

## Block 2: Purpose-Gate

| Butir | Status dan alasan |
| --- | --- |
| R-01, warna | PASS: biru mengikuti token tema awal; bidang biru transisi menunjukkan perpindahan lembar sesuai arahan pemilik. |
| R-04, ikon | PASS: tidak menambah ikon generik; panah naik/turun menyatakan arah navigasi slide. |
| R-06, tipografi | PASS: Plus Jakarta Sans dan penekanan Georgia tetap mengikuti alasan identitas yang sudah dicatat. |
| R-07, pola | PASS: dash adalah navigasi posisi dan tepi transisi, bukan pola latar tanpa tujuan. |
| R-08, panah | PASS: panah hanya untuk arah slide, scroll, kembali ke atas, dan jenjang pendidikan. CTA tetap berlabel tindakan. |
| R-09, badge | PASS: tidak ada badge pemasaran; nomor/label kontrol menyatakan slide yang sedang dibaca. |
| R-10, glass | PASS: tidak memakai glassmorphism atau backdrop blur. |
| R-12, shadow | PASS: bayangan hanya pada lembar pembuka, untuk memisahkan lapisan kertas. |
| R-13, glow | PASS: tidak memakai glow. |
| R-14, kartu | PASS: panel bab mengelompokkan proses yang berurutan; panel tegak berubah menjadi lembar mendatar pada tablet, dengan alasan ruang baca di home-design.md. |
| R-19, motion | PASS: morph menghubungkan slide; reveal sekali per elemen memperkenalkan isi sesuai permintaan AOS. Sampel frame membuktikan reveal terlihat setelah morph; reduced motion mematikan keduanya. |
| R-22, ilustrasi | PASS: lembar pertimbangan berhubungan dengan pekerjaan memilih sekolah; tidak menambahkan ilustrasi karakter generik. |

## Block 3: Liveliness

| Butir | Status dan bukti |
| --- | --- |
| Dials eksplisit | PASS: ENERGY 3 / RHYTHM 3 / MOTION 3 ditetapkan dan tetap dipakai. |
| Sesuai dials | PASS: judul dominan, susunan slide bervariasi, morph dua arah, dan reveal isi bertahap diuji. |
| Fokus tiap layar | PASS: pembuka mengutamakan judul; slide proses mengutamakan pertimbangannya; penutup mengutamakan tindakan membuat profil. |
| Whitespace struktural | PASS: ruang tiap slide memisahkan satu bagian; margin dan sela fluid mengikuti viewport. Min-height dapat bertambah untuk teks besar sehingga bukan pembatas isi. |
| Satu aksen | PASS: aksen hijau terbatas pada catatan dan tanda bab, di atas palet biru. |
| Motif identitas | PASS: lembar pilihan diteruskan sebagai bentuk morph; dash menyatakan perjalanan antarlembarnya. |
| Design Read | PASS: visual akademik ekspresif sebelumnya tetap dipakai; perubahan motion berasal dari permintaan pemilik dan dijelaskan sebelum implementasi. |

## Block 4: Craftsmanship dan Quality Locks

| Butir | Status dan bukti |
| --- | --- |
| C-1, alasan | PASS: alasan paging, morph, dash, ukuran layar, dan reduced motion ditulis pada home-design.md. |
| C-2, fungsi lengkap | PASS: seluruh kontrol memiliki aksi; bukti 14 navigasi slide dan 22 tautan tersedia, serta pembersihan rute berhasil. |
| C-3, isi | PASS: tujuh slide berasal dari pembuka, empat bagian proses nyata, faktor, dan penutup; tidak menambahkan bagian pengisi. |
| C-4, ketahanan | PASS: resize mempertahankan slide aktif; reveal selesai pada desktop/ponsel, fokus keyboard langsung terlihat, reduced motion dapat diubah saat berjalan, dan keluar halaman membersihkan efek. |
| C-5, bukti | PASS: tidak menambahkan statistik, ulasan, atau hasil rekomendasi rekaan. |
| R-05, struktur | PASS: tiap slide melayani isi tertentu; bukan hero dengan deretan feature card atau tiga langkah yang dipaksakan. |
| R-11, radius | PASS: kontrol tetap bersudut kecil; sudut lembar menjadi motif; tidak semua elemen pill. |
| R-15, CTA | PASS: tindakan tetap spesifik, seperti Isi profil dan preferensi, Tambahkan nilai rapor, dan Kerjakan tes minat. |
| R-16, buzzword | PASS: copy tetap menjelaskan fitur nyata tanpa jargon pemasaran AI. |
| R-20, identitas | PASS: lembar akademik dan pertimbangan memilih SMA tetap menjadi pusat tampilan. |
| R-21, tema | PASS: tema terang biru meneruskan arahan pemilik dan tema awal aplikasi. |
| R-29, palet | PASS: primary/primary-dark, biru muda, netral, dan satu aksen hijau; tidak ada warna tambahan pada transisi. |
| R-30, orisinalitas | PASS: tidak mengambil template produk lain; transisi mengikuti motif lembar AkademikKita. |
| R-31, keputusan tertulis | PASS: alasan pengelompokan reveal, waktu setelah morph, ambang viewport, fokus keyboard, komposisi responsif, dan pembersihan animasi ada di home-design.md. |

Checklist tambahan: UI PASS (motion berdasarkan tujuan, kontrol nyata), human PASS (kontras,
fokus, teks besar, tanpa form baru), layoutmobile PASS (empat komposisi, sweep lebar, tanpa clipping, target 44px, menu berlabel, feedback tap, dan ruang kontrol bawah),
copywriting PASS (copy aktual dipertahankan, CTA spesifik, tanpa klaim atau fakta baru).
