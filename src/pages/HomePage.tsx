import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { HomepageSlideshow, type HomepageSlide } from '../components/home/HomepageSlideshow';
import type { JourneyChapter } from '../components/home/ScrollJourney';
import { useAuthStore } from '../store/authStore';
import './HomePage.css';

export default function HomePage() {
  const token = useAuthStore((state) => state.token);
  const destination = token ? '/home' : '/register';
  const chapters: JourneyChapter[] = [
    {
      id: 'profil',
      label: 'Profil & preferensi',
      title: 'Sekolahnya harus cocok dengan keseharianmu.',
      description:
        'Lokasi rumah, anggaran bulanan, dan pilihan sekolah negeri atau swasta ikut menentukan sekolah yang masuk pertimbanganmu.',
      detail:
        'Isi data diri dan batasan yang penting bagimu. Preferensimu menjadi bagian dari perhitungan.',
      action: 'Isi profil dan preferensi',
      to: token ? '/profile' : '/register',
      keywords: ['Domisili', 'Anggaran', 'Jarak'],
    },
    {
      id: 'nilai',
      label: 'Nilai rapor',
      title: 'Lihat kemampuanmu lewat nilai yang sudah kamu punya.',
      description:
        'Tambahkan nilai per mata pelajaran dan semester. AkademikKita memakai catatan ini untuk mempertimbangkan kecocokan akademik.',
      detail:
        'Nilai tersimpan di profil dan bisa diperbarui ketika rapor berikutnya sudah tersedia.',
      action: 'Tambahkan nilai rapor',
      to: token ? '/profile?section=nilai' : '/register',
      keywords: ['Mata pelajaran', 'Semester', 'Nilai'],
    },
    {
      id: 'minat',
      label: 'Tes minat',
      title: 'Apa yang membuatmu ingin belajar lebih jauh?',
      description:
        'Kenali minatmu melalui pertanyaan tentang kegiatan praktik, penelitian, seni, sosial, wirausaha, dan pekerjaan yang terstruktur.',
      detail:
        'Jawab sesuai dirimu sekarang. Hasilnya membantu memberi konteks pada pilihan sekolah, bukan menetapkan masa depanmu.',
      action: 'Kerjakan tes minat',
      to: token ? '/interest-test' : '/register',
      keywords: ['Minat', 'Kegiatan'],
    },
    {
      id: 'pilihan',
      label: 'Rekomendasi',
      title: 'Bandingkan pilihan beserta alasannya.',
      description:
        'Lihat kecocokan sekolah dari akademik, minat, estimasi peluang, jarak, dan biaya. Atur bobot untuk hal yang lebih kamu utamakan.',
      detail:
        'Hasil merupakan alat bantu pertimbangan. Persyaratan dan informasi penerimaan tetap perlu diperiksa pada sumber resmi sekolah.',
      action: 'Lihat rekomendasi SMA',
      to: token ? '/recommendations' : '/register',
      keywords: ['Bobot pilihan', 'Alasan', 'Perbandingan'],
    },
  ];

  const slides: HomepageSlide[] = [
    {
      id: 'beranda',
      label: 'Beranda',
      titleId: 'public-title',
      content: (
        <div className="ak-intro">
          <div className="ak-intro-copy">
            <p className="ak-context" data-intro>
              Untuk siswa SMP/MTs dan orang tua
            </p>
            <h1 id="public-title">
              <span data-intro>Pilih SMA.</span>
              <span data-intro>
                Pakai <em>caramu.</em>
              </span>
            </h1>
            <div className="ak-intro-foot" data-intro>
              <p>
                Nilai, minat, jarak, biaya. Cari sekolah dengan pertimbangan yang dekat dengan
                dirimu.
              </p>
              <Link className="ak-button" to={destination}>
                {token ? 'Buka Home saya' : 'Buat akun siswa'}
              </Link>
            </div>
          </div>
          <aside className="ak-sheet-wrap" aria-label="Pertimbangan memilih SMA">
            <div className="ak-sheet" data-intro>
              <div className="ak-sheet-top">
                <span>Lembar pilihan</span>
                <span>SMP / MTs → SMA</span>
              </div>
              <p className="ak-sheet-title">
                Sekolah yang pas
                <br />
                buat <em>siapa?</em>
              </p>
              <p className="ak-sheet-answer">Buat kamu.</p>
              <div className="ak-sheet-fields">
                <span>Yang kamu minati</span>
                <span>Yang kamu pelajari</span>
                <span>Yang kamu prioritaskan</span>
              </div>
              <p className="ak-sheet-note">
                Mulai dari mengenal diri, lalu pertimbangkan sekolahnya.
              </p>
            </div>
            <span className="ak-sheet-tab">Pilihanmu punya alasan.</span>
          </aside>
          <a className="ak-scroll-link" href="#alur">
            <span>Scroll ke slide berikutnya</span>
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      ),
    },
    ...chapters.map((chapter, index): HomepageSlide => ({
      id: index === 0 ? 'alur' : chapter.id,
      label: chapter.label,
      titleId: `${chapter.id}-title`,
      content: (
        <div className="ak-paged-chapter">
          <div
            className="ak-slide-document"
            id={index === 0 ? 'profil' : undefined}
            data-reveal="panel"
          >
            <div className="ak-slide-document-top">
              <span>Lembar pilihanmu</span>
              <span>{String(index + 1).padStart(2, '0')} / 04</span>
            </div>
            <p className="ak-slide-document-number" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
              <span>.</span>
            </p>
            <h2 id={`${chapter.id}-title`}>{chapter.label}</h2>
            <div className="ak-stage-keywords">
              {chapter.keywords.map((word) => (
                <span key={word}>{word}</span>
              ))}
            </div>
          </div>
          <div className="ak-slide-chapter-copy">
            <h3 data-reveal="up">{chapter.title}</h3>
            <p data-reveal="up">{chapter.description}</p>
            <p className="ak-chapter-detail" data-reveal="up">
              {chapter.detail}
            </p>
            <Link className="ak-text-action" to={chapter.to} data-reveal="up">
              {chapter.action}
            </Link>
          </div>
        </div>
      ),
    })),
    {
      id: 'pertimbangan',
      label: 'Pertimbangan',
      titleId: 'consider-title',
      className: 'ak-slide-tinted',
      content: (
        <div className="ak-consider-grid">
          <div data-reveal="up">
            <p className="ak-section-index">Pertimbangan yang berbeda</p>
            <h2 id="consider-title">
              Yang penting
              <br />
              buatmu, <em>ikut dihitung.</em>
            </h2>
            <p>
              Bobot rekomendasi bisa diubah. Lihat bagaimana prioritasmu memengaruhi urutan sekolah.
            </p>
          </div>
          <dl className="ak-factor-list">
            <div data-reveal="up">
              <dt>Akademik</dt>
              <dd>Nilai mata pelajaran yang sudah kamu masukkan.</dd>
            </div>
            <div data-reveal="up">
              <dt>Minat</dt>
              <dd>Hasil tes minat sebagai gambaran kegiatan yang kamu sukai.</dd>
            </div>
            <div data-reveal="up">
              <dt>Peluang</dt>
              <dd>Estimasi berdasarkan data penerimaan yang tersedia.</dd>
            </div>
            <div data-reveal="up">
              <dt>Jarak</dt>
              <dd>Lokasi sekolah terhadap domisilimu.</dd>
            </div>
            <div data-reveal="up">
              <dt>Biaya</dt>
              <dd>Anggaran bulanan dan data biaya sekolah.</dd>
            </div>
          </dl>
        </div>
      ),
    },
    {
      id: 'penutup',
      label: 'Siapkan profil',
      titleId: 'closing-title',
      content: (
        <>
          <div className="ak-closing">
            <p className="ak-section-index" data-reveal="up">
              Mulai dari yang sudah kamu tahu
            </p>
            <h2 id="closing-title" data-reveal="up">
              Mulai dari
              <br />
              <em>dirimu.</em>
            </h2>
            <div data-reveal="up">
              <p>Siapkan profilmu untuk melihat sekolah yang sesuai dengan kebutuhanmu.</p>
              <Link className="ak-button" to={destination}>
                {token ? 'Lanjutkan di Home' : 'Buat akun dan isi profil'}
              </Link>
              <p className="ak-small-print">
                Rekomendasi membantu pertimbangan, bukan jaminan diterima.
              </p>
            </div>
          </div>
          <footer className="ak-footer" data-reveal="up">
            <a href="#beranda" className="ak-wordmark">
              Akademik<span>Kita.</span>
            </a>
            <p>Catat pertimbanganmu. Pilih dengan alasan.</p>
            <a href="#beranda">Kembali ke atas ↑</a>
          </footer>
        </>
      ),
    },
  ];

  return (
    <div className="ak-site ak-paged">
      <a className="ak-skip" href="#main-content">
        Langsung ke konten
      </a>
      <Navbar variant="landing" />
      <HomepageSlideshow slides={slides} />
    </div>
  );
}
