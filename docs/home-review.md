# Pemeriksaan antislop: homepage dan Home siswa

Pemeriksaan terbaru untuk homepage per slide dengan dash/morph ada di [slideshow-review.md](slideshow-review.md).
Pemeriksaan terbaru panel Home yang mengikuti scroll ada di [journey-follow-review.md](journey-follow-review.md).
Laporan ini menyimpan bukti alur aplikasi dan palet sebelum perubahan slideshow tersebut.

Status: PASS. Tanggal pemeriksaan: 20 Oktober 2026, Asia/Jakarta.

Ruang lingkup: `/`, `/home`, navigasi bersama, tujuan login/daftar, dan tautan tab nilai.
Mode antislop: during, pilihan pemilik pada sesi ini.
Arahan pemilik terbaru: gunakan biru tema awal aplikasi, dengan komposisi berani yang tetap sama.
Design Read dan alasan teknik: [home-design.md](home-design.md).
Dials: ENERGY 3 / RHYTHM 3 / MOTION 3.

Pemeriksaan memakai Edge headless dengan backend demo lokal. Data keadaan kosong dan
error disimulasikan pada respons browser, tanpa mengubah database atau membuat akun.
Pembesaran yang diuji adalah ukuran teks 200%, bukan pengujian perangkat fisik.
Pemeriksaan interaksi di bawah berasal dari implementasi layout yang tetap dipakai.
Setelah penggantian warna, homepage publik dan Home siswa diperiksa lagi pada 390 dan
1440 piksel: login, menu ponsel, pin GSAP, palet, kontras, dan overflow semuanya lulus.

## Bukti eksekusi

- PASS: `npm.cmd run build` menyelesaikan TypeScript dan build Vite produksi.
- PASS: [56 catatan klik dan 21 pemeriksaan](home-check-results.json), termasuk tujuan setiap kontrol.
- PASS: [84 kontrol melalui Tab dan pemeriksaan fokus](home-focus-results.json), pada homepage publik dan Home siswa, desktop dan ponsel.
- PASS: [audit palet biru terbaru](blue-palette-results.json) memeriksa 50 pasangan teks/latar memakai formula WCAG; rasio teks normal terendah 4,73:1, di atas ambang 4,5:1.
- PASS: perhitungan WCAG untuk palet terbaru: batas tombol 3,65:1, batas navigasi bab 3,21:1, dan teks putih di biru 4,73:1.
- PASS: indikator progres #d9ecab terhadap primary-dark #3556cc mempunyai rasio 4,93:1. Token biru utama dan permukaan diverifikasi dalam browser.
- PASS: lebar 320, 390, 768, 1024, dan 1440 piksel tanpa overflow horizontal pada kedua halaman.
- PASS: kedua halaman tetap tanpa overflow pada lebar 390 piksel dengan ukuran teks 200%.
- PASS: login demo membuka `/home`; login dari `/compare` tetap kembali ke `/compare`.
- PASS: daftar sukses memakai fixture registrasi dan login demo asli, lalu membuka `/home`; tidak membuat akun baru.
- PASS: dari CTA bawah ke daftar dan dari bab nilai ke profil, pathname baru kembali ke atas; anchor dalam halaman tetap melakukan scroll lokal.
- PASS: reduced motion menghapus pin dan transform pembuka; penanda tahap tetap memberikan konteks tanpa tween.
- PASS: perpindahan Home siswa ke homepage publik menghasilkan satu pin; meninggalkan homepage menghapus pin spacer.
- PASS: tidak ada exception JavaScript pada pengujian utama, fokus, atau perpindahan rute. Respons 404/503 yang disimulasikan ditangani sebagai keadaan UI.

Pratinjau lokal: [publik desktop](../../output/blue-public-1440.png),
[publik ponsel](../../output/blue-public-390.png),
[Home desktop](../../output/blue-member-1440.png),
[Home ponsel](../../output/blue-member-390.png).

## Block 1: Hard Gate

