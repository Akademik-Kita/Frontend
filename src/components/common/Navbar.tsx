import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import './Navbar.css';

const memberLinks = [
  { to: '/home', label: 'Home' },
  { to: '/profile', label: 'Profil' },
  { to: '/interest-test', label: 'Tes minat' },
  { to: '/interest-result', label: 'Hasil tes' },
  { to: '/recommendations', label: 'Rekomendasi' },
  { to: '/compare', label: 'Bandingkan' },
  { to: '/about', label: 'About us' },
];

export function Navbar({ variant = 'app' }: { variant?: 'landing' | 'public' | 'app' }) {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  const accountAction = () => {
    logout();
    setOpen(false);
    navigate('/login');
  };
  const links =
    variant === 'landing'
      ? [
          { to: '#alur', label: 'Cara memilih' },
          { to: '#pertimbangan', label: 'Pertimbangan' },
          { to: '/about', label: 'About us' },
        ]
      : variant === 'public'
        ? [
            { to: '/', label: 'Beranda' },
            { to: '/about', label: 'About us' },
          ]
        : memberLinks;
  const renderLinks = () =>
    links.map(({ to, label }) =>
      to.startsWith('#') ? (
        <a key={to} href={to} onClick={() => setOpen(false)}>
          {label}
        </a>
      ) : (
        <NavLink key={to} to={to} onClick={() => setOpen(false)}>
          {label}
        </NavLink>
      ),
    );
  const account =
    token && variant === 'app' ? (
      <button type="button" className="ak-nav-account" onClick={accountAction}>
        Keluar
      </button>
    ) : (
      <Link
        className="ak-nav-account"
        to={token ? '/home' : '/login'}
        onClick={() => setOpen(false)}
      >
        {token ? 'Home saya' : 'Masuk'}
      </Link>
    );

  return (
    <header className="ak-nav">
      <div className="ak-nav-inner">
        {variant === 'landing' ? (
          <a className="ak-wordmark" href="#beranda">
            Akademik<span>Kita.</span>
          </a>
        ) : (
          <Link className="ak-wordmark" to={token ? '/home' : '/'}>
            Akademik<span>Kita.</span>
          </Link>
        )}
        <nav className="ak-nav-desktop" aria-label="Navigasi utama">
          {renderLinks()}
        </nav>
        <div className="ak-nav-actions">
          {account}
          <button
            ref={menuButton}
            className="ak-nav-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="ak-mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? 'Tutup' : 'Menu'}
            <span aria-hidden="true">{open ? '−' : '+'}</span>
          </button>
        </div>
      </div>
      {open && (
        <nav id="ak-mobile-menu" className="ak-nav-mobile" aria-label="Navigasi ponsel">
          {renderLinks()}
        </nav>
      )}
    </header>
  );
}
