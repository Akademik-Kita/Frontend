import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-page">
      <Navbar />
      <main className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
