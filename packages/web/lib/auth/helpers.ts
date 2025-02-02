'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/middleware/helpers/auth';
import { HOME_DOMAIN } from '@/lib/constants/main';

export const getSession = async () => {
	const cookieStore = await cookies();
	const apiClient = createServerClient({
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach((cookie) => {
					cookieStore.set(cookie.name, cookie.value, cookie.options);
				});
			},
		},
	});

	const { user, error } = await apiClient.auth.getUser();

	if (error) {
		console.log('get session failed', error);
		return;
	}

	return user;
};

export const getLoggedUser = async () => {
	const user = await getSession();
	if (!user) {
		redirect(HOME_DOMAIN);
	}

	return user;
};
