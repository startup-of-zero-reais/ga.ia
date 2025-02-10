export const ONBOARDING_COMPLETED = 'finalizar';

export const ONBOARDING_STEPS = [
	'espaco-de-trabalho',
	'criar-agente',
	'planos',

	'checkout',

	'criar-instancia',
	'conectar-whatsapp',
	'configurar-llm',
	ONBOARDING_COMPLETED,
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];
