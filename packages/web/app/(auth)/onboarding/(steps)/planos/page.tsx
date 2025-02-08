import { Suspense } from 'react';
import { Check, X, HelpCircle } from 'lucide-react';
import { fetchPlans } from '@/lib/fetchers/plans';
import {
	FeatureCodeLabel,
	featureCodes,
	ABLE_TO_CONNECT_WPP,
	MAX_AGENTS,
	MAX_TEAM_USERS,
	MAX_WORKSPACES,
	Plan,
	MAX_DATASTORES,
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
import { Button } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

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

export default async function PlansPage() {
	const plans = await fetchPlans();

	return (
		<div className="flex flex-col gap-4 items-center max-w-screen-xl w-full">
			<h1 className="animate-slide-up-fade mt-10 text-2xl font-medium [--offset:10px] [animation-delay:250ms] [animation-duration:1s] [animation-fill-mode:both]">
				Escolha seu plano!
			</h1>

			<Suspense>
				<div className="grid lg:grid-cols-3 gap-4 w-full">
					{plans.map((plan) => (
						<PlanCard key={plan.id} plan={plan} />
					))}
				</div>
			</Suspense>
		</div>
	);
}

interface PlanCardProps {
	plan: Plan;
}

function PlanCard(props: PlanCardProps) {
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
				<CardTitle>{plan.name}</CardTitle>
				<CardDescription>{plan.description}</CardDescription>
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
				<Button variant="secondary" className="w-full">
					Continuar com o gratuito
				</Button>
			</CardFooter>
		</Card>
	);
}

function BasicPlan({ plan }: PlanCardProps) {
	const codesMap = new Map(
		plan.plan_features.map((f) => [f.feature_code, f.limit]),
	);

	return (
		<Card key={plan.id} className="w-full grid grid-rows-[auto,1fr,auto]">
			<CardHeader>
				<CardTitle>{plan.name}</CardTitle>
				<CardDescription>{plan.description}</CardDescription>
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
				<Button className="w-full">Escolher o básico</Button>
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
				<CardTitle>{plan.name}</CardTitle>
				<CardDescription>{plan.description}</CardDescription>
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
				<Button variant="outline" className="w-full">
					Escolher o profissional
				</Button>
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
						<Badge>{limitText}</Badge>
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
