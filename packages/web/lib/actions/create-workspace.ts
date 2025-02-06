'use server';

import { CreateWorkspaceSchema } from '@/lib/types/schemas/workspace.schema';
import { authFetch } from '@/lib/functions/auth-fetcher';
import { API_DOMAIN } from '@/lib/constants/main';
import { authActionClient } from './safe-action';

export const createWorkspaceAction = authActionClient
	.schema(CreateWorkspaceSchema)
	.action(async ({ parsedInput }) => {
		const { name } = parsedInput;
		const body = new FormData();
		body.append('name', name.trim());

		await authFetch(`${API_DOMAIN}/v1/workspaces/`, {
			method: 'POST',
			body,
		});

		return { success: true };
	});
