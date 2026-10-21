import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/common/AuthLayout';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { useAuthStore } from '../store/authStore';
import type { UserRole } from '../types/auth';
import { getErrorMessage } from '../utils/errors';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

interface FieldErrors {
  full_name?: string;
  email?: string;
  password?: string;
}

export default function RegisterPage() {
  const register = useAuthStore((state) => state.register);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('siswa');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (token && !submitting) {
    return <Navigate to="/home" replace />;
  }

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!fullName.trim()) next.full_name = 'Nama lengkap wajib diisi.';
    if (!email.trim()) next.email = 'Email wajib diisi.';
    else if (!EMAIL_PATTERN.test(email.trim()))
      next.email = 'Format email belum benar, contoh: nama@email.com.';
    if (!password) next.password = 'Kata sandi wajib diisi.';
    else if (password.length < MIN_PASSWORD)
      next.password = `Kata sandi minimal ${MIN_PASSWORD} karakter.`;
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
      await register({ full_name: fullName.trim(), email: email.trim(), password, role });
      navigate('/home', { replace: true });
    } catch (error) {
      setApiError(getErrorMessage(error, 'Pendaftaran belum berhasil. Coba lagi.'));
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Buat akun"
      description="Cukup beberapa data. Profil lengkapnya diisi setelah masuk."
      footer={
        <>
          Sudah punya akun?{' '}
          <Link to="/login" className="font-semibold text-link hover:underline">
            Masuk
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
          label="Nama lengkap"
          autoComplete="name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          error={errors.full_name}
        />
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
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          hint={`Minimal ${MIN_PASSWORD} karakter.`}
        />
        <Select
          label="Aku mendaftar sebagai"
          value={role}
          onChange={(event) => setRole(event.target.value as UserRole)}
        >
          <option value="siswa">Siswa</option>
          <option value="orang_tua">Orang tua</option>
        </Select>
        <Button type="submit" fullWidth loading={submitting} loadingText="Membuat akun…">
          Daftar
        </Button>
      </form>
    </AuthLayout>
  );
}