| Butir | Status dan bukti |
| --- | --- |
| R-02, em dash | PASS: pemindaian source UI baru tidak menemukan karakter em dash. |
| R-03, mobile | PASS: lima lebar layar dan pembesaran teks 200% diperiksa; tidak ada overflow atau konten yang sengaja disembunyikan dengan clipping. |
| R-17, angka | PASS: persentase profil, jumlah catatan, ranking, dan skor berasal dari API; angka bab adalah urutan dokumen. Tidak ada metrik pemasaran. |
| R-18, testimonial | PASS: tidak ada testimonial, identitas, atau foto orang rekaan. |
| R-23, aset | PASS: memakai nama produk yang sudah ada sebagai wordmark; tanpa logo/foto baru. Home adalah halaman yang diminta pemilik, tujuan lain berasal dari rute aplikasi yang tersedia. |
| R-24, navigasi | PASS: tautan yang dirender diklik satu per satu; daftar tujuannya tercatat pada bukti klik. |
| R-25, kontras | PASS: 50 pasangan teks diaudit; teks normal minimal 4,73:1, batas kontrol di atas 3:1, indikator progres 4,93:1. |
| R-26, fungsi kontrol | PASS: tautan, Menu/Tutup, Escape, logout, validasi form, dan retry menjalankan perilaku yang diuji. |
| R-27, keadaan data | PASS: loading dengan request ditahan, error 503 dan retry, data kosong 404, serta data demo berhasil dirender. |
| R-28, FAQ | PASS: tidak membuat FAQ yang pertanyaannya tidak berasal dari pengguna. |
| R-32, keyboard | PASS: 84 kontrol dilalui sesuai urutan DOM dengan focus ring; Escape menutup menu dan mengembalikan fokus. Skip link diaktifkan dengan Enter. |
| R-33, source | PASS: fitur ditulis langsung di TSX/CSS. Skrip QA hanya menguji aplikasi dan mencatat bukti; tidak menulis ulang source UI. |
| R-34, tema | PASS: satu tema terang yang mengikuti arah pemilik dan motif lembar akademik; tidak ada toggle dengan mode yang belum dibuat. |
| R-35, verifikasi | PASS: build produksi berhasil, 56 klik tercatat per kontrol, fokus dan rute diperiksa, tidak ada exception JavaScript. |
| R-36, klaim | PASS: copy menjelaskan fitur yang tersedia; tidak membuat klaim keamanan, pelanggan, atau peningkatan kinerja. |
| R-37, arah desain | PASS: pilihan terbaru biru tema awal dicatat di DESIGN.md; komposisi dan Design Read tetap. |
| R-38, konten | PASS: publik berisi penjelasan produk, bukan hasil rekaan. Home memakai data akun; hasil demo sintetis diberi catatan berdasarkan penjelasan backend. |

## Block 2: Purpose-Gate

| Butir | Status dan alasan |
| --- | --- |
| R-01, warna | PASS: biru memakai token tema awal sesuai arahan pemilik; biru muda membedakan lembar dari halaman. Tanpa gradient atau glow. |
| R-04, ikon | PASS: tanpa set ikon generik, sparkle, atau emoji dekoratif. Panah memiliki fungsi arah yang dijelaskan pada R-08. |
| R-06, tipografi | PASS: Plus Jakarta Sans meneruskan aplikasi; Georgia italic memberi penekanan editorial pada kata tentang siswa. Tidak ada label uppercase dengan tracking ekstrem. |
| R-07, pola latar | PASS: tanpa grid/dot/blueprint berulang; garis pada lembar memisahkan pertimbangan yang diberi label. |
| R-08, panah | PASS: hanya penunjuk scroll, kembali ke atas, dan arah SMP/MTs ke SMA; CTA utama memakai label tindakan. |
| R-09, badge | PASS: label status berasal dari profil/nilai/tes/hasil aktual, berbentuk label persegi kecil tanpa glow atau dot. |
| R-10, glass | PASS: tidak memakai blur atau glassmorphism. |
| R-12, shadow | PASS: hanya lembar pembuka memiliki bayangan offset untuk membedakan lapisan kertas; komponen lain tetap datar. |
| R-13, glow | PASS: tidak memakai glow. |
| R-14, kartu | PASS: fitur tidak dipaksakan ke kartu identik. Bab memakai pola editorial untuk urutan proses; faktor memakai definisi; hasil memakai daftar ranking. |
| R-19, animasi | PASS: pin mempertahankan konteks bab, progres mengikuti scroll, parallax menghubungkan pembuka dan proses. Tidak ada repeat tanpa akhir; reduced motion diuji. |
| R-22, ilustrasi | PASS: lembar berisi pertimbangan memilih sekolah yang benar-benar dipakai aplikasi, tanpa karakter/grafik generik atau screenshot produk palsu. |

## Block 3: Liveliness

