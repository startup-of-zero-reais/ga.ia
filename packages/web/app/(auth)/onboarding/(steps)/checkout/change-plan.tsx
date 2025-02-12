'use client';

import { useCallback } from 'react';
import { FREE_PLAN_NAME, PLAN_PRICING } from '@/lib/constants/plans';
import { Button, ButtonProps } from '@/components/ui/button';
import { useOnboardingProgress } from '@/app/(auth)/onboarding/use-onboarding-progress';

interface ChangePlanButtonProps extends ButtonProps {
	plan: keyof typeof PLAN_PRICING;
	children?: React.ReactNode;
}

export default function ChangePlanButton({
	children,
	plan,
	...buttonProps
}: ChangePlanButtonProps) {
	const { continueTo, finish } = useOnboardingProgress();

	const handleChangePlan = useCallback(() => {
		if (plan === FREE_PLAN_NAME) {
			return finish();
		}

		return continueTo('checkout', { plan });
	}, [continueTo, finish, plan]);

	return (
		<Button onClick={handleChangePlan} {...buttonProps}>
			{children}
		</Button>
	);
}
