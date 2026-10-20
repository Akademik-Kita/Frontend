import { useEffect, useState } from 'react';
import { ApiError } from '../services/api';
import {
  getLatestInterestAssessment,
  getProfile,
  listAcademicRecords,
} from '../services/profileService';
import { getLatestRecommendations } from '../services/recommendationService';
import type { AcademicRecord, InterestAssessment, Profile } from '../types/profile';
import type { RecommendationResponse } from '../types/recommendation';
import { getErrorMessage } from '../utils/errors';

export interface StudentOverview {
  profile: Profile | null;
  records: AcademicRecord[];
  assessment: InterestAssessment | null;
  latest: RecommendationResponse;
}

type OverviewState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: StudentOverview };

async function latestOrEmpty(): Promise<RecommendationResponse> {
  try {
    return await getLatestRecommendations();
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return { recommendations: [] };
    throw error;
  }
}

export function useStudentOverview() {
  const [state, setState] = useState<OverviewState>({ status: 'loading' });
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });

    void Promise.all([
      getProfile(),
      listAcademicRecords(),
      getLatestInterestAssessment(),
      latestOrEmpty(),
    ]).then(
      ([profile, records, assessment, latest]) => {
        if (active) setState({ status: 'ready', data: { profile, records, assessment, latest } });
      },
      (error: unknown) => {
        if (active) setState({ status: 'error', message: getErrorMessage(error) });
      },
    );

    return () => {
      active = false;
    };
  }, [revision]);

  return { ...state, retry: () => setRevision((value) => value + 1) };
}
