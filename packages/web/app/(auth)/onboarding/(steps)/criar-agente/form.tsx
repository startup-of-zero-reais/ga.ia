'use client';

import { toast } from 'sonner';
import React, { useCallback, useState } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { LoaderCircle } from 'lucide-react';
import useSWR from 'swr';
import slugify from 'slugify';
import { faker } from '@faker-js/faker';
import { cn } from '@/lib/utils';
import { handleServerErrors } from '@/lib/functions/errors';
import { extractFormData } from '@/lib/functions/extract-form-data';
import { createWorkspaceAction } from '@/lib/actions/create-workspace';
import { API_DOMAIN } from '@/lib/constants/main';
import { fetcherWithCookies } from '@/lib/functions/fetcher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDebounce } from '@/hooks/use-debounce';
import { useOnboardingProgress } from '@/app/(auth)/onboarding/use-onboarding-progress';

const randomName = `${faker.git.branch()}-${faker.number.int({ min: 100000, max: 999999 })}`;

export default function CreateAgentForm() {
	const [name, setName] = useState(randomName);
	const slug = useDebounce(slugify(name, { lower: true, trim: true }), 400);

	const { data, isLoading: searching } = useSWR(
		slug ? `${API_DOMAIN}/v1/agent/${slug}` : null,
		fetcherWithCookies,
		{ revalidateOnFocus: false },
	);

	const { continueTo, isLoading: isOnboardingLoading } =
		useOnboardingProgress();

	const { executeAsync, isExecuting, hasSucceeded } = useAction(
		createWorkspaceAction,
		{
			onError({ error }) {
				console.error('Failed to create workspace', error);
				if (!error?.validationErrors) {
					toast.error(
						'Ops, ocorreu um problema ao criar workspace, tente novamente.',
					);
				}
			},
		},
	);

	const isLoading = isExecuting || hasSucceeded || isOnboardingLoading;

	const onSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			const { name, description } = extractFormData(e, ['name', 'description']);

			const result = await executeAsync({ name, description });
			const { proceed } = handleServerErrors(result);
			if (!proceed) {
				return;
			}

			await continueTo('criar-agente', { slug });
		},
		[continueTo, executeAsync, slug],
	);

	return (
		<form className="w-full flex flex-col gap-4" onSubmit={onSubmit}>
			<div>
				<Label htmlFor="name">Escolha um nome para seu Agente</Label>
				<div
					className={cn(
						'grid transition-all',
						searching ? 'grid-cols-[1fr,40px]' : 'grid-cols-[1fr,0]',
					)}
				>
					<Input
						id="name"
						name="name"
						placeholder="Agente de Vendas"
						value={name}
						onChange={(e) => setName(e.target.value)}
						aria-invalid={!!data}
						className={cn(!!data ? 'border-destructive !ring-destructive' : '')}
					/>
					<div
						className={cn(
							'grid place-items-center transition-all',
							!searching ? 'opacity-0' : 'opacity-100',
						)}
					>
						<LoaderCircle className="animate-spin" />
					</div>
				</div>
				{!!data && (
					<span className="text-destructive text-sm mt-2">
						Este nome já está sendo usado, tente outro
					</span>
				)}
			</div>

			<div>
				<Label htmlFor="description">Descrição do agente</Label>
				<Textarea
					id="description"
					placeholder="Agente de vendas e acompanhamento"
					name="description"
				/>
				<span className="text-sm text-muted-foreground">
					Isso não afeta as respostas do seu agente.
				</span>
			</div>

			<div className="flex items-center justify-center">
				<Button disabled={isLoading || !!data || !slug}>
					{isLoading && <LoaderCircle className="animate-spin" />}
					Continuar
				</Button>
			</div>
		</form>
	);
}
