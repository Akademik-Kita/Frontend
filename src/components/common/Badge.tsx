import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';

type Tone = 'lavender' | 'yellow' | 'green' | 'neutral' | 'error';

const tones: Record<Tone, string> = {
  lavender: 'bg-lavender text-link',
  yellow: 'bg-softyellow text-ink',
  green: 'bg-softgreen text-ink',
  neutral: 'bg-surface text-muted border border-line',
  error: 'bg-dangersoft text-danger',
};

export function Badge({ tone = 'lavender', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
