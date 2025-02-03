'use client';

import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { useOnboardingProgress } from '@/app/(auth)/onboarding/use-onboarding-progress';
// import { LaterButton } from '@/app/(auth)/onboarding/later-button';

export default function ConfigLLMPage() {
	const { finish } = useOnboardingProgress();

	return (
		<div className="flex flex-col gap-4 items-center max-w-screen-sm w-full md:w-[400px]">
			<div>A</div>
			<Suspense>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
					<Button type="button" onClick={finish}>
						Finalizar
					</Button>
				</div>
			</Suspense>
		</div>
	);
}
