# Antislop: About Us dengan empat slot foto

Status: PASS. Mode: during. Tanggal: 20 Oktober 2026, Asia/Jakarta.
Arahan: empat slot foto profil tim pada halaman About Us, mengikuti tema biru.
Pembaruan: area tim dan foto diperkecil sesuai permintaan pemilik; seluruh pemeriksaan di bawah dijalankan ulang setelah penyesuaian ukuran.
Design Read dan alasan teknik ada di [about-design.md](about-design.md).
Dials halaman: ENERGY 3 / RHYTHM 2 / MOTION 2.

## Bukti

- Build TypeScript dan Vite produksi: `npm.cmd run build`, berhasil.
- Area tim maksimal 1040 piksel, empat foto desktop sekitar 242 × 303 piksel, dengan jarak 24 piksel. Screenshot desktop diperiksa setelah perubahan.
- [Hasil browser](about-results.json): delapan ukuran, 11 catatan navigasi, tiga pemeriksaan keadaan, 80 pasangan kontras, tanpa exception JavaScript.
- Lebar 320, 390, 640, 820, 1024, 1200, 1440, dan 1920 piksel diperiksa dengan resize halaman yang sama. Susunan satu/dua/empat kolom berubah sesuai ruang, tanpa overflow horizontal atau teks keluar layar.
- Empat slot tersedia tanpa permintaan gambar yang hilang. Pengujian konfigurasi memakai respons browser sintetis untuk dua gambar valid, satu gagal, dan satu kosong. Data uji tidak ditulis ke konfigurasi produk.
- Alt dan object-position foto diperiksa. Foto gagal menampilkan fallback; foto berhasil tampil dengan opacity penuh setelah load.
- Skip link, seluruh tautan About Us, anchor tim, Menu/Escape, serta jalur homepage dan Home siswa diperiksa. Halaman membersihkan scroll snap homepage ketika masuk ke About Us.
- Seluruh kontrol yang tampil memiliki target minimal 44 × 44 piksel. Teks normal memenuhi 4,5:1 dan teks besar 3:1; hasil per pasangan tersedia di JSON.
- Reduced motion meniadakan reveal. Pada lebar 390 piksel dan teks 200%, label slot tetap utuh tanpa overflow horizontal.
- Pratinjau diperiksa: [desktop](../../output/about-1440.png), [ponsel](../../output/about-390.png).

Pengujian memakai Edge headless. Pengujian perangkat sentuh fisik tidak diklaim.

## Block 1: Hard Gate

| Butir | Status dan bukti |
| --- | --- |
| R-02 | PASS: source dan copy halaman tidak menambahkan em dash. |
| R-03 | PASS: delapan lebar dan teks 200% tanpa overflow atau teks placeholder terpotong. |
| R-17 | PASS: angka empat berasal dari jumlah anggota yang diberikan pemilik; nomor adalah urutan slot. |
| R-18 | PASS: tidak ada testimonial atau persona rekaan. |
| R-23 | PASS: empat slot foto dan navigasi About Us berasal dari permintaan pemilik; tidak membuat foto orang. |
| R-24 | PASS: seluruh tautan About Us diklik dan menuju route atau anchor nyata. |
| R-25 | PASS: 80 pasangan kontras dihitung dan memenuhi ambang ukuran teks masing-masing. |
| R-26 | PASS: 11 catatan navigasi mencakup route, anchor, skip link, Menu, Escape, dan Home saya. Placeholder tidak diberi perilaku tombol palsu. |
| R-27 | PASS: keadaan foto kosong, loading, berhasil, dan gagal ditangani; keadaan berhasil/gagal/kosong diuji dengan fixture browser. |
| R-28 | PASS: tidak menambahkan FAQ. |
| R-32 | PASS: skip link Tab/Enter memfokuskan main; Escape menutup menu dan mengembalikan fokus; kontrol semantik memakai focus ring dari CSS bersama. |
| R-33 | PASS: implementasi ditulis langsung dengan apply_patch; skrip QA menguji UI dan respons fixture tanpa mengubah source produk. |
| R-34 | PASS: satu tema biru terang lengkap tanpa toggle baru. |
| R-35 | PASS: build, screenshot, pemeriksaan ukuran, dan klik seluruh tautan halaman selesai tanpa exception JavaScript. |
| R-36 | PASS: tidak menambahkan klaim pelanggan, keamanan, performa, atau penerimaan. |
| R-37 | PASS: arah biru, empat slot, dan permintaan ukuran lebih kecil dicatat di DESIGN.md; fokus potret dijelaskan sebelum implementasi. |
| R-38 | PASS: fungsi produk mengikuti homepage; nama/peran/foto kosong diberi placeholder yang jujur. |

