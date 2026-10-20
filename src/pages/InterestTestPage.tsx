import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { PageHeader } from '../components/common/PageHeader';
import { InterestQuiz } from '../components/interest/InterestQuiz';
import { INSTRUMENT_VERSION, QUESTIONS, calculateScores, type Answers } from '../config/interestInstrument';
import { saveInterestAssessment } from '../services/profileService';
import { getErrorMessage } from '../utils/errors';

export default function InterestTestPage() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFinish = async (answers: Answers) => {
    setSubmitting(true);
    setError(null);
    try {
      await saveInterestAssessment({
        instrument_version: INSTRUMENT_VERSION,
        scores: calculateScores(answers),
      });
      navigate('/interest-result');
    } catch (err) {
      setError(getErrorMessage(err, 'Hasil tes belum tersimpan.'));
      setSubmitting(false);
      throw err;
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-12">
      <PageHeader
        title="Tes minat"
        description="Tes ini membantu melihat kegiatan apa yang kamu suka, supaya rekomendasi SMA lebih cocok."
      />

      {started ? (
        <InterestQuiz onFinish={handleFinish} submitting={submitting} error={error} />
      ) : (
        <Card tone="lavender" className="space-y-8">
          <ul className="space-y-3 text-base text-ink">
            <li>{QUESTIONS.length} pertanyaan, sekitar 3 menit.</li>
            <li>Tidak ada jawaban benar atau salah. Pilih yang paling mirip dengan dirimu.</li>
            <li>Kamu bisa kembali ke pertanyaan sebelumnya untuk mengubah jawaban.</li>
          </ul>
          <Button onClick={() => setStarted(true)}>Mulai tes</Button>
        </Card>
      )}
    </div>
  );
}
