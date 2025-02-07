import { z } from 'zod';

const NAME_REQUIRED = 'Dê um nome para seu agente.';
const NAME_MIN_LENGTH = 4;
const NAME_TOO_SHORT = `O nome do agente deve ter ao menos ${NAME_MIN_LENGTH} caracteres.`;
const WORKSPACE_REQUIRED = 'Informe o workspace para criar o agente.';

export const CreateAgentSchema = z.object({
	name: z
		.string({ required_error: NAME_REQUIRED, message: NAME_REQUIRED })
		.min(NAME_MIN_LENGTH, NAME_TOO_SHORT),
	workspace_id_or_slug: z.string({
		required_error: WORKSPACE_REQUIRED,
		message: WORKSPACE_REQUIRED,
	}),
	description: z.string().optional(),
});
