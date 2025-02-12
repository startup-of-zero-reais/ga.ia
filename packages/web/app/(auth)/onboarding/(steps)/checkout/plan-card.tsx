import { Check, X } from 'lucide-react';
import { PLAN_PRICING } from '@/lib/constants/plans';
import {
	FeatureCode,
	FeatureCodeLabel,
	featureCodes,
	Plan,
} from '@/lib/types/entities/plan';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface PlanCardProps {
	plan: Plan;
}

export function PlanCard({ plan }: PlanCardProps) {
	const dynamicPlanName = plan.name as keyof typeof PLAN_PRICING;
	const pricing = PLAN_PRICING[dynamicPlanName] || 0.0;
	const price = new Intl.NumberFormat('pt-BR', {
		minimumSignificantDigits: 3,
	}).format(pricing);

	const planFeatureMap = new Map(
		plan.plan_features.map((feature) => [feature.feature_code, feature.limit]),
	);

	return (
		<div className="grid gap-6">
			<header className="flex flex-col gap-2">
				<h2 className="text-2xl font-semibold leading-none tracking-tight">
					{plan.name}
				</h2>

				<p className="text-sm text-muted-foreground">{plan.description}</p>
			</header>
			<div className="grid gap-6">
				<div className="flex items-baseline mx-auto">
					<span className="text-xl font-medium text-muted-foreground">R$</span>
					<span className="text-5xl font-semibold">{price}</span>
					<span className="text-muted-foreground">/mês</span>
				</div>

				<div className="grid gap-2">
					{featureCodes.map((feature) => (
						<Feature
							feature={feature}
							key={feature}
							planHasFeature={planFeatureMap.has(feature)}
							limit={planFeatureMap.get(feature)}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

interface FeatureProps {
	feature: FeatureCode;
	planHasFeature: boolean;
	limit?: number;
}

function Feature({ feature, planHasFeature, limit }: FeatureProps) {
	const label = FeatureCodeLabel[feature];
	const limitText = limit ? limit.toString().padStart(2, '0') : null;

	const renderBadgeLabelOrOmitPrefix = () => {
		if (planHasFeature && limitText) {
			return <Badge>{limitText}</Badge>;
		}

		if (planHasFeature && typeof limit !== undefined) {
			return null;
		}

		return <span>Sem</span>;
	};

	return (
		<div
			className={cn(
				'flex items-center gap-1',
				!planHasFeature && 'text-muted-foreground',
			)}
		>
			{planHasFeature ? <Check className="text-green-500" /> : <X />}
			{renderBadgeLabelOrOmitPrefix()}
			{label}
		</div>
	);
}
