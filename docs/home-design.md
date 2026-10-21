# Homepage publik dan Home siswa

Arahan pemilik terbaru: gunakan biru tema awal aplikasi, pertahankan komposisi lebih berani dan GSAP saat scroll.
Antislop: during, dipilih pemilik untuk sesi ini. Instruksi proyek global tidak diubah.

Design Read: halaman pemilihan SMA untuk siswa dan orang tua, visual akademik ekspresif.
Dials: ENERGY 3 / RHYTHM 3 / MOTION 3.

## Alasan keputusan

- Biru primary #4569e8 dan primary-dark #3556cc memakai token tema awal aplikasi agar homepage dan halaman lama konsisten.
- Dasar #f7f8fc dan permukaan biru muda #e8efff membedakan halaman dari lembar pertimbangan tanpa gradient atau glow.
- Aksen hijau #d9ecab hanya menandai catatan pilihan dan progres perjalanan, bukan mewarnai setiap kontrol.
- Plus Jakarta Sans mempertahankan identitas aplikasi dan keterbacaan label; Georgia italic memberi penekanan editorial pada kata tentang siswa.
- Judul besar menjadi fokus pembuka; ringkasan tindakan pada Home memakai hierarki yang sama agar langkah berikutnya mudah ditemukan.
- Motif lembar pilihan menghubungkan data profil dengan keputusan sekolah. Lembar berisi teks produk, tanpa screenshot palsu, angka simulasi, atau identitas orang rekaan.
- Komposisi berubah antara pembuka asimetris, bab vertikal, daftar faktor, dan penutup editorial. Setiap bagian menjelaskan pekerjaan yang benar-benar tersedia.
- Empat bab mengikuti alur aplikasi: profil dan preferensi, nilai, tes minat, rekomendasi. Bab bukan statistik atau janji jumlah langkah pemasaran.
- Homepage publik memakai tujuh slide vertikal sesuai arahan terbaru pemilik: pembuka, empat bagian proses, pertimbangan, dan penutup.
- Setiap slide mengikuti ukuran layar; konten yang lebih panjang tetap dapat dibaca sampai bawah sebelum navigasi lanjut.
- Layout homepage publik memakai empat komposisi: desktop berdampingan, tablet dengan judul penuh dan lembar bab mendatar, ponsel bertumpuk, serta jendela pendek dengan dua kolom ringkas.
- Tablet pada lebar 700 sampai 1099 piksel dengan tinggi di atas 700 piksel memisahkan judul bab dari penjelasannya dalam dua kolom di bawah lembar. Daftar faktor menjadi dua kolom agar ruang portrait terpakai tanpa baris teks terlalu panjang.
- Jendela dengan tinggi maksimal 700 piksel dan lebar minimal 700 piksel memakai ukuran lembar, judul, dan sela lebih ringkas agar isi tetap dominan di antara navigasi. Target tombol tetap minimal 44 piksel.
- Lebar konten dan header mengikuti viewport dengan margin fluid dan batas 1560 piksel. Minmax mencegah kolom mempertahankan lebar intrinsik yang melampaui jendela; clamp mengatur jarak dan tipografi.
- Saat resize, posisi slide aktif dipertahankan. Snap dihentikan selama reflow, lalu ukuran header dan ScrollTrigger diukur ulang setelah jeda 150 milidetik sebelum posisi slide diselaraskan kembali tanpa morph tambahan.
- Satu gestur roda mouse dibatasi ke satu slide agar momentum besar tidak melewati isi; touch tetap memakai scroll native dan snap. Ctrl+wheel untuk zoom tidak ditahan.
- GSAP mengubah kurva tepi lembar SVG dan menggerakkan dash saat berganti slide. Efek ini menunjukkan perpindahan halaman sesuai permintaan dash/morph, bukan animasi latar tanpa fungsi.
- Sesuai klarifikasi pemilik, animasi scroll mengikuti perilaku reveal seperti AOS: teks naik 24 piksel sambil muncul, panel bab naik 12 piksel dengan skala 0,97 menuju 1. Efek memperkenalkan isi yang baru masuk ruang baca, memakai GSAP yang sudah tersedia.
- Tiga puluh elemen dikelompokkan berdasarkan isi: empat panel bab, judul/penjelasan/CTA, daftar faktor, dan penutup. Setiap elemen berjalan sekali saat bagian atasnya melewati 88% tinggi viewport, sehingga isi panjang di ponsel tetap muncul saat dibaca.
- Durasi reveal 0,65 detik dengan jeda antarurutan maksimal 0,16 detik. Elemen pada slide baru menunggu sekitar 0,6 detik agar geraknya terlihat setelah morph; elemen di dalam slide yang sedang dibaca muncul tanpa menunggu morph baru.
- Navigasi keyboard menyelesaikan reveal pada kelompok yang menerima fokus agar fokus dan tindakannya langsung terlihat. Pointer tidak memicu penyelesaian mendadak yang menggeser sasaran klik.
- Reduced motion melewati seluruh reveal dan mengembalikan opacity serta transform awal. ScrollTrigger, tween, dan listener fokus dibersihkan melalui scope useGSAP saat keluar halaman.
- Kurva diputar balik saat berpindah ke slide sebelumnya. Overlay tidak menerima pointer dan disembunyikan setelah transisi; durasinya 0,6 detik tanpa loop.
- Penanda dash mewakili slide nyata dan aktifnya mengikuti posisi scroll. Ponsel memakai nomor/label dan tombol naik/turun dengan target minimal 44 piksel.
- Home setelah login memakai panel sticky selama empat bab untuk mempertahankan konteks saat membaca data akun. CSS sticky membatasi panel pada bagian perjalanan dan tetap bekerja dengan reduced motion; GSAP mengatur penanda bab serta progres.
- Panel penuh dipakai pada desktop; layar di bawah 1000 piksel memakai panel ringkas dan layar desktop pendek memakai angka lebih kecil. ResizeObserver mengukur tinggi panel saat resize, font selesai dimuat, atau judul bab berganti.
- Panel hanya mengikuti jika seluruh isinya muat: desktop menyisakan ruang atas dan bawah, sedangkan layar sempit membatasi panel maksimal 240 piksel atau 40% tinggi viewport. Teks besar yang melewati batas mengembalikan panel ke alur normal agar isi tetap dapat dijangkau.
- Tinggi minimum bab desktop mengikuti tinggi panel agar bab terakhir tidak mendorong panel keluar terlalu cepat. Offset anchor dan garis pemilihan bab dihitung dari tinggi panel, sehingga tautan 01 sampai 04 tidak menempatkan judul di belakangnya.
- Parallax pada Home setelah login hanya ada di lembar pembuka desktop. Tidak ada animasi tanpa akhir.
- Di ponsel, lembar menjadi pengantar ringkas dan bab mengalir vertikal; tablet memakai judul dan penjelasan dua kolom; desktop mendapat panel penanda besar.
- Reduced motion menghapus tween dan morph; panel Home tetap sticky tanpa animasi, snap homepage menjadi proximity, dan tombol slide berpindah langsung. Seluruh konten tetap bisa dibaca.
- Radius 2 sampai 4 piksel menandai dokumen dan kontrol; sudut lembar yang lebih besar menjadi motif. Shadow hanya memisahkan lembar pembuka dari dasar halaman.
- Panah hanya dipakai untuk petunjuk scroll, kembali ke atas, dan arah jenjang sekolah. Tindakan utama dijelaskan dengan label.
- Tema terang mengikuti tema awal aplikasi dan motif lembar akademik. Slider mode gelap mempertahankan aksen biru dan mengganti token latar, permukaan, teks, serta status.
- Home mengambil profil, nilai, tes, dan rekomendasi dari service aplikasi. Loading menyebut data yang diambil; error menawarkan retry; data kosong memberi tindakan pengisian.
- Rekomendasi kosong (404) adalah keadaan belum ada hasil, sedangkan kegagalan koneksi/server tetap ditampilkan sebagai error.
- Persentase profil dan skor berasal dari API. Hasil sintetis ditandai bila peringatan sumber sintetis ditemukan dalam penjelasan backend.
- Tidak ada foto, logo baru, testimonial, FAQ, feed aktivitas, atau metrik pemasaran yang dibuat-buat.
- Menu Home adalah halaman baru yang diminta pemilik; tujuan login/register default menjadi /home, sementara tujuan dari halaman terproteksi tetap dipertahankan.
- Perpindahan pathname mengembalikan scroll ke atas; anchor dalam halaman dan perubahan tab profil tetap mempertahankan perilaku scroll lokalnya.

