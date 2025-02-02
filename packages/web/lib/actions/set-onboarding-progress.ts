'use server';

import { z } from 'zod';
import { API_DOMAIN } from '@/lib/constants/main';
import { ONBOARDING_STEPS } from '@/lib/types/entities/onboarding';
import { authFetch } from '@/lib/functions/auth-fetcher';
import { authActionClient } from './safe-action';

export const setOnboardingProgress = authActionClient
	.schema(z.object({ onboardingStep: z.enum(ONBOARDING_STEPS).nullable() }))
	.action(async ({ parsedInput }) => {
		const { onboardingStep } = parsedInput;

		await authFetch(`${API_DOMAIN}/v1/onboarding?path=${onboardingStep}`, {
			method: 'POST',
			credentials: 'include',
		});

		return { success: true };
	});
