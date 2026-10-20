import type { Id, School } from './school';

export type WeightKey = 'academic' | 'interest' | 'chance' | 'distance' | 'cost';
export type WeightMap = Record<WeightKey, number>;

export interface ScoreBreakdown {
  academic?: number;
  interest?: number;
  chance?: number;
  distance?: number;
  cost?: number;
  [key: string]: number | undefined;
}

export interface RecommendationExplanation {
  positive: string[] | string;
  negative: string[] | string;
}

export interface Recommendation {
  school_id: Id;
  school_name: string;
  jurusan_id: Id;
  jurusan_name: string;
  rank: number;
  total_score: number;
  score_breakdown: ScoreBreakdown;
  chance_low: number;
  chance_high: number;
  category: 'ambisius' | 'realistis' | 'aman' | string;
  explanation: RecommendationExplanation;
  school?: School;
}

export interface GenerateRecommendationPayload {
  weights: WeightMap;
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
  generated_at?: string;
  weights?: WeightMap;
}
