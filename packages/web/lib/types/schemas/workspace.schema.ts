import { z } from 'zod';

const NAME_REQUIRED = 'Dê um nome para seu workspace.';
const NAME_MIN_LENGTH = 4;
const NAME_TOO_SHORT = `O nome do workspace deve ter ao menos ${NAME_MIN_LENGTH} caracteres.`;

export const CreateWorkspaceSchema = z.object({
	name: z
		.string({ required_error: NAME_REQUIRED, message: NAME_REQUIRED })
		.min(NAME_MIN_LENGTH, NAME_TOO_SHORT),
	description: z.string().optional(),
});
