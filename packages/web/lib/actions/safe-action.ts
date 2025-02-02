import { createSafeActionClient } from 'next-safe-action';
import { getSession } from '@/lib/auth/helpers';

export const actionClient = createSafeActionClient({
	handleServerError(error) {
		if (error instanceof Error) {
			return {
				serverError: error.message,
			};
		}

		return {
			serverError: 'An unknown error occurred.',
		};
	},
});

export const authActionClient = actionClient.use(async ({ next }) => {
	const user = await getSession();
	if (!user?.id) {
		throw new Error('Unauthorized: Login requred.');
	}

	return next({
		ctx: {
			user,
		},
	});
});
