import { request } from './api';
import type { GenerateRecommendationPayload, RecommendationResponse, Recommendation, WeightMap } from '../types/recommendation';

const backendToFrontendWeight = {
  akademik: 'academic',
  minat: 'interest',
  peluang: 'chance',
  jarak: 'distance',
  biaya: 'cost',
} as const;

type BackendWeights = Record<keyof typeof backendToFrontendWeight, number>;

function normalizeWeights(raw: unknown): WeightMap | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const source = raw as Record<string, unknown>;
  const normalized = {} as WeightMap;
  for (const [backendKey, frontendKey] of Object.entries(backendToFrontendWeight)) {
    const value = source[backendKey] ?? source[frontendKey];
    if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
    normalized[frontendKey] = value;
  }
  return normalized;
}

function normalizeRecommendation(item: Recommendation): Recommendation {
  const rawScores = (item.score_breakdown ?? {}) as Record<string, number | undefined>;
  const score_breakdown = {
    academic: rawScores.academic ?? rawScores.akademik,
    interest: rawScores.interest ?? rawScores.minat,
    chance: rawScores.chance ?? rawScores.peluang,
    distance: rawScores.distance ?? rawScores.jarak,
    cost: rawScores.cost ?? rawScores.biaya,
  };
  return { ...item, score_breakdown };
}

function normalizeResponse(raw: unknown): RecommendationResponse {
  if (Array.isArray(raw)) return { recommendations: raw.map(normalizeRecommendation) };
  if (raw && typeof raw === 'object') {
    const value = raw as Partial<RecommendationResponse> & {
      items?: Recommendation[];
      data?: Recommendation[];
      weights?: BackendWeights | WeightMap;
    };
    const rows = value.recommendations ?? value.items ?? value.data ?? [];
    return {
      ...value,
      recommendations: rows.map(normalizeRecommendation),
      weights: normalizeWeights(value.weights),
    };
  }
  return { recommendations: [] };
}

function toBackendWeights(weights: WeightMap): BackendWeights {
  return {
    akademik: weights.academic,
    minat: weights.interest,
    peluang: weights.chance,
    jarak: weights.distance,
    biaya: weights.cost,
  };
}

export async function generateRecommendations(
  payload: GenerateRecommendationPayload,
): Promise<RecommendationResponse> {
  const raw = await request<unknown>({
    method: 'POST',
    url: '/recommendations/generate',
    data: { weights: toBackendWeights(payload.weights) },
  });
  return normalizeResponse(raw);
}

export async function getLatestRecommendations(): Promise<RecommendationResponse> {
  const raw = await request<unknown>({ method: 'GET', url: '/recommendations/latest' });
  return normalizeResponse(raw);
}
