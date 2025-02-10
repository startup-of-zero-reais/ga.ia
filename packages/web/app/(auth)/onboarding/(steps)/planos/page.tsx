import { Suspense } from 'react';
import { fetchPlans } from '@/lib/fetchers/plans';
import { PlanCard } from './plan-card';

export default async function PlansPage() {
	const plans = await fetchPlans();

	return (
		<div className="flex flex-col gap-8 items-center max-w-screen-xl w-full">
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
