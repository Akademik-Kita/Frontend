import { useState } from 'react';
import { Button } from './Button';

interface ConfirmDeleteProps {
  onConfirm: () => void | Promise<void>;
  busy?: boolean;
  /** Dibaca pembaca layar, mis. "nilai Matematika kelas 7". */
  subject: string;
}

/** Hapus dua langkah supaya data tidak hilang karena salah tekan. */
export function ConfirmDelete({ onConfirm, busy = false, subject }: ConfirmDeleteProps) {
  const [asking, setAsking] = useState(false);

  if (!asking) {
    return (
      <Button variant="ghost" className="h-9 px-3" onClick={() => setAsking(true)} aria-label={`Hapus ${subject}`}>
        Hapus
      </Button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2" role="group" aria-label={`Konfirmasi hapus ${subject}`}>
      <Button
        variant="danger"
        className="h-9 px-3"
        loading={busy}
        loadingText="Menghapus…"
        onClick={async () => {
          await onConfirm();
          setAsking(false);
        }}
      >
        Ya, hapus
      </Button>
      <Button variant="ghost" className="h-9 px-3" disabled={busy} onClick={() => setAsking(false)}>
        Batal
      </Button>
    </span>
  );
}
