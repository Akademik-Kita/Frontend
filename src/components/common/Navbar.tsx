import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from './Button';
import { cx } from '../../utils/cx';

const privateLinks = [
  { to: '/profile', label: 'Profil' },
  { to: '/interest-test', label: 'Tes Minat' },
  { to: '/interest-result', label: 'Hasil Tes' },
  { to: '/recommendations', label: 'Rekomendasi' },
  { to: '/compare', label: 'Bandingkan' },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cx(
    'rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
    isActive ? 'bg-lavender text-primary-dark' : 'text-ink hover:bg-lavender/60',
  );

export function Navbar() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/login');
  };

  return (
    <nav aria-label="Navigasi utama" className="border-b border-line bg-white">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-3 sm:px-6">
        <Link to={token ? '/profile' : '/login'} className="text-lg font-bold text-primary">
          AkademikKita
        </Link>

        {token ? (
          <>
            <div className="hidden items-center gap-1 lg:flex">
              {privateLinks.map((link) => (
                <NavLink key={link.to} to={link.to} className={linkClass}>
                  {link.label}
                </NavLink>
              ))}
            </div>
            <div className="hidden items-center gap-4 lg:flex">
              <span className="max-w-[180px] truncate text-sm font-semibold text-ink">
                {user?.full_name ?? 'Akunku'}
              </span>
              <Button variant="secondary" className="h-10" onClick={handleLogout}>
                Keluar
              </Button>
            </div>
            <Button
              variant="secondary"
              className="h-10 lg:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? 'Tutup' : 'Menu'}
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <NavLink to="/login" className={linkClass}>
              Masuk
            </NavLink>
            <NavLink to="/register" className={linkClass}>
              Daftar
            </NavLink>
          </div>
        )}
      </div>

      {token && open ? (
        <div id="menu-mobile" className="border-t border-line px-4 pb-4 pt-2 lg:hidden">
          <div className="flex flex-col gap-1">
            {privateLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass} onClick={() => setOpen(false)}>
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="truncate text-sm font-semibold text-ink">{user?.full_name ?? 'Akunku'}</span>
            <Button variant="secondary" className="h-10" onClick={handleLogout}>
              Keluar
            </Button>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
