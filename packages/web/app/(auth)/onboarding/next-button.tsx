'use client';

import React, { useCallback } from 'react';
import { LoaderCircle } from 'lucide-react';
import { OnboardingStep } from '@/lib/types/entities/onboarding';
import { Button, ButtonProps } from '@/components/ui/button';
import { useOnboardingProgress } from './use-onboarding-progress';

interface NextButtonProps extends ButtonProps {
	step: OnboardingStep;
	children?: React.ReactNode;
}

export function NextButton({
	step,
	children = 'Continuar',
	disabled = false,
	...props
}: NextButtonProps) {
	const { continueTo, isLoading, isSuccessful } = useOnboardingProgress();

	const onContinue = useCallback(() => continueTo(step), [continueTo, step]);

	return (
		<Button
			onClick={onContinue}
			disabled={isLoading || isSuccessful || disabled}
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
