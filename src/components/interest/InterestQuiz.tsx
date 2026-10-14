import { useState } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { InterestQuestion } from './InterestQuestion';
import { QUESTIONS, isComplete, type Answers } from '../../config/interestInstrument';

interface InterestQuizProps {
  /** Dipanggil setelah semua 12 pertanyaan terjawab. Lempar error kalau penyimpanan gagal; jawaban tetap aman. */
  onFinish: (answers: Answers) => Promise<void>;
  submitting: boolean;
  error: string | null;
}

export function InterestQuiz({ onFinish, submitting, error }: InterestQuizProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const total = QUESTIONS.length;
  const question = QUESTIONS[index];
  const answered = Object.keys(answers).length;
  const isLast = index === total - 1;
  const current = answers[question.id];
  const percent = Math.round((index / total) * 100);

  const choose = (value: number) => {
    setAnswers((previous) => ({ ...previous, [question.id]: value }));
  };

  const finish = async () => {
    if (!isComplete(answers) || submitting) return;
    try {
      await onFinish(answers);
    } catch {
      /* pesan error ditampilkan oleh halaman lewat prop `error`; jawaban tidak dihapus */
    }
  };

  return (
    <Card className="space-y-10">
      <div>
        <div className="flex items-baseline justify-between gap-4 text-sm font-semibold text-muted">
          <span>
            Pertanyaan {index + 1} dari {total}
          </span>
          <span>{answered} terjawab</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={index + 1}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-label="Kemajuan tes minat"
          className="mt-3 h-3 w-full overflow-hidden rounded-full bg-lavender"
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${Math.max(percent, 4)}%` }}
          />
        </div>
      </div>

      <div key={question.id} className="step-in">
        <InterestQuestion question={question} value={current} onChange={choose} disabled={submitting} />
      </div>

      {error ? (
        <div role="alert" className="rounded-xl bg-dangersoft px-4 py-3 text-sm text-danger">
          {error} Jawabanmu masih tersimpan di halaman ini, jadi kamu bisa menekan tombol lagi.
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-4">
        <Button
          variant="secondary"
          disabled={index === 0 || submitting}
          onClick={() => setIndex((value) => Math.max(0, value - 1))}
        >
          Sebelumnya
        </Button>

        {isLast ? (
          <Button
            disabled={!isComplete(answers)}
            loading={submitting}
            loadingText="Menyimpan hasil…"
            onClick={() => void finish()}
          >
            Lihat hasil
          </Button>
        ) : (
          <Button disabled={current === undefined} onClick={() => setIndex((value) => Math.min(total - 1, value + 1))}>
            Berikutnya
          </Button>
        )}
      </div>

      {isLast && !isComplete(answers) ? (
        <p className="text-center text-sm text-muted">
          Masih ada pertanyaan yang belum dijawab. Tekan Sebelumnya untuk melengkapinya.
        </p>
      ) : null}
    </Card>
  );
}
