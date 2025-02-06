import CreateAgentForm from './form';

export default function Page() {
	return (
		<div className="flex flex-col gap-4 items-center max-w-screen-sm w-full md:w-[400px]">
			<h1 className="animate-slide-up-fade mt-10 text-2xl font-medium [--offset:10px] [animation-delay:250ms] [animation-duration:1s] [animation-fill-mode:both]">
				Criar Agente
			</h1>

			<CreateAgentForm />
		</div>
	);
}
