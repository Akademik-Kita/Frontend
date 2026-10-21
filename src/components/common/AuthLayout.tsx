import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

const steps = [
  'Isi profil dan nilai rapormu',
  'Kerjakan tes minat, 12 pertanyaan',
  'Lihat SMA yang cocok untukmu',
];

export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-page lg:grid lg:grid-cols-2">
      <aside className="hidden bg-lavender px-12 py-16 lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="text-xl font-bold text-link">
          AkademikKita
        </Link>
        <div className="max-w-md">
          <p className="text-4xl font-bold leading-tight text-ink">Pilih SMA yang pas untukmu.</p>
          <p className="mt-4 text-base text-muted">
            AkademikKita membantu siswa SMP membandingkan sekolah dari nilai, minat, jarak, dan biaya.
          </p>
          <ol className="mt-10 space-y-4">
            {steps.map((step, index) => (
              <li key={step} className="flex items-baseline gap-4 text-base font-semibold text-ink">
                <span className="w-6 text-link">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <p className="text-sm text-muted">Untuk siswa SMP/MTs dan orang tua.</p>
      </aside>

      <main className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between gap-4">
            <Link to="/" className="block text-xl font-bold text-link lg:hidden">
              AkademikKita
            </Link>
            <div className="ml-auto"><ThemeToggle /></div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">{title}</h1>
          <p className="mt-3 text-base text-muted">{description}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 text-center text-sm text-muted">{footer}</div>
        </div>
      </main>
    </div>
  );
}