## Ruang lingkup

Homepage publik `/`, Home terproteksi `/home`, navigasi bersama, tujuan login/register,
dan tautan langsung ke tab nilai rapor. Formulir dan perhitungan backend tidak diubah.

Perubahan slideshow hanya berlaku pada homepage publik. Scroll snap, wheel handler,
PageDown/PageUp, resize observer, dan animasinya dibersihkan saat halaman ditinggalkan.
Listener resize, timer, serta requestAnimationFrame juga dibersihkan saat keluar halaman.

## Mode gelap

Slider tersedia di navigasi bersama dan halaman login/register. Tema awal mengikuti perangkat bila belum ada pilihan tersimpan; pilihan pengguna disimpan dengan kunci `akademikkita-theme`. `public/theme.js` menetapkan tema sebelum React dirender agar refresh tidak menampilkan kilatan tema terang. Jika penyimpanan diblokir, slider tetap bekerja selama halaman terbuka.

Permukaan kartu, form, tabel, status, serta label dan tooltip grafik memakai token tema. Palet gelap memakai latar abu arang #11151c dan permukaan #1b222d agar aksen biru lebih terarah. Garis dekoratif #303b4c dibuat lebih halus daripada batas kontrol #6f7d91. Biru tombol #4668d9 dipisahkan dari biru tautan #91b5ff agar label dan teks tetap terbaca. Gerak thumb 180 ms menunjukkan status sakelar dan mengikuti pengaturan reduced motion.

Pemeriksaan perubahan ini:

- R-26/R-32 PASS: slider merespons klik dan Space, memiliki role switch, aria-checked, label, dan outline fokus.
- R-03/R-34 PASS: homepage, login, dan daftar sekolah diperiksa di browser; navbar 320 px muat setelah penyesuaian ikon menu. Tema terang dan gelap tampil tanpa overflow horizontal pada tampilan yang diperiksa.
- R-25 PASS: kontras teks utama pada permukaan gelap 13.60:1, teks sekunder 7.45:1, tautan pada tint 6.78:1, label putih pada tombol biru 4.95:1; batas kontrol 3.82:1 memenuhi kontras nonteks 3:1. Kontras teks pada status kuning/hijau melewati 11:1 dan status error 7.12:1.
- R-35 PASS: build frontend dan enam tes bootstrap tema lolos; pilihan light dipertahankan setelah reload, dan tema dark bertahan ketika masuk ke halaman login dan setelah login.
- R-19/R-31 PASS: animasi hanya memindahkan thumb untuk menunjukkan status; komentar tambahan menjelaskan keterbatasan penyimpanan browser.

Perubahan ini tidak mencakup audit ulang seluruh alur aplikasi atau deployment.
