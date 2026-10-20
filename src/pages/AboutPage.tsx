import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Navbar } from '../components/common/Navbar';
import { teamMembers, type TeamMember } from '../config/team';
import './HomePage.css';
import './AboutPage.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function MemberPortrait({ member, number }: { member: TeamMember; number: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const hasPhoto = Boolean(member.photo.trim()) && !failed;

  return (
    <div className="ak-team-photo" aria-busy={hasPhoto && !loaded}>
      {(!hasPhoto || !loaded) && (
        <div className="ak-team-placeholder">
          <span className="ak-team-photo-label">Foto anggota {number}</span>
          <span className="ak-team-photo-number" aria-hidden="true">
            {number}
          </span>
          <p role={hasPhoto ? 'status' : undefined}>
            {failed ? 'Foto belum bisa dimuat' : hasPhoto ? 'Memuat foto…' : 'Slot foto profil'}
          </p>
          {!hasPhoto && (
            <span>
              {failed ? 'Periksa kembali file foto anggota ini.' : 'Foto akan ditambahkan di sini.'}
            </span>
          )}
        </div>
      )}
      {hasPhoto && (
        <img
          src={member.photo}
          alt={`Foto ${member.name.trim() || `anggota ${number}`}`}
          loading="lazy"
          decoding="async"
          style={{ objectPosition: member.photoPosition }}
          className={loaded ? 'is-loaded' : undefined}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export default function AboutPage() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        '(prefers-reduced-motion: no-preference)',
        () => {
          gsap.from('.ak-about-intro h1', { y: 22, duration: 0.7, ease: 'power3.out' });
          gsap.from('.ak-team-card', {
            y: 28,
            duration: 0.65,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.ak-team-grid', start: 'top 90%', once: true },
          });
        },
        root,
      );
      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <div className="ak-site ak-about" ref={root}>
      <a className="ak-skip" href="#main-content">
        Langsung ke konten
      </a>
      <Navbar variant="public" />
      <main id="main-content" tabIndex={-1} className="ak-wrap">
        <section className="ak-about-intro" aria-labelledby="about-title">
          <div>
            <p className="ak-context">About us / Tentang kami</p>
            <h1 id="about-title">
              Di balik
              <br />
              <em>AkademikKita.</em>
            </h1>
          </div>
          <div className="ak-about-intro-copy">
            <p>
              Empat orang di balik pengembangan AkademikKita, tempat siswa mempertimbangkan pilihan
              SMA dari nilai, minat, jarak, dan biaya.
            </p>
            <a className="ak-text-action" href="#tim-kami">
              Kenali tim kami
            </a>
          </div>
        </section>
        <section id="tim-kami" className="ak-about-team" aria-labelledby="team-title">
          <div className="ak-about-team-heading">
            <h2 id="team-title">Tim kami</h2>
          </div>
          <div className="ak-team-grid">
            {teamMembers.map((member, index) => {
              const number = String(index + 1).padStart(2, '0');
              return (
                <figure className="ak-team-card" key={member.id}>
                  <MemberPortrait member={member} number={number} key={member.photo} />
                  <figcaption>
                    <span className="ak-team-member-index" aria-hidden="true">
                      {number}
                    </span>
                    <div>
                      <h3>{member.name.trim() || `Anggota ${number}`}</h3>
                      <p>{member.role.trim() || 'Peran belum diisi'}</p>
                    </div>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </section>
      </main>
      <footer className="ak-about-footer ak-wrap">
        <Link className="ak-wordmark" to="/">
          Akademik<span>Kita.</span>
        </Link>
        <Link className="ak-text-action" to="/">
          Kembali ke beranda
        </Link>
      </footer>
    </div>
  );
}
