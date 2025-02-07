'use server';

import { CreateAgentSchema } from '@/lib/types/schemas/agent.schema';
import { authFetch } from '@/lib/functions/auth-fetcher';
import { API_DOMAIN } from '@/lib/constants/main';
import { authActionClient } from './safe-action';

export const createAgentAction = authActionClient
	.schema(CreateAgentSchema)
	.action(async ({ parsedInput }) => {
		const { name, workspace_id_or_slug, description } = parsedInput;

		await authFetch(`${API_DOMAIN}/v1/agents/`, {
			method: 'POST',
			body: JSON.stringify({
				name,
				workspace: workspace_id_or_slug,
				description,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		return { success: true };
	});
