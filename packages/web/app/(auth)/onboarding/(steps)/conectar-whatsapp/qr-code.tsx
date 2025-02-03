'use client';

import { useEffect, useState } from 'react';
import { LoaderCircle, RefreshCw } from 'lucide-react';
import { getInstance, getQrCode } from '@/lib/fetchers/qr-code';
import { Button } from '@/components/ui/button';
import { useOnboardingProgress } from '@/app/(auth)/onboarding/use-onboarding-progress';

interface QrCodeProps {
	identification: string;
	token: string;
}

export default function QrCode({ identification, token }: QrCodeProps) {
	const { continueTo } = useOnboardingProgress();
	const [data, setData] = useState<string | null>(null);
	const [closed, setClosed] = useState(false);

	useEffect(() => {
		let counter = 0;
		let poolingCounter = 0;

		getQrCode(token, identification)
			.then(async (image) => {
				setData(image);
			})
			.catch(() => {
				setData(null);
				setClosed(true);
			});

		const interval = setInterval(async () => {
			await getQrCode(token, identification)
				.then(async (image) => {
					counter++;
					setData(image);
				})
				.catch(() => {
					counter = 2;
					setData(null);
					setClosed(true);
				});

			if (counter >= 3) {
				console.log('STOP');
				setData(null);
				setClosed(true);
				clearInterval(interval);
			}
		}, 35000);

		const connectionPooling = setInterval(async () => {
			const response = await getInstance(token).catch(() => {
				clearInterval(connectionPooling);
				return null;
			});

			if (!response) {
				return;
			}

			if (response.connectionStatus === 'open') {
				clearInterval(connectionPooling);
				await continueTo('configurar-llm');
				return;
			}

			poolingCounter++;

			if (poolingCounter >= 15) {
				clearInterval(connectionPooling);
			}
		}, 5000);

		return () => {
			clearInterval(interval);
			clearInterval(connectionPooling);
		};
	}, [continueTo, identification, token]);

	return (
		<div className="aspect-square w-full border p-2 grid place-content-center">
			{!closed && (
				<>
					{!data ? (
						<LoaderCircle
							className="animate-spin text-muted-foreground"
							size={32}
						/>
					) : (
						// eslint-disable-next-line @next/next/no-img-element
						<img src={data} alt="qr-code" />
					)}
				</>
			)}

			{closed && (
				<div>
					<Button
						onClick={() => {
							window.location.reload();
						}}
					>
						<RefreshCw /> Tentar novamente
					</Button>
				</div>
			)}
		</div>
	);
}
