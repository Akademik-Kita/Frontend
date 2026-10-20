import { SCALE_LABELS, type InterestQuestionItem } from '../../config/interestInstrument';
import { cx } from '../../utils/cx';

interface InterestQuestionProps {
  question: InterestQuestionItem;
  value: number | undefined;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function InterestQuestion({ question, value, onChange, disabled = false }: InterestQuestionProps) {
  const legendId = `pertanyaan-${question.id}`;

  return (
    <fieldset disabled={disabled} className="min-w-0">
      <legend id={legendId} className="text-xl font-semibold leading-snug text-ink sm:text-2xl">
        {question.text}
      </legend>

      <div className="mt-8 grid gap-3 sm:grid-cols-5">
        {[1, 2, 3, 4, 5].map((option) => {
          const selected = value === option;
          return (
            <label
              key={option}
              className={cx(
                'flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors',
                'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary',
                'sm:min-h-24 sm:flex-col sm:justify-center sm:gap-2 sm:px-2 sm:text-center',
                selected
                  ? 'border-primary bg-primary text-white'
                  : 'border-line bg-white text-ink hover:border-primary hover:bg-lavender',
                disabled && 'cursor-not-allowed opacity-60',
              )}
            >
              <input
                type="radio"
                name={`jawaban-${question.id}`}
                value={option}
                checked={selected}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              <span className="text-lg font-bold">{option}</span>
              <span className="text-xs font-medium sm:text-xs">{SCALE_LABELS[option]}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
