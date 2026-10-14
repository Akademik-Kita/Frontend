import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/common/AuthLayout';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuthStore } from '../store/authStore';
import { getErrorMessage } from '../utils/errors';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FieldErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/profile';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (token && !submitting) {
    return <Navigate to={redirectTo} replace />;
  }

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!email.trim()) next.email = 'Email wajib diisi.';
    else if (!EMAIL_PATTERN.test(email.trim())) next.email = 'Format email belum benar, contoh: nama@email.com.';
    if (!password) next.password = 'Kata sandi wajib diisi.';
    return next;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    const next = validate();
    setErrors(next);
    setApiError(null);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setApiError(getErrorMessage(error, 'Email atau kata sandi belum cocok.'));
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Masuk"
      description="Lanjutkan mengisi profil dan melihat rekomendasi SMA-mu."
      footer={
        <>
          Belum punya akun?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Daftar di sini
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {apiError ? (
          <div role="alert" className="rounded-xl bg-dangersoft px-4 py-3 text-sm text-danger">
            {apiError}
          </div>
        ) : null}
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
          placeholder="nama@email.com"
        />
        <Input
          label="Kata sandi"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
        />
        <Button type="submit" fullWidth loading={submitting} loadingText="Sedang masuk…">
          Masuk
        </Button>
      </form>
    </AuthLayout>
  );
}
