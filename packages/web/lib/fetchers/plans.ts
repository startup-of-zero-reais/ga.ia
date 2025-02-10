import { API_DOMAIN } from '@/lib/constants/main';
import { authFetch } from '@/lib/functions/auth-fetcher';
import { Plan } from '@/lib/types/entities/plan';

const BASE_URL = `${API_DOMAIN}/v1/plans`;

interface FetchPlansParams {
	name?: string;
}

export async function fetchPlans({ name }: FetchPlansParams = {}) {
	const urlQuery = new URLSearchParams({ rel: 'plan_features' });
	if (name) {
		urlQuery.set('name', name);
	}

	return authFetch<Plan[]>(`${BASE_URL}/?${urlQuery}`);
}
