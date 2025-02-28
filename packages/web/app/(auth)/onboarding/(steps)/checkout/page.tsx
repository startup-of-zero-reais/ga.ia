import { CheckCircle2, Circle, CircleDashed, Copy, Lock } from 'lucide-react';
import { fetchMe } from '@/lib/fetchers/auth';
import { fetchPlans } from '@/lib/fetchers/plans';
import {
	BASIC_PLAN_NAME,
	FREE_PLAN_NAME,
	PRO_PLAN_NAME,
} from '@/lib/constants/plans';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlanCard } from './plan-card';
import ChangePlanButton from './change-plan';

interface CheckoutPageParams {
	searchParams: Promise<{
		plan?: string;
	}>;
}

export default async function CheckoutPage({
	searchParams,
}: CheckoutPageParams) {
	const params = await searchParams;

	const me = await fetchMe();
	const plans = await fetchPlans({ name: params.plan });
	const plan = plans.at(0);

	if (!plan) {
		return null;
	}

	const pix = {
		id: 'JEANCARL00000000588522ASA',
		encodedImage:
			'iVBORw0KGgoAAAANSUhEUgAAAcIAAAHCAQAAAABUY/ToAAADCklEQVR4Xu2UQW4bMRRDvfP9b9RjeefmkfyyU6CYIpt+A9SMFYnkYxaSfXv+cPy6/an86yh5NUpejZJXo+TVKHk1/hv5uGncv1Z31vfHeWTauMd1suRiklXML8xvQJmimSZZcjcZdRYPghHUFl5W+JLryYS9Jz4tZL5Vl/wE0gG2d1bn15tXn5IfQj6j8kKTNmVu8pMsuZrUoeNdPkmW/OuzgDwD89vyxVh7y5ZcS+p8fcrOv/bzRX9YeKspuZgkHgWfHUv9ROt7HBW85AeQJL48jhxnug4mL11GS64lbSoH4ohsMdLZnX3J3aRyEjylRCF1gUI5UnI9qdmUe7QwmkntBJ0uuZd8zslLd2Le7OEdCFpyLXmugHhH0EhIM+dd9JJ7SQ8YAfJd4D/Tice/KLmbZA3CZVBAAhWpyZLyAUsuJrE8k3OH+xSa7rGkllxLejnR0zNxbomqQKe35F4yESWc1Mx+OsBcrHTJzaSG4SehvHkkyqNkwJJ7SXIcPuc/W7IvYUqsCC25lrQnhAosYlLkKDp+yfUkR6yMI9D6gAd1M4p+uEuuJn26FOTbLAiFaO5GMqkvuZkMJJf3ZiQtAd+EkotJ6zZ1ztyCs1R81PSU3EwavunsZTqcixFb+/mUXE7Gd4SWuQL89UU5LQJL7iUfvgREUCcURrYeWxZL7iVlZhb2nlerw/KdKbmcnItgSLaWw0zAfSU3k98AAiFyPzyxP6uSq0muADpseLkY6plO+UZLLiYn5ZhvgXbasJ3yrEouJtnJNKCKYK41L1VuydUkKhsnyLqImCxVnjVdJReTOE/ldAFIvVQm9eVuuLfkavIFCA4zZe6zJI9Rci0ZUCl0r94QRywOWnItOWPsuQlR9FXWxVA/b8nNJOkDOJTZS9V4T7OlkntJVmGetr3ORrXJSWaUXEz6fP1kn6GWAFKVLfkh5BRIPXlWTGq0W/ITSCTcxE6JG2xrLrmatJSwQy5Lq8NuRSu5muTsCZpz2omU2o3kppJryR+Nklej5NUoeTVKXo2SV+PDyN/OjshkmSlxYwAAAABJRU5ErkJggg==',
		payload:
			'00020126710014br.gov.bcb.pix0136520369c8-8f49-4fca-8a0b-93ce3f30c5370209Churrasco520400005303986540550.005802BR5919Jean Carlos Molossi6007Chapeco62290525JEANCARL00000000588522ASA6304869D',
		allowsMultiplePayments: true,
		expirationDate: '2025-05-05 14:20:50',
		externalReference: null,
	};

	return (
		<div className="grid xl:grid-cols-[1fr_380px] gap-6">
			<div className="flex flex-col gap-6 w-full grow-0">
				<header className="grid grid-cols-1 md:grid-cols-5 gap-4 place-items-center border p-4 rounded-md bg-card/80">
					<div className="grid grid-cols-[auto_1fr] w-full items-center gap-2 text-green-600">
						<CheckCircle2 />
						Configuração
					</div>
					<Separator className="hidden md:block" />
					<div className="grid grid-cols-[auto_1fr] w-full items-center gap-2">
						<Circle />
						Pagamento
					</div>
					<Separator className="hidden md:block" />
					<div className="grid grid-cols-[auto_1fr] w-full items-center gap-2 text-muted-foreground">
						<CircleDashed />
						Finalizado
					</div>
				</header>

				<div className="space-y-6">
					<h1 className="text-xl font-semibold">Informações de cobrança</h1>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
						<div>
							<Label>
								Nome <span className="text-destructive">*</span>
							</Label>
							<Input placeholder="John doe" required defaultValue={me.name} />
						</div>

						<div>
							<Label>
								E-mail <span className="text-destructive">*</span>
							</Label>
							<Input
								placeholder="john.doe@email.com"
								required
								defaultValue={me.email}
							/>
						</div>

						<div>
							<Label>
								CEP <span className="text-destructive">*</span>
							</Label>
							<Input placeholder="00000-000" required />
						</div>

						<div>
							<Label>
								Complemento <small>(Opcional)</small>
							</Label>
							<Input placeholder="Apartamento" />
						</div>

						<div>
							<Label>
								CPF/CNPJ <span className="text-destructive">*</span>
							</Label>
							<Input placeholder="000.000.000-00" required />
						</div>

						<div>
							<Label>
								Telefone/Celular <span className="text-destructive">*</span>
							</Label>
							<Input placeholder="(00) 00000-0000" required />
						</div>
					</div>
				</div>

				<Tabs defaultValue="credit-card" className="w-full">
					<TabsList className="w-full">
						<TabsTrigger value="credit-card">Cartão de crédito</TabsTrigger>
						<TabsTrigger value="pix">Pix</TabsTrigger>
					</TabsList>

					<TabsContent value="credit-card">
						<div className="flex flex-col gap-4">
							<div>
								<Label>Numero do Cartão</Label>
								<Input placeholder="0000 0000 0000 0000" />
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label>Expiração</Label>
									<Input placeholder="12/25" />
								</div>
								<div>
									<Label>Código verificador</Label>
									<Input placeholder="CVC" />
								</div>
							</div>

							<div className="inline-flex items-center gap-2 text-sm text-green-600/70">
								<Lock size={14} /> Não salvamos nenhum dado de pagamento
							</div>
						</div>
					</TabsContent>

					<TabsContent value="pix">
						<div className="grid grid-cols-3">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								loading="lazy"
								src={`data:image/png;base64,${pix.encodedImage}`}
								alt="qr-code-pix"
								className="col-span-2"
							/>

							<div className="flex gap-2 items-center">
								<span>Copiar</span>

								<Button size="icon">
									<Copy />
								</Button>
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</div>

			<div>
				<Card>
					<CardHeader>
						<CardTitle>Assinatura</CardTitle>
						<CardDescription>
							Confira os dados da sua assinatura
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-2">
							<span className="col-span-2 italic">Alterar plano</span>
							<ChangePlanButton
								variant="outline"
								plan={BASIC_PLAN_NAME}
								className={cn(
									plan.name == BASIC_PLAN_NAME && 'border-primary text-primary',
								)}
							>
								{BASIC_PLAN_NAME}
							</ChangePlanButton>

							<ChangePlanButton
								variant="outline"
								plan={PRO_PLAN_NAME}
								className={cn(
									plan.name == PRO_PLAN_NAME && 'border-primary text-primary',
								)}
							>
								{PRO_PLAN_NAME}
							</ChangePlanButton>
						</div>

						<PlanCard plan={plan} />
					</CardContent>

					<CardFooter className="gap-4">
						<ChangePlanButton variant="secondary" plan={FREE_PLAN_NAME}>
							Continuar com gratuito
						</ChangePlanButton>

						<Button className="w-full">Pagar</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