| Butir | Status dan bukti |
| --- | --- |
| Dials eksplisit | PASS: ENERGY 3 / RHYTHM 3 / MOTION 3, dicatat sebelum generasi dan dalam DESIGN.md. |
| Konsisten dengan dials | PASS: judul besar, komposisi asimetris, perubahan susunan antarbagian, serta pin/progres/parallax terlihat pada pratinjau dan diuji dalam browser. |
| Fokus tiap layar | PASS: judul pembuka dominan; panel perjalanan menandai bab yang dibaca; bagian hasil mengutamakan nama sekolah dan skor aktual. |
| Whitespace struktural | PASS: jarak pembuka, bab, daftar faktor, dan penutup berbeda untuk mengatur ritme; skala ponsel dipadatkan. |
| Satu aksen | PASS: hijau hanya menandai catatan pilihan dan progres di atas palet biru. |
| Motif identitas | PASS: lembar pilihan dan penomoran catatan berulang pada publik dan Home siswa, sesuai pekerjaan memilih sekolah. |
| Design Read | PASS: diumumkan sebelum perubahan visual, berdasarkan pilihan arah pemilik. |

## Block 4: Craftsmanship dan Quality Locks

| Butir | Status dan bukti |
| --- | --- |
| C-1, intentionality | PASS: alasan warna, komposisi, tipografi, jarak, lembar, radius, shadow, dan motion tertulis pada home-design.md. |
| C-2, fungsi lengkap | PASS: setiap kontrol baru mempunyai tujuan nyata; 56 catatan klik dan pengujian retry/menu/logout membuktikan perilakunya. |
| C-3, komposisi mengikuti isi | PASS: empat bab mengikuti profil, nilai, tes, dan rekomendasi; tidak menambahkan pricing, logo bar, atau feed aktivitas pengisi. |
| C-4, resilience | PASS: data kosong/loading/error, lima lebar layar, keyboard, pembesaran teks, reduced motion, dan pergantian rute diuji. |
| C-5, bukti | PASS: angka akun berasal dari API; tidak ada testimonial atau klaim rekaan. |
| R-05, ritme | PASS: pembuka asimetris, proses vertikal, daftar definisi, penutup editorial, dan daftar sekolah mempunyai susunan berbeda. Tidak memakai hero plus kartu fitur seragam. |
| R-11, radius | PASS: kontrol memakai radius kecil; sudut lembar lebih besar sebagai motif. Tidak semua elemen berbentuk pill. |
| R-15, CTA | PASS: label spesifik, misalnya Buat akun siswa, Buka nilai rapor, Kerjakan tes minat, dan Muat ulang data. |
| R-16, buzzword | PASS: copy menyebut input, proses, dan hasil nyata; tanpa klaim AI Powered, revolutionary, atau sejenisnya. |
| R-20, identitas | PASS: lembar pertimbangan dan data persiapan SMA menjadi pusat komposisi, bukan shell dashboard generik dengan metrik pengisi. |
| R-21, tema | PASS: tema terang mengikuti arah pemilik dan motif dokumen akademik; alasan ditulis sebelum finalisasi. |
| R-29, palet | PASS: biru primary/primary-dark, biru muda sebagai permukaan, netral tema awal, serta satu aksen hijau. |
| R-30, orisinalitas | PASS: tidak meniru layout produk populer; pratinjau mengikuti motif dan alur AkademikKita. |
| R-31, alasan keputusan | PASS: keputusan utama mempunyai alasan tertulis pada home-design.md, termasuk konteks animasi dan navigasi. |

## Checklist tambahan skill

| Skill | Status dan bukti |
| --- | --- |
| antislop-ui | PASS: komposisi mengikuti dials, tidak ada ikon/glow/loop generik, semua kontrol menuju fitur yang ada, data dan status berasal dari API. |
| antislop-human | PASS: kontras dihitung, batas kontrol diverifikasi, 84 kontrol punya fokus terlihat, menu mendukung Escape, keadaan data diumumkan, ukuran teks 200% tidak overflow. Tidak ada form baru atau modal dengan kebutuhan keyboard khusus. |
| antislop-layoutmobile | PASS: ponsel vertikal, tablet dua kolom isi, desktop panel besar; target kontrol baru minimal 44 piksel, menu berlabel, tanpa bar fixed yang menutup isi. |
| antislop-copywriting | PASS: CTA spesifik, tanpa em dash, emoji, klaim/testimonial rekaan, atau jargon pemasaran. Copy menyebut tindakan siswa dan fitur aktual. |

Catatan audit copy: pola lama berupa slogan beruntun dan dekorasi melayang telah diganti
dengan pertimbangan konkret memilih SMA. Tidak ada fakta pemasaran tambahan yang diciptakan.
