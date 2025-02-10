'use client';

import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnboardingProgress } from '@/app/(auth)/onboarding/use-onboarding-progress';

export function FreePlanButton() {
	const { finish, isLoading } = useOnboardingProgress();

	return (
		<Button
			variant="secondary"
			className="w-full"
			onClick={finish}
			disabled={isLoading}
		>
			{isLoading && <LoaderCircle className="animate-spin" />}
			Continuar com o gratuito
		</Button>
	);
}

export function BasicPlanButton() {
	const { continueTo, isLoading } = useOnboardingProgress();

	return (
		<Button
			variant="outline"
			className="text-primary w-full"
			disabled={isLoading}
			onClick={async () => continueTo('checkout', { plan: 'Básico' })}
		>
			{isLoading && <LoaderCircle className="animate-spin" />}
			Escolher o básico
		</Button>
	);
}

export function ProPlanButton() {
	const { continueTo, isLoading } = useOnboardingProgress();

	return (
		<Button
			variant="outline"
			className="w-full"
			disabled={isLoading}
			onClick={async () => continueTo('checkout', { plan: 'Profissional' })}
		>
			{isLoading && <LoaderCircle className="animate-spin" />}
			Escolher o profissional
		</Button>
	);
}
