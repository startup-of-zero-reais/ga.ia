'use server';

import { z } from 'zod';
import { API_DOMAIN } from '@/lib/constants/main';
import { authFetch } from '@/lib/functions/auth-fetcher';
import { authActionClient } from './safe-action';

export const createInstanceAction = authActionClient
	.schema(
		z.object({
			instanceName: z.string().min(3),
			token: z.string().min(36),
			number: z.string().optional(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const { token, instanceName, number } = parsedInput;

		const response = await authFetch(`${API_DOMAIN}/v1/wpp/instance`, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({
				name: instanceName.trim(),
				token: token.trim(),
				number: number?.trim(),
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		console.log('response', response);

		return { success: true };
	});
