import type { InterestDimension, InterestScores } from '../types/profile';

/*
 * Instrumen RIASEC-lite. Pemetaan pertanyaan ke dimensi dan arah skor ada di sini
 * dan perlu disetujui tim sebelum dipakai (brief meminta ini diputuskan dulu).
 *
 * Susunan: 2 pertanyaan per dimensi. Satu pernyataan positif, satu pernyataan negatif
 * (reverse: true). Jawaban pernyataan negatif dibalik: nilai efektif = 6 - jawaban.
 * Skor dimensi = ((rata-rata nilai efektif - 1) / 4) * 100, dibulatkan ke bilangan bulat 0–100.
 */
export const INSTRUMENT_VERSION = 'riasec-lite-v1';

export const SCALE_LABELS: Record<number, string> = {
  1: 'Sangat tidak setuju',
  2: 'Tidak setuju',
  3: 'Biasa saja',
  4: 'Setuju',
  5: 'Sangat setuju',
};

export interface DimensionInfo {
  key: InterestDimension;
  label: string;
  description: string;
}

/** Urutan ini dipakai untuk sumbu radar chart. */
export const DIMENSIONS: DimensionInfo[] = [
  { key: 'realistic', label: 'Realistis', description: 'Suka kegiatan praktik: merakit, memperbaiki, dan memakai alat.' },
  { key: 'investigative', label: 'Investigatif', description: 'Suka mencari tahu penyebab, meneliti, dan memecahkan soal sulit.' },
  { key: 'artistic', label: 'Artistik', description: 'Suka berkarya lewat gambar, tulisan, musik, atau desain.' },
  { key: 'social', label: 'Sosial', description: 'Suka membantu, mengajari, dan bekerja bersama orang lain.' },
  { key: 'enterprising', label: 'Wirausaha', description: 'Suka memimpin, mengajak orang, dan mencoba ide baru.' },
  { key: 'conventional', label: 'Konvensional', description: 'Suka hal yang rapi, teratur, dan punya aturan yang jelas.' },
];

export interface InterestQuestionItem {
  id: number;
  text: string;
  dimension: InterestDimension;
  reverse: boolean;
}

export const QUESTIONS: InterestQuestionItem[] = [
  { id: 1, dimension: 'realistic', reverse: false, text: 'Aku senang memperbaiki atau merakit sesuatu, misalnya sepeda atau mainan.' },
  { id: 2, dimension: 'social', reverse: false, text: 'Aku senang membantu teman yang kesulitan memahami pelajaran.' },
  { id: 3, dimension: 'artistic', reverse: true, text: 'Aku jarang tertarik membuat gambar, tulisan, atau musik sendiri.' },
  { id: 4, dimension: 'investigative', reverse: false, text: 'Aku penasaran mencari tahu kenapa sesuatu bisa terjadi, misalnya kenapa tanaman layu.' },
  { id: 5, dimension: 'conventional', reverse: false, text: 'Aku suka merapikan catatan dan jadwal supaya semuanya teratur.' },
  { id: 6, dimension: 'enterprising', reverse: false, text: 'Aku suka memimpin kelompok atau mengajak teman ikut suatu kegiatan.' },
  { id: 7, dimension: 'realistic', reverse: true, text: 'Aku lebih suka tidak menyentuh alat atau mesin sama sekali.' },
  { id: 8, dimension: 'investigative', reverse: true, text: 'Aku malas mengerjakan soal yang butuh banyak berpikir.' },
  { id: 9, dimension: 'artistic', reverse: false, text: 'Aku senang menggambar, menulis cerita, atau bermain musik.' },
  { id: 10, dimension: 'social', reverse: true, text: 'Aku lebih nyaman mengerjakan semuanya sendirian daripada membantu orang lain.' },
  { id: 11, dimension: 'enterprising', reverse: true, text: 'Aku tidak suka menjadi orang yang memutuskan sesuatu untuk kelompok.' },
  { id: 12, dimension: 'conventional', reverse: true, text: 'Aku tidak peduli kalau catatan atau barangku berantakan.' },
];

export type Answers = Record<number, number>;

export function isComplete(answers: Answers): boolean {
  return QUESTIONS.every((question) => {
    const value = answers[question.id];
    return Number.isInteger(value) && value >= 1 && value <= 5;
  });
}

export function calculateScores(answers: Answers): InterestScores {
  if (!isComplete(answers)) {
    throw new Error('Semua pertanyaan harus dijawab sebelum skor dihitung.');
  }

  const scores = {} as InterestScores;
  for (const dimension of DIMENSIONS) {
    const items = QUESTIONS.filter((question) => question.dimension === dimension.key);
    const effective = items.map((question) => (question.reverse ? 6 - answers[question.id] : answers[question.id]));
    const mean = effective.reduce((sum, value) => sum + value, 0) / effective.length;
    scores[dimension.key] = Math.round(((mean - 1) / 4) * 100);
  }
  return scores;
}
