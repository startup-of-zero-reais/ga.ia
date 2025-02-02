import { Suspense } from 'react';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LaterButton } from '@/app/(auth)/onboarding/later-button';

export default function ConnectWppPage() {
	return (
		<div className="flex flex-col gap-4 items-center max-w-screen-sm w-full md:w-[400px]">
			<h1 className="animate-slide-up-fade mt-10 text-2xl font-medium [--offset:10px] [animation-delay:250ms] [animation-duration:1s] [animation-fill-mode:both]">
				Conecte-se ao Whatsapp
			</h1>

			<p>O QrCode abaixo irá sincronizar seu whatsapp com seus agentes de IA</p>

			<div className="aspect-square w-full border p-2 grid place-content-center">
				<LoaderCircle
					className="animate-spin text-muted-foreground"
					size={32}
				/>
			</div>

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
