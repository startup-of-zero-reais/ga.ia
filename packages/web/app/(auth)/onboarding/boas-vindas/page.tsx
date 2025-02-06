import { Suspense } from 'react';
import { APP_NAME } from '@/lib/constants/main';
import { Wordmark } from '@/components/layout/wordmark';
import { Badge } from '@/components/ui/badge';
import { NextButton } from '@/app/(auth)/onboarding/next-button';

export default function Welcome() {
	return (
		<div className="relative mx-auto mt-24 flex max-w-screen-sm w-full md:w-[400px] flex-col items-center px-3 text-center md:mt-32 md:px-8 lg:mt-48">
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
				Crie seu primeiro agente com GA.IA e automatize processos em minutos.
			</p>

			<p className="animate-slide-up-fade mt-2 text-gray-600 [--offset:10px] [animation-delay:500ms] [animation-duration:1s] [animation-fill-mode:both]">
				Em apenas 2 passos você já terá seu primeiro Agente configurado.
			</p>

			<div className="space-y-4 animate-slide-up-fade mt-8 text-gray-600 [--offset:10px] [animation-delay:500ms] [animation-duration:1s] [animation-fill-mode:both]">
				<div className="flex items-center gap-2">
					<Badge>1</Badge>
					<span className="text-left">
						Vamos criar seu primeiro Workspace{' '}
						<small className="text-muted-foreground">
							(espaço de trabalho).
						</small>
					</span>
				</div>

				<div className="flex items-center gap-2">
					<Badge>2</Badge>
					<span>Configurando seu primeiro Agente.</span>
				</div>
			</div>

			<div className="animate-slide-up-fade mt-10 w-full [--offset:10px] [animation-delay:750ms] [animation-duration:1s] [animation-fill-mode:both]">
				<Suspense>
					<NextButton step="espaco-de-trabalho">
						Começar a criar meu agente agora
					</NextButton>
				</Suspense>
			</div>
		</div>
	);
}
