import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { ScrollJourney, type JourneyChapter } from '../components/home/ScrollJourney';
import { DIMENSIONS } from '../config/interestInstrument';
import { useIntroMotion } from '../hooks/useIntroMotion';
import { useStudentOverview, type StudentOverview } from '../hooks/useStudentOverview';
import { useAuthStore } from '../store/authStore';
import './HomePage.css';

function nextStep(data: StudentOverview) {
  if ((data.profile?.profile_completeness ?? 0) < 100)
    return {
      label: 'Lengkapi profil',
      to: '/profile',
      note: 'Tambahkan data diri, lokasi, dan preferensi sekolahmu.',
    };
  if (!data.records.length)
    return {
      label: 'Tambahkan nilai rapor',
      to: '/profile?section=nilai',
      note: 'Profilmu lengkap. Sekarang tambahkan catatan akademikmu.',
    };
  if (!data.assessment)
    return {
      label: 'Kerjakan tes minat',
      to: '/interest-test',
      note: 'Profil dan nilai sudah tersedia. Kenali minatmu sebelum melihat rekomendasi.',
    };
  return {
    label: 'Lihat rekomendasi SMA',
    to: '/recommendations',
    note: 'Profil, nilai, dan tes minat sudah tersedia untuk membuat rekomendasi.',
  };
}

function chaptersFor(data: StudentOverview): JourneyChapter[] {
  const completeness = Math.max(0, Math.min(100, data.profile?.profile_completeness ?? 0));
  const topScore = data.assessment
    ? Math.max(...DIMENSIONS.map(({ key }) => data.assessment!.scores[key]))
    : 0;
  const topInterests =
    data.assessment && topScore > 0
      ? DIMENSIONS.filter(({ key }) => data.assessment!.scores[key] === topScore)
          .map(({ label }) => label)
          .join(', ')
      : '';
  return [
    {
      id: 'profil-saya',
      label: 'Profil & preferensi',
      title:
        completeness === 100 ? 'Keseharianmu sudah jadi pertimbangan.' : 'Mulai dari keseharianmu.',
      description: data.profile?.current_school
        ? `Sekolah saat ini: ${data.profile.current_school}. ${data.profile.kecamatan ? `Domisili: ${data.profile.kecamatan}.` : 'Domisili belum diisi.'}`
        : 'Isi sekolah saat ini dan domisilimu agar rekomendasi memakai konteks yang tepat.',
      detail:
        'Periksa anggaran bulanan, batas jarak, serta pilihan sekolah negeri atau swasta di profilmu.',
      status: `${completeness}% lengkap`,
      action: 'Periksa profil dan preferensi',
      to: '/profile',
      keywords: ['Domisili', 'Anggaran', 'Jarak'],
    },
    {
      id: 'nilai-saya',
      label: 'Nilai rapor',
      title: data.records.length
        ? 'Catatan belajarmu sudah tersimpan.'
        : 'Tambahkan nilai yang sudah kamu punya.',
      description: data.records.length
        ? `Ada ${data.records.length} catatan nilai akademik di profilmu. Nilai per mata pelajaran dan semester dipakai untuk menghitung kecocokan akademik.`
        : 'Belum ada catatan nilai. Masukkan nilai rapor per mata pelajaran dan semester di bagian Nilai rapor.',
      detail:
        'Perbarui catatan ketika rapor berikutnya sudah tersedia. Pastikan semester dan jenjang kelasnya sesuai.',
      status: data.records.length ? 'Nilai tersedia' : 'Belum diisi',
      action: 'Buka nilai rapor',
      to: '/profile?section=nilai',
      keywords: ['Mata pelajaran', 'Semester', 'Nilai'],
    },
    {
      id: 'minat-saya',
      label: 'Tes minat',
      title: data.assessment
        ? 'Kamu sudah mengenali minatmu.'
        : 'Cari tahu kegiatan yang kamu sukai.',
      description: data.assessment
        ? topInterests
          ? `Skor minat tertinggimu: ${topInterests}. Buka hasil tes untuk melihat seluruh aspek minat dan penjelasannya.`
          : 'Hasil tes minatmu sudah tersimpan. Buka hasil tes untuk melihat skor setiap aspek minat.'
        : 'Tes minat belum dikerjakan. Jawabanmu membantu memberi konteks pada pilihan sekolah.',
      detail:
        'Hasil tes menggambarkan ketertarikanmu saat ini. Kamu bisa mengulang tes bila ingin memperbaruinya.',
      status: data.assessment ? 'Tes tersimpan' : 'Belum dikerjakan',
      action: data.assessment ? 'Baca hasil tes minat' : 'Kerjakan tes minat',
      to: data.assessment ? '/interest-result' : '/interest-test',
      keywords: ['Minat', 'Kegiatan'],
    },
    {
      id: 'pilihan-saya',
      label: 'Rekomendasi',
      title: data.latest.recommendations.length
        ? 'Pilihanmu sudah punya alasan.'
        : 'Susun pilihan berdasarkan prioritasmu.',
      description: data.latest.recommendations.length
        ? 'Hasil perhitungan terakhir sudah tersedia. Buka rekomendasi untuk melihat rincian skor, menyesuaikan bobot, dan memilih sekolah untuk dibandingkan.'
        : 'Belum ada hasil rekomendasi tersimpan. Lengkapi profil, nilai, dan tes minat, lalu terapkan bobot di halaman rekomendasi.',
      detail:
        'Estimasi peluang bukan jaminan penerimaan. Periksa informasi resmi dari setiap sekolah yang ingin kamu tuju.',
      status: data.latest.recommendations.length ? 'Hasil tersedia' : 'Belum dibuat',
      action: 'Buka rekomendasi SMA',
      to: '/recommendations',
      keywords: ['Bobot pilihan', 'Alasan', 'Perbandingan'],
    },
  ];
}

