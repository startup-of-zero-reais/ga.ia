import {
	ThumbsUp,
	Star,
	Wallet,
	Building,
	Check,
	X,
	HelpCircle,
} from 'lucide-react';
import {
	ABLE_TO_CONNECT_WPP,
	FeatureCodeLabel,
	featureCodes,
	MAX_AGENTS,
	MAX_DATASTORES,
	MAX_TEAM_USERS,
	MAX_WORKSPACES,
	Plan,
} from '@/lib/types/entities/plan';
import { cn } from '@/lib/utils';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Tooltip,
	TooltipProvider,
	TooltipTrigger,
	TooltipContent,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { BasicPlanButton, FreePlanButton, ProPlanButton } from './cta';

const TOOLTIPS = new Map([
	[
		MAX_WORKSPACES,
		<div key={MAX_WORKSPACES}>
			<p>
				Espaços de trabalho disponíveis para organizar sua equipe e seus
				agentes.
			</p>
		</div>,
	],
	[
		MAX_AGENTS,
		<div key={MAX_AGENTS}>
			<p>Número de agentes que você pode criar.</p>
		</div>,
	],
	[
		MAX_TEAM_USERS,
		<div key={MAX_TEAM_USERS}>
			<p>
				Quantos colaboradores você pode adicionar para usar seus workspaces.
			</p>
		</div>,
	],
	[
		ABLE_TO_CONNECT_WPP,
		<div key={ABLE_TO_CONNECT_WPP}>
			<p>Permite conectar seus agentes à um Whatsapp.</p>
		</div>,
	],
	[
		MAX_DATASTORES,
		<div key={MAX_DATASTORES}>
			<p>Limite de bases de conhecimento para seus agentes.</p>
		</div>,
	],
]);

interface PlanCardProps {
	plan: Plan;
}

export function PlanCard(props: PlanCardProps) {
	switch (props.plan.name) {
		case 'Básico':
			return <BasicPlan {...props} />;
		case 'Profissional':
			return <ProPlan {...props} />;
		default:
			return <FreePlan {...props} />;
	}
}

function FreePlan({ plan }: PlanCardProps) {
	const codesMap = new Map(
		plan.plan_features.map((f) => [f.feature_code, f.limit]),
	);

	return (
		<Card key={plan.id} className="w-full grid grid-rows-[auto,1fr,auto]">
			<CardHeader>
				<div className="grid place-items-center">
					<div className="rounded-full bg-primary/10 p-5">
						<ThumbsUp />
					</div>
				</div>
				<CardTitle>{plan.name}</CardTitle>
				<CardDescription>{plan.description}</CardDescription>

				<Price value={0.0} />
			</CardHeader>

			<CardContent className="flex flex-col gap-2">
				{featureCodes.map((feature) => (
					<FeatureBullet
						key={feature}
						has={codesMap.has(feature)}
						limit={codesMap.get(feature)}
						tooltip={TOOLTIPS.get(feature)}
					>
						<span className="text-sm">{FeatureCodeLabel[feature]}</span>
					</FeatureBullet>
				))}
			</CardContent>

			<CardFooter className="justify-stretch">
				<FreePlanButton />
			</CardFooter>
		</Card>
	);
}

function BasicPlan({ plan }: PlanCardProps) {
	const codesMap = new Map(
		plan.plan_features.map((f) => [f.feature_code, f.limit]),
	);

	return (
		<Card
			key={plan.id}
			className="w-full grid grid-rows-[auto,1fr,auto] bg-primary text-white"
		>
			<CardHeader className="relative">
				<div className="absolute inset-x-0 top-0 rounded-full -mt-4 mb-6 py-2 bg-card flex gap-2 items-center justify-center text-card-foreground border-primary border">
					<Star />
					Recomendado
				</div>

				<div className="grid place-items-center">
					<div className="rounded-full bg-secondary/10 p-5">
						<Wallet />
					</div>
				</div>

				<CardTitle>{plan.name}</CardTitle>
				<CardDescription className="text-gray-300">
					{plan.description}
				</CardDescription>

				<Price value={19.99} invert />
			</CardHeader>

			<CardContent className="flex flex-col gap-2">
				{featureCodes.map((feature) => (
					<FeatureBullet
						key={feature}
						has={codesMap.has(feature)}
						limit={codesMap.get(feature)}
						tooltip={TOOLTIPS.get(feature)}
					>
						<span className="text-sm">{FeatureCodeLabel[feature]}</span>
					</FeatureBullet>
				))}
			</CardContent>

			<CardFooter className="justify-stretch">
				<BasicPlanButton />
			</CardFooter>
		</Card>
	);
}

function ProPlan({ plan }: PlanCardProps) {
	const codesMap = new Map(
		plan.plan_features.map((f) => [f.feature_code, f.limit]),
	);

	return (
		<Card key={plan.id} className="w-full grid grid-rows-[auto,1fr,auto]">
			<CardHeader>
				<div className="grid place-items-center">
					<div className="rounded-full bg-primary/10 p-5">
						<Building />
					</div>
				</div>

				<CardTitle>{plan.name}</CardTitle>
				<CardDescription>{plan.description}</CardDescription>

				<Price value={34.99} />
			</CardHeader>

			<CardContent className="flex flex-col gap-2">
				{featureCodes.map((feature) => (
					<FeatureBullet
						key={feature}
						has={codesMap.has(feature)}
						limit={codesMap.get(feature)}
						tooltip={TOOLTIPS.get(feature)}
					>
						<span className="text-sm">{FeatureCodeLabel[feature]}</span>
					</FeatureBullet>
				))}
			</CardContent>

			<CardFooter className="justify-stretch">
				<ProPlanButton />
			</CardFooter>
		</Card>
	);
}

interface FeatureBulletProps {
	has: boolean;
	tooltip?: React.ReactNode;
	children: React.ReactNode;
	limit?: number;
}

function FeatureBullet({ children, has, tooltip, limit }: FeatureBulletProps) {
	const limitText = limit ? limit.toString().padStart(2, '0') : null;

	return (
		<TooltipProvider delayDuration={300}>
			<Tooltip>
				<TooltipTrigger
					className={cn(
						'inline-flex gap-2 items-center',
						!has && 'text-neutral-400',
					)}
				>
					{has ? <Check className="text-green-500" /> : <X />}
					{has && limitText ? (
						<Badge variant="secondary">{limitText}</Badge>
					) : has ? null : (
						<span className="text-sm -mr-1">Sem</span>
					)}
					<span className="text-sm">{children}</span>
					{tooltip && <HelpCircle size={15} />}
				</TooltipTrigger>
				{tooltip && <TooltipContent>{tooltip}</TooltipContent>}
			</Tooltip>
		</TooltipProvider>
	);
}

function Price({ value, invert }: { value: number; invert?: boolean }) {
	const price = new Intl.NumberFormat('pt-BR', {
		minimumSignificantDigits: 3,
	}).format(value);

	return (
		<div className="flex items-baseline mx-auto">
			<span
				className={cn(
					'text-xl font-medium',
					invert ? 'text-gray-200' : 'text-muted-foreground',
				)}
			>
				R$
			</span>
			<span className="text-5xl font-semibold">{price}</span>
			<span className={cn(invert ? 'text-gray-200' : 'text-muted-foreground')}>
				/mês
			</span>
		</div>
	);
}
