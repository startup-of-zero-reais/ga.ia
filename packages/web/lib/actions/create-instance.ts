'use server';

import { z } from 'zod';
import { fetcher } from '@/lib/functions/fetcher';
import { EVO_API_DOMAIN, EVO_API_KEY } from '@/lib/constants/main';
import { authActionClient } from './safe-action';

export const createInstanceAction = authActionClient
	.schema(
		z.object({
			instanceName: z.string().min(3),
			token: z.string().min(36),
		}),
	)
	.action(async ({ parsedInput }) => {
		const { token, instanceName } = parsedInput;

		console.log(EVO_API_DOMAIN, parsedInput);

		const response = await fetcher(`${EVO_API_DOMAIN}/instance/create`, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({
				instanceName: instanceName.trim(),
				token: token.trim(),
				integration: 'WHATSAPP-BAILEYS',
			}),
			headers: {
				'Content-Type': 'application/json',
				Apikey: EVO_API_KEY,
			},
		});

		console.log('response', response);

		return { success: true };
	});
