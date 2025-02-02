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

	const { executeAsync, execute, isExecuting, hasSucceeded } = useAction(
		setOnboardingProgress,
		{
			onSuccess() {},
			onError({ error }) {
				toast.error('Ops, ocorreu uma falha. Tente outra vez');
				console.error('Failed to update onboarding progress', error);
			},
		},
	);

	const continueTo = useCallback(
		async (step: OnboardingStep) => {
			execute({ onboardingStep: step });
			router.push(`/onboarding/${step}`);
		},
		[execute, router],
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
