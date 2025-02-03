'use client';

import { toast } from 'sonner';
import React, { Suspense, useCallback, useState } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { getRandomUid } from '@/lib/functions/rand';
import { createInstanceAction } from '@/lib/actions/create-instance';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { LaterButton } from '@/app/(auth)/onboarding/later-button';
import { useOnboardingProgress } from '@/app/(auth)/onboarding/use-onboarding-progress';

const randomValue = getRandomUid().toUpperCase();

export default function CreateAgentInstanceForm() {
	const { continueTo, isLoading } = useOnboardingProgress();

	const [identification, setIdentification] = useState('');
	const [token, setToken] = useState(randomValue);
	const [number, setNumber] = useState('');

	const onChange = useCallback(
		(setter: (v: string) => void) =>
			(e: React.ChangeEvent<HTMLInputElement>) => {
				const value = e.target.value;
				setter(value);
			},
		[],
	);

	const { executeAsync, hasSucceeded, isExecuting } = useAction(
		createInstanceAction,
		{
			onSuccess() {},
			onError({ error }) {
				toast.error('Falha para configurar agentes');
				console.error('Failed to config instance', error);
			},
		},
	);

	const onContinue = useCallback(async () => {
		const result = await executeAsync({
			instanceName: identification,
			token,
		});

		if (result?.serverError) {
			return;
		}

		await continueTo('conectar-whatsapp', { token, identification });
	}, [continueTo, executeAsync, identification, token]);

	return (
		<form className="flex w-full flex-col gap-2">
			<div>
				<Label htmlFor="identificiation">
					Identificação <Required />
				</Label>
				<Input
					id="identification"
					required
					placeholder="Meu primeiro agente"
					value={identification}
					onChange={onChange(setIdentification)}
				/>
			</div>

			<div>
				<Label htmlFor="token">
					Token de segurança <Required />
				</Label>
				<Input id="token" value={token} onChange={onChange(setToken)} />
			</div>

			<div>
				<Label htmlFor="phone-number">Número de whatsapp</Label>
				<div className="grid grid-cols-[auto,1fr] gap-2">
					<Badge variant="outline">+55</Badge>
					<Input
						id="phone-number"
						placeholder="(11) 98877-6666"
						value={number}
						onChange={onChange(setNumber)}
					/>
				</div>
			</div>

			<div className="mt-4">
				<Suspense>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
						<LaterButton step="configurar-llm" />
						<Button
							type="button"
							onClick={onContinue}
							disabled={
								isLoading ||
								isExecuting ||
								hasSucceeded ||
								!(token && identification)
							}
						>
							Continuar
						</Button>
					</div>
				</Suspense>
			</div>
		</form>
	);
}

function Required() {
	return <span className="text-destructive">*</span>;
}
