# Alasan rekomendasi: perbaikan teks keluar kotak

Status: PASS. Mode Antislop: during. Ruang lingkup: pembungkusan teks dan kolom alasan rekomendasi.
Design Read: perbaikan keterbacaan panel yang sudah ada, mempertahankan warna dan tipografi aplikasi.
Dials perbaikan: ENERGY 1 / RHYTHM 1 / MOTION 1, tanpa efek atau komponen visual baru.

## Alasan dan bukti

Masalah berasal dari `sm:grid-cols-2`: lebar viewport mengaktifkan dua kolom meskipun
panel berada dalam setengah kartu yang sempit. Teks nominal biaya bisa melampaui kolom.

Grid sekarang memakai auto-fit dengan batas kolom 15rem, dibatasi 100% ruang yang tersedia.
Kolom dihitung dari lebar panel, bukan viewport. Overflow-wrap anywhere membungkus token
panjang; min-width 0 memungkinkan elemen grid menyusut. Panel mengikuti tinggi isinya dan
align-items start menghindari kotak pendek diregangkan sepanjang penjelasan yang lebih panjang.
Kartu tidak lagi memakai overflow-hidden untuk menutupi isi.

- Build TypeScript dan Vite produksi berhasil: `npm.cmd run build`.
- [Hasil browser](recommendation-layout-results.json): delapan viewport 320 sampai 1440 piksel, tiga lebar panel 190/260/520 piksel, teks 200%, tanpa exception JavaScript.
- Kotak 190 dan 260 piksel memakai satu kolom; 520 piksel memakai dua kolom. Range teks diperiksa agar tidak melewati batas kotak, termasuk nominal biaya dan string panjang tanpa spasi.
- Keadaan string tunggal, satu sisi kosong, dan seluruh alasan kosong tetap terbaca.
- Memilih/membatalkan perbandingan dan tautan detail kartu tetap bekerja.
- Screenshot diperiksa: [1440 piksel](../../output/explanation-1440.png), [390 piksel](../../output/explanation-390.png).

Pengujian memakai Edge headless dan respons API fixture yang hanya berada dalam browser
pengujian, tanpa mengubah data backend. Pengujian perangkat sentuh fisik tidak diklaim.

## Block 1: Hard Gate

| Butir | Status dan bukti |
| --- | --- |
| R-02 | PASS: tidak menambahkan em dash atau copy produk baru. |
| R-03 | PASS: delapan viewport dan tiga lebar panel tanpa teks keluar kotak atau overflow horizontal. |
| R-17 | PASS: tidak menambahkan statistik. |
| R-18 | PASS: tidak menambahkan testimonial. |
| R-23 | PASS: tidak menambahkan aset atau navigasi. |
| R-24 | PASS: link detail tetap menuju route sekolah dan diperiksa lewat klik. |
| R-25 | PASS: warna ink/muted pada softgreen/softyellow tetap; hasil perhitungan kontras seluruh pasangan di atas 4,5:1. |
| R-26 | PASS: tombol perbandingan dapat dipilih/dibatalkan; navigasi detail diperiksa. |
| R-27 | PASS: string tunggal, sisi kosong, dan alasan kosong diperiksa; loading/error halaman tidak diubah. |
| R-28 | PASS: tidak menambah FAQ. |
| R-32 | PASS: elemen tombol/anchor dan focus ring dipertahankan; tidak ada kontrol atau penghalang keyboard baru. |
| R-33 | PASS: CSS dan TSX ditulis langsung dengan apply_patch; skrip hanya menguji UI. |
| R-34 | PASS: tidak mengubah tema atau menambah toggle. |
| R-35 | PASS: build, geometri teks, screenshot, klik perbandingan, dan klik detail selesai tanpa exception. |
| R-36 | PASS: tidak menambahkan klaim produk. |
| R-37 | PASS: perubahan mengikuti permintaan pemilik agar teks tetap di dalam kotak. |
| R-38 | PASS: isi tetap berasal dari explanation; fixture browser tidak disimpan sebagai data produk. |

## Block 2: Purpose-Gate

| Butir | Status dan bukti |
| --- | --- |
| R-01 | PASS: warna panel yang ada dipertahankan untuk membedakan dua jenis alasan. |
| R-04 | PASS: tidak menambah ikon. |
| R-06 | PASS: font dan hierarki teks yang ada dipertahankan untuk keterbacaan. |
| R-07 | PASS: tidak menambah pola latar. |
| R-08 | PASS: tidak menambah panah. |
| R-09 | PASS: tidak menambah badge. |
| R-10 | PASS: tidak menambah glassmorphism. |
| R-12 | PASS: tidak menambah shadow. |
| R-13 | PASS: tidak menambah glow. |
| R-14 | PASS: dua panel tetap mengelompokkan alasan mendukung dan pertimbangan; tinggi mengikuti isinya. |
| R-19 | PASS: tidak menambah motion atau transisi. |
| R-22 | PASS: tidak menambah ilustrasi. |

## Block 3: Liveliness

| Butir | Status dan bukti |
| --- | --- |
| Dials eksplisit | PASS: ENERGY 1 / RHYTHM 1 / MOTION 1 untuk koreksi keterbacaan ini. |
| Konsistensi | PASS: komposisi tenang, dua kelompok informasi, tanpa animasi baru. |
| Fokus | PASS: heading membedakan alasan mendukung dan pertimbangan. |
| Whitespace | PASS: gap 12 piksel dan padding yang ada memisahkan teks; tinggi kotak mengikuti isi. |
| Aksen | PASS: aksen produk yang ada dipertahankan; warna status panel tidak ditambah. |
| Motif | PASS: pola alasan mendukung/pertimbangan yang sudah ada tetap dipakai. |
| Design Read | PASS: pemeriksaan panel dan tujuan menyesuaikan kolom serta teks dijelaskan sebelum implementasi. |

## Block 4: Craftsmanship dan Quality Locks

| Butir | Status dan bukti |
| --- | --- |
| C-1 | PASS: alasan auto-fit, min-width, pembungkusan token, dan tinggi panel tertulis di atas. |
| C-2 | PASS: kontrol kartu tetap bekerja dalam pengujian. |
| C-3 | PASS: tidak menambah bagian atau konten pengisi. |
| C-4 | PASS: lebar sempit, teks besar, token panjang, dan keadaan kosong diperiksa. |
| C-5 | PASS: tidak menambah klaim atau hasil rekaan ke produk. |
| R-05 | PASS: struktur alasan dipertahankan sesuai dua jenis isi yang tersedia. |
| R-11 | PASS: radius panel yang ada dipertahankan. |
| R-15 | PASS: label tindakan kartu tidak diubah. |
| R-16 | PASS: tidak menambah copy pemasaran. |
| R-20 | PASS: fitur tetap menjelaskan rekomendasi sekolah. |
| R-21 | PASS: tema terang aplikasi dipertahankan. |
| R-29 | PASS: tidak menambah warna. |
| R-30 | PASS: perbaikan pada komponen yang ada, tanpa template baru. |
| R-31 | PASS: keputusan layout memiliki alasan tertulis. |

Checklist tambahan: UI PASS (pengelompokan alasan tetap jelas), human PASS (teks 200%,
kontras, tinggi mengikuti isi), layoutmobile PASS (kolom mengikuti ruang panel, tanpa
clipping teks), copywriting PASS (teks produk tidak diubah).
