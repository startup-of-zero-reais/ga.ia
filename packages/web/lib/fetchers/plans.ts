import { API_DOMAIN } from '@/lib/constants/main';
import { authFetch } from '@/lib/functions/auth-fetcher';
import { Plan } from '@/lib/types/entities/plan';

const BASE_URL = `${API_DOMAIN}/v1/plans`;

export async function fetchPlans() {
	return authFetch<Plan[]>(`${BASE_URL}/?rel=plan_features`);
}
