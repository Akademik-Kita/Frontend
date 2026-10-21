import { useState } from 'react';
import './ThemeToggle.css';

export function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === 'dark');

  const toggle = () => {
    const next = !dark;
    const theme = next ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    setDark(next);
    try {
      localStorage.setItem('akademikkita-theme', theme);
    } catch {
      // Tema tetap bisa diganti ketika browser memblokir penyimpanan.
    }
  };

  return (
    <button type="button" role="switch" aria-checked={dark} aria-label="Mode gelap"
      title={dark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
      className="ak-theme-toggle" onClick={toggle}>
      <span className="ak-theme-label">Mode gelap</span>
      <span className="ak-theme-track" aria-hidden="true"><span className="ak-theme-thumb" /></span>
    </button>
  );
}
