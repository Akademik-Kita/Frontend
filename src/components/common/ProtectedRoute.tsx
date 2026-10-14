import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LoadingState } from './LoadingState';

export function ProtectedRoute() {
  const token = useAuthStore((state) => state.token);
  const initialized = useAuthStore((state) => state.initialized);
  const location = useLocation();

  if (!initialized) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
        <LoadingState rows={2} label="Memeriksa sesimu…" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
