import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/common/AppLayout';
import { EmptyState } from './components/common/EmptyState';
import { PageHeader } from './components/common/PageHeader';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import InterestResultPage from './pages/InterestResultPage';
import InterestTestPage from './pages/InterestTestPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import { useAuthStore } from './store/authStore';

/*
 * Routing utama dikelola satu integrator (lihat brief, Bagian D).
 * Halaman Frontend 2 belum ada di branch ini, jadi tiga route di bawah memakai
 * placeholder. Saat PR Frontend 2 masuk, ganti elemen placeholder dengan:
 *   /recommendations -> RecommendationPage (login)
 *   /schools/:id     -> SchoolDetailPage   (publik atau login)
 *   /compare         -> CompareSchoolsPage (login pada versi awal)
 */
function Pending({ title }: { title: string }) {
  return (
    <div className="space-y-12">
      <PageHeader title={title} />
      <EmptyState title="Halaman ini belum tersedia" description="Halaman ini sedang disiapkan oleh tim lain." />
    </div>
  );
}

export default function App() {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<AppLayout />}>
          <Route path="/schools/:id" element={<Pending title="Detail SMA" />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/interest-test" element={<InterestTestPage />} />
            <Route path="/interest-result" element={<InterestResultPage />} />
            <Route path="/recommendations" element={<Pending title="Rekomendasi SMA" />} />
            <Route path="/compare" element={<Pending title="Bandingkan SMA" />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/profile" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