export default function StudentHomePage() {
  const root = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);
  const overview = useStudentOverview();
  const firstName = user?.full_name.trim().split(/\s+/)[0] || 'teman';
  useIntroMotion(root);
  const step = overview.status === 'ready' ? nextStep(overview.data) : null;
  const results =
    overview.status === 'ready' ? overview.data.latest.recommendations.slice(0, 3) : [];
  const synthetic = results.some((item) => /sintetis/i.test(JSON.stringify(item.explanation)));

  return (
    <div className="ak-site ak-member" ref={root}>
      <a className="ak-skip" href="#main-content">
        Langsung ke konten
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <section className="ak-intro ak-wrap" aria-labelledby="student-title">
          <div className="ak-intro-copy">
            <p className="ak-context" data-intro>
              Halo, {firstName}. Ini ruang pilihanmu.
            </p>
            <h1 id="student-title">
              <span data-intro>Sekolahmu.</span>
              <span data-intro>
                <em>Pilihanmu.</em>
              </span>
            </h1>
            <div className="ak-intro-foot" data-intro>
              <p>Periksa yang sudah kamu isi, lalu lanjutkan bagian yang masih perlu dilengkapi.</p>
              <a className="ak-text-action" href="#perjalanan">
                Lihat perjalanan saya
              </a>
            </div>
          </div>
          <aside className="ak-sheet-wrap" aria-labelledby="next-title">
            <div className="ak-sheet ak-next-sheet" data-intro>
              <div className="ak-sheet-top">
                <span>Catatan untukmu</span>
                <span>Home</span>
              </div>
              <h2 id="next-title" className="ak-next-title">
                Langkah
                <br />
                <em>berikutnya.</em>
              </h2>
              {overview.status === 'loading' && (
                <p role="status" className="ak-loading">
                  Memuat profil, nilai, tes minat, dan rekomendasimu…
                </p>
              )}
              {overview.status === 'error' && (
                <div role="alert" className="ak-load-error">
                  <h3>Data belum bisa dimuat.</h3>
                  <p>{overview.message}</p>
                  <button className="ak-button" type="button" onClick={overview.retry}>
                    Muat ulang data
                  </button>
                </div>
              )}
              {step && (
                <div className="ak-next-action">
                  <p>{step.note}</p>
                  <Link className="ak-button" to={step.to}>
                    {step.label}
                  </Link>
                </div>
              )}
              <p className="ak-sheet-note">
                Kamu bisa kembali ke Home dari navigasi di setiap halaman.
              </p>
            </div>
          </aside>
          <a className="ak-scroll-link" href="#perjalanan">
            <span>Scroll untuk memeriksa pilihanmu</span>
            <span aria-hidden="true">↓</span>
          </a>
        </section>
        <section id="perjalanan" className="ak-process ak-wrap" aria-labelledby="journey-title">
          <div className="ak-section-intro">
            <p className="ak-section-index">Yang sudah kamu siapkan</p>
            <h2 id="journey-title">
              Catatanmu,
              <br />
              <em>satu per satu.</em>
            </h2>
            <p>Semua ringkasan di sini mengikuti data yang tersimpan di akunmu.</p>
          </div>
          {overview.status === 'loading' && (
            <div className="ak-data-state" role="status">
              <h3>Sedang mengambil catatanmu.</h3>
              <p>Profil, nilai, hasil tes, dan rekomendasi akan tampil setelah selesai dimuat.</p>
            </div>
          )}
          {overview.status === 'error' && (
            <div className="ak-data-state">
              <h3>Ringkasan belum tersedia.</h3>
              <p>Muat ulang data dari catatan di atas. Kamu juga bisa langsung membuka profilmu.</p>
              <Link className="ak-text-action" to="/profile">
                Buka profil saya
              </Link>
            </div>
          )}
          {overview.status === 'ready' && (
            <ScrollJourney chapters={chaptersFor(overview.data)} label="Perjalanan pilihan saya" />
          )}
        </section>
        {overview.status === 'ready' && (
          <section className="ak-results-section" aria-labelledby="results-title">
            <div className="ak-wrap">
              <div className="ak-results-heading">
                <div>
                  <p className="ak-section-index">Hasil yang tersimpan</p>
                  <h2 id="results-title">
                    Sekolah dalam
                    <br />
                    <em>pertimbanganmu.</em>
                  </h2>
                </div>
                <Link className="ak-text-action" to="/recommendations">
                  Buka seluruh rekomendasi
                </Link>
              </div>
              {results.length ? (
                <>
                  <p className="ak-result-disclaimer">
                    Ringkasan dari perhitungan terakhir.{' '}
                    {synthetic ? 'Hasil ini memakai data sintetis untuk pengujian. ' : ''}Skor
                    kecocokan bukan persentase peluang diterima.
                  </p>
                  <ol className="ak-school-list">
                    {results.map((item) => (
                      <li key={`${item.school_id}-${item.jurusan_id}`}>
                        <span className="ak-school-rank">{String(item.rank).padStart(2, '0')}</span>
                        <div>
                          <h3>
                            <Link to={`/schools/${encodeURIComponent(String(item.school_id))}`}>
                              {item.school_name}
                            </Link>
                          </h3>
                          <p>{item.jurusan_name}</p>
                        </div>
                        <div className="ak-school-score">
                          <strong>
                            {new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 }).format(
                              item.total_score,
                            )}
                          </strong>
                          <span>Skor kecocokan / 100</span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </>
              ) : (
                <div className="ak-data-state">
                  <h3>Belum ada rekomendasi tersimpan.</h3>
                  <p>Lengkapi catatanmu, lalu buat rekomendasi berdasarkan bobot pilihanmu.</p>
                  <Link className="ak-button" to="/recommendations">
                    Siapkan rekomendasi saya
                  </Link>
                </div>
              )}
              <p className="ak-small-print">
                Rekomendasi adalah alat bantu. Pastikan informasi penerimaan pada sumber resmi
                sekolah.
              </p>
            </div>
          </section>
        )}
      </main>
      <footer className="ak-footer ak-wrap">
        <Link className="ak-wordmark" to="/home">
          Akademik<span>Kita.</span>
        </Link>
        <Link className="ak-text-action" to="/">
          Tentang AkademikKita
        </Link>
        <a href="#main-content">Kembali ke atas ↑</a>
      </footer>
    </div>
  );
}
