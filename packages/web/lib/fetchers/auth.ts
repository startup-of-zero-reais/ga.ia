import { API_DOMAIN } from '@/lib/constants/main';
import { authFetch } from '@/lib/functions/auth-fetcher';

export async function fetchMe() {
	return authFetch(`${API_DOMAIN}/v1/auth/me`);
}
