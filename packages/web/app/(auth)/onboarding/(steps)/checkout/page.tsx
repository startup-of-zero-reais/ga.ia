import { CheckCircle2, Circle, CircleDashed } from 'lucide-react';
import { fetchMe } from '@/lib/fetchers/auth';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default async function CheckoutPage() {
	const me = await fetchMe();

	return (
		<div className="grid xl:grid-cols-[1fr,380px] gap-6">
			<div className="flex flex-col gap-6">
				<header className="grid grid-cols-5 gap-4 place-items-center">
					<div className="flex items-center gap-2 text-green-600">
						<CheckCircle2 />
						Configuração
					</div>
					<Separator />
					<div className="flex items-center gap-2">
						<Circle />
						Pagamento
					</div>
					<Separator />
					<div className="flex items-center gap-2 text-muted-foreground">
						<CircleDashed />
						Finalizado
					</div>
				</header>

				<div className="space-y-6">
					<h1 className="text-xl font-semibold">Informações de cobrança</h1>
					<div className="grid grid-cols-2 gap-x-4 gap-y-3">
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

						<div className="col-span-2">
							<Button>Pagar</Button>
						</div>
					</div>
				</div>
			</div>

			<div>
				<Card>
					<CardContent>
						<div>Assinatura</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
