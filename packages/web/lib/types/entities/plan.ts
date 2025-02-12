import { PK, Timestamps } from './base';

export const MAX_WORKSPACES = 'MAX_WORKSPACES';
export const MAX_AGENTS = 'MAX_AGENTS';
export const MAX_TEAM_USERS = 'MAX_TEAM_USERS';
export const ABLE_TO_CONNECT_WPP = 'ABLE_TO_CONNECT_WPP';
export const MAX_DATASTORES = 'MAX_DATASTORES';

export const featureCodes = [
	MAX_WORKSPACES,
	MAX_AGENTS,
	MAX_DATASTORES,
	MAX_TEAM_USERS,
	ABLE_TO_CONNECT_WPP,
] as const;

export const FeatureCodeLabel = {
	[MAX_WORKSPACES]: 'Workspaces',
	[MAX_AGENTS]: 'Agentes',
	[MAX_DATASTORES]: 'Bases de conhecimento',
	[MAX_TEAM_USERS]: 'Usuários na equipe',
	[ABLE_TO_CONNECT_WPP]: 'Conexão com whatsapp',
};

export type FeatureCode = (typeof featureCodes)[number];

export interface PlanFeatures extends Timestamps, PK {
	plan_id: string;
	feature_code: FeatureCode;
	limit: number;
}

export interface Plan extends Timestamps, PK {
	name: string;
	description: string;
	plan_features: PlanFeatures[];
}
