import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: 'white' | 'lavender' | 'yellow' | 'green';
  /** Tanpa padding, untuk kartu berisi daftar yang mengatur jaraknya sendiri. */
  flush?: boolean;
}

const tones = {
  white: 'bg-surface border-line',
  lavender: 'bg-lavender border-lavender',
  yellow: 'bg-softyellow border-softyellow',
  green: 'bg-softgreen border-softgreen',
};

export function Card({ tone = 'white', flush = false, className, children, ...rest }: CardProps) {
  return (
    <div
      className={cx(
        'rounded-2xl border shadow-[0_1px_3px_rgba(37,43,66,0.06)]',
        !flush && 'p-6 sm:p-8',
        tones[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