## Block 2: Purpose-Gate

| Butir | Status dan bukti |
| --- | --- |
| R-01 | PASS: biru berasal dari token aplikasi; tidak memakai gradient baru. |
| R-04 | PASS: tidak menambahkan ikon. |
| R-06 | PASS: font aplikasi dan penekanan Georgia meneruskan identitas yang sudah dipilih; alasan tertulis di about-design.md. |
| R-07 | PASS: tidak menambahkan pola latar generik; garis memisahkan pengantar dan profil. |
| R-08 | PASS: tidak menambahkan panah dekoratif. |
| R-09 | PASS: tidak menambahkan badge pemasaran. |
| R-10 | PASS: tidak memakai glassmorphism. |
| R-12 | PASS: tidak menambahkan shadow. |
| R-13 | PASS: tidak menambahkan glow. |
| R-14 | PASS: empat portrait sama besar karena mewakili anggota tim yang setara; alasan tercatat. |
| R-19 | PASS: reveal singkat mengenalkan judul dan tim, tanpa loop atau konten disembunyikan; reduced motion diuji. |
| R-22 | PASS: tidak menambah ilustrasi atau avatar generik; placeholder berupa angka dan label slot. |

## Block 3: Liveliness

| Butir | Status dan bukti |
| --- | --- |
| Dials eksplisit | PASS: ENERGY 3 / RHYTHM 2 / MOTION 2 dicatat di DESIGN.md dan about-design.md. |
| Sesuai dials | PASS: judul dominan, pengantar asimetris, portrait setara, gerak masuk singkat. |
| Fokus | PASS: pengantar berfokus pada nama produk; bagian tim berfokus pada portrait empat anggota. |
| Whitespace | PASS: sela dan margin fluid memisahkan pengantar, tim, dan footer; ponsel memakai skala lebih kecil. |
| Aksen | PASS: biru utama menjadi aksen identitas; tidak menambahkan warna aksen baru. |
| Motif | PASS: sudut lembar dan angka urutan meneruskan visual akademik. |
| Design Read | PASS: gaya akademik biru dan komposisi empat potret dijelaskan sebelum source halaman ditulis, dengan arah dari DESIGN.md. |

## Block 4: Craftsmanship dan Quality Locks

| Butir | Status dan bukti |
| --- | --- |
| C-1 | PASS: alasan komposisi, palet, font, placeholder, crop, dan motion tercatat di about-design.md. |
| C-2 | PASS: setiap tautan dan tombol memiliki aksi; tidak memasang tombol upload yang belum berfungsi. |
| C-3 | PASS: halaman berisi pengantar produk dan empat profil sesuai permintaan, tanpa bagian pengisi. |
| C-4 | PASS: delapan lebar, teks besar, reduced motion, foto gagal, keyboard, serta navigasi akun diuji. |
| C-5 | PASS: foto dan identitas belum tersedia diberi placeholder, tanpa klaim atau data rekaan. |
| R-05 | PASS: empat figure berasal dari empat anggota nyata yang disebut pemilik, bukan feature card generik. |
| R-11 | PASS: sudut lembar dipakai pada portrait; tidak menambahkan pill. |
| R-15 | PASS: tautan Kenali tim kami dan Kembali ke beranda menyebut tujuan nyata. |
| R-16 | PASS: tidak menambahkan buzzword pemasaran AI. |
| R-20 | PASS: tipografi, warna, dan motif lembar meneruskan AkademikKita. |
| R-21 | PASS: tema terang biru mengikuti arahan pemilik. |
| R-29 | PASS: memakai palet biru dan netral yang sudah ada. |
| R-30 | PASS: meneruskan komponen dan bahasa visual produk, tanpa menyalin template lain. |
| R-31 | PASS: keputusan visual utama memiliki alasan satu baris dalam about-design.md. |

Checklist tambahan: UI PASS (hierarki dan motion bertujuan), human PASS (kontras, fokus,
reduced motion, teks besar, alt dan keadaan foto), layoutmobile PASS (satu/dua/empat kolom,
ukuran antara diuji, target 44px, menu berlabel, tanpa clipping teks), copywriting PASS
(empat anggota dari pemilik, identitas kosong jujur, tanpa jabatan atau cerita rekaan).
