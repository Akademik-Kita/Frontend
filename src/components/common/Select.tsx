import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, id, className, children, ...rest },
  ref,
) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const describedBy = error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined;

  return (
    <div className={className}>
      <label htmlFor={selectId} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      <select
        ref={ref}
        id={selectId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cx(
          'h-12 w-full rounded-xl border bg-white px-4 text-base text-ink',
          'transition-colors hover:border-primary/60',
          'focus:border-primary focus:outline-2 focus:outline-offset-0 focus:outline-primary/30',
          'disabled:cursor-not-allowed disabled:bg-page disabled:text-muted',
          error ? 'border-danger' : 'border-line',
        )}
        {...rest}
      >
        {children}
      </select>
      {error ? (
        <p id={`${selectId}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${selectId}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
