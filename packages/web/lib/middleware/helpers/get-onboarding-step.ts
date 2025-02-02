import { API_DOMAIN } from '@/lib/constants/main';
import { simpleAuthFetch } from '@/lib/functions/auth-fetcher';
import {
	ONBOARDING_STEPS,
	OnboardingStep,
} from '@/lib/types/entities/onboarding';

export async function getOnboardingStep(token?: string) {
	if (!token) {
		return null;
	}

	const step = await simpleAuthFetch<string>(`${API_DOMAIN}/v1/onboarding`);
	console.log({ step });
	if (!step) {
		return ONBOARDING_STEPS[0];
	}

	return step as OnboardingStep;
}
