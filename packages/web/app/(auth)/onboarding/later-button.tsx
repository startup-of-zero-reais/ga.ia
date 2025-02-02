'use client';

import React, { useCallback } from 'react';
import { LoaderCircle } from 'lucide-react';
import {
	ONBOARDING_COMPLETED,
	OnboardingStep,
} from '@/lib/types/entities/onboarding';
import { Button, ButtonProps } from '@/components/ui/button';
import { useOnboardingProgress } from './use-onboarding-progress';

interface LaterButtonProps extends ButtonProps {
	step: OnboardingStep;
	children?: React.ReactNode;
	variant?: ButtonProps['variant'];
}

export function LaterButton({
	step,
	children = 'Fazer mais tarde',
	variant = 'secondary',
	...props
}: LaterButtonProps) {
	const { continueTo, finish, isLoading, isSuccessful } =
		useOnboardingProgress();

	const onContinue = useCallback(() => {
		if (step === ONBOARDING_COMPLETED) {
			finish();
			return;
		}

		continueTo(step);
	}, [continueTo, finish, step]);

	return (
		<Button
			onClick={onContinue}
			disabled={isLoading || isSuccessful}
			variant={variant}
			{...props}
		>
			<>
				{(isLoading || isSuccessful) && (
					<LoaderCircle className="animate-spin" />
				)}

				{children}
			</>
		</Button>
	);
}
