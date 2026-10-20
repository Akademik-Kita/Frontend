import { cx } from '../../utils/cx';

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cx('animate-pulse rounded-xl bg-line', className)} />;
}

interface LoadingStateProps {
  /** Jumlah baris placeholder. */
  rows?: number;
  label?: string;
}

export function LoadingState({ rows = 3, label = 'Memuat data…' }: LoadingStateProps) {
  return (
    <div role="status" aria-live="polite" className="rounded-2xl border border-line bg-white p-6 sm:p-8">
      <span className="sr-only">{label}</span>
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/3" />
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className={index % 2 === 0 ? 'h-12 w-full' : 'h-12 w-5/6'} />
        ))}
      </div>
    </div>
  );
}
