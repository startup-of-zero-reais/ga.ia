import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { LaterButton } from '@/app/(auth)/onboarding/later-button';
import QrCode from './qr-code';

interface ConnectWppPageProps {
	searchParams: Promise<{
		identification: string;
		token: string;
	}>;
}

export default async function ConnectWppPage({
	searchParams,
}: ConnectWppPageProps) {
	const { identification, token } = await searchParams;

	return (
		<div className="flex flex-col gap-4 items-center max-w-screen-sm w-full md:w-[400px]">
			<h1 className="animate-slide-up-fade mt-10 text-2xl font-medium [--offset:10px] [animation-delay:250ms] [animation-duration:1s] [animation-fill-mode:both]">
				Conecte-se ao Whatsapp
			</h1>

			<p>O QrCode abaixo irá sincronizar seu whatsapp com seus agentes de IA</p>

			<QrCode identification={identification} token={token} />

			<div className="mt-4">
				<Suspense>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
						<LaterButton step="configurar-llm" />
						<Button type="button" disabled={false}>
							Continuar
						</Button>
					</div>
				</Suspense>
			</div>
		</div>
	);
}
