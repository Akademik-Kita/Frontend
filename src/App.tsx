import { lazy, Suspense, useEffect, useLayoutEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppLayout } from './components/common/AppLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import HomePage from './pages/HomePage';

const InterestResultPage = lazy(() => import('./pages/InterestResultPage'));
const InterestTestPage = lazy(() => import('./pages/InterestTestPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const RecommendationPage = lazy(() => import('./pages/RecommendationPage'));
const SchoolDetailPage = lazy(() => import('./pages/SchoolDetailPage'));
const CompareSchoolsPage = lazy(() => import('./pages/CompareSchoolsPage'));
const StudentHomePage = lazy(() => import('./pages/StudentHomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

function RouteScrollReset() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function App() {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <BrowserRouter>
      <RouteScrollReset />
      <Suspense
        fallback={
          <p role="status" className="p-8 text-center text-muted">
            Memuat halaman…
          </p>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<StudentHomePage />} />
          </Route>

          <Route element={<AppLayout />}>
            <Route path="/schools/:id" element={<SchoolDetailPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/interest-test" element={<InterestTestPage />} />
              <Route path="/interest-result" element={<InterestResultPage />} />
              <Route path="/recommendations" element={<RecommendationPage />} />
              <Route path="/compare" element={<CompareSchoolsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/profile" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
