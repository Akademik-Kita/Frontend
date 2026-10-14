import { Button } from './Button';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  title?: string;
}

export function ErrorState({ message, onRetry, title = 'Data belum bisa dimuat' }: ErrorStateProps) {
  return (
    <div role="alert" className="rounded-2xl border border-danger/30 bg-dangersoft px-6 py-10 text-center">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-danger">{message}</p>
      {onRetry ? (
        <div className="mt-6 flex justify-center">
          <Button variant="secondary" onClick={onRetry}>
            Coba lagi
          </Button>
        </div>
      ) : null}
    </div>
  );
}
