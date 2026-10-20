import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, id, className, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cx(
          'h-12 w-full rounded-xl border bg-white px-4 text-base text-ink placeholder:text-muted/70',
          'transition-colors hover:border-primary/60',
          'focus:border-primary focus:outline-2 focus:outline-offset-0 focus:outline-primary/30',
          'disabled:cursor-not-allowed disabled:bg-page disabled:text-muted',
          error ? 'border-danger' : 'border-line',
        )}
        {...rest}
      />
      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
