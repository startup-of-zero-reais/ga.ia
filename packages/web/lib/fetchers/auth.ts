import { API_DOMAIN } from '@/lib/constants/main';
import { authFetch } from '@/lib/functions/auth-fetcher';
import { User } from '@/lib/types/entities/user';

export async function fetchMe() {
	return authFetch<User>(`${API_DOMAIN}/v1/auth/me`);
}
