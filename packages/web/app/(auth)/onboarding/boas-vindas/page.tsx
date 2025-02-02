import { Suspense } from 'react';
import { APP_NAME } from '@/lib/constants/main';
import { Wordmark } from '@/components/layout/wordmark';
import { NextButton } from '@/app/(auth)/onboarding/next-button';

export default function Welcome() {
	return (
		<div className="relative mx-auto mt-24 flex max-w-sm flex-col items-center px-3 text-center md:mt-32 md:px-8 lg:mt-48">
			<div className="animate-slide-up-fade relative flex w-auto items-center justify-center px-6 py-2 [--offset:20px] [animation-duration:1.3s] [animation-fill-mode:both]">
				<div className="absolute inset-0 opacity-10 animate-slide-up">
					{[...Array(3)].map((_, i) => (
						<div
							key={i}
							className="animate-pulse-scale absolute inset-0 rounded-full mix-blend-color-burn"
							style={{
								animationDelay: `${i * -2}s`,
								backgroundImage: `linear-gradient(90deg, #000, transparent, #000)`,
							}}
						/>
					))}
				</div>

				<Wordmark className="relative h-16" />
			</div>

			<h1 className="animate-slide-up-fade mt-10 text-2xl font-medium [--offset:10px] [animation-delay:250ms] [animation-duration:1s] [animation-fill-mode:both]">
				Boas vindas ao {APP_NAME}!
			</h1>

			<p className="animate-slide-up-fade mt-2 text-gray-600 [--offset:10px] [animation-delay:500ms] [animation-duration:1s] [animation-fill-mode:both]">
				GA.IA são God Agents de IA God para você e seu negócio faturarem alto!
			</p>

			<div className="animate-slide-up-fade mt-10 w-full [--offset:10px] [animation-delay:750ms] [animation-duration:1s] [animation-fill-mode:both]">
				<Suspense>
					<NextButton step="criar-instancia" />
				</Suspense>
			</div>
		</div>
	);
}
