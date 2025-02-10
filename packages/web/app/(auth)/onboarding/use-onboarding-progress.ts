import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { useCallback } from 'react';
import { setOnboardingProgress } from '@/lib/actions/set-onboarding-progress';
import {
	ONBOARDING_COMPLETED,
	OnboardingStep,
} from '@/lib/types/entities/onboarding';

export function useOnboardingProgress() {
	const router = useRouter();

	const { executeAsync, isExecuting, hasSucceeded } = useAction(
		setOnboardingProgress,
		{
			onSuccess() {
				console.log('Onboarding step updated');
			},
			onError({ error }) {
				toast.error('Ops, ocorreu uma falha. Tente outra vez');
				console.error('Failed to update onboarding progress', error);
			},
		},
	);

	const continueTo = useCallback(
		async (step: OnboardingStep, extras: Record<string, string> = {}) => {
			let query = '';
			if (Object.keys(extras).length > 0) {
				query += `?`;
				query += new URLSearchParams(extras).toString();
			}

			await executeAsync({ onboardingStep: step });
			router.push(`/onboarding/${step}${query}`);
		},
		[executeAsync, router],
	);

	const finish = useCallback(async () => {
		await executeAsync({ onboardingStep: ONBOARDING_COMPLETED });
		router.push(`/dashboard`);
	}, [executeAsync, router]);

	return {
		continueTo,
		finish,
		isLoading: isExecuting,
		isSuccessful: hasSucceeded,
	};
}
