import { NextRequest, NextResponse } from 'next/server';
import { parse } from '@/lib/middleware/helpers/parse';
import { createServerClient } from '@/lib/middleware/helpers/auth';
import { ONBOARDING_COMPLETED } from '@/lib/types/entities/onboarding';
import { SESSION_TOKEN } from '@/lib/constants/auth';
import { getOnboardingStep } from './helpers/get-onboarding-step';

const PAGE = {
	HOME: '/home',
	LOGIN: '/acessar',
	CALLBACK: '/auth/callback',
	ONBOARDING: '/onboarding',
};

export default async function AppMiddleware(request: NextRequest) {
	const { path, fullPath } = parse(request);
	let response = NextResponse.next({ request });

	const apiClient = createServerClient({
		cookies: {
			getAll: () => request.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value }) =>
					request.cookies.set(name, value),
				);

				response = NextResponse.next({ request });
				cookiesToSet.forEach(({ name, value, options }) =>
					response.cookies.set(name, value, options),
				);
			},
		},
	});

	const { user } = await apiClient.auth.getUser();
	const DAY = 60 * 60 * 24 * 1000;
	const isNewUser =
		new Date(user?.created_at || 0).getTime() > Date.now() - DAY;

	const isInPublicPath = [PAGE.HOME, PAGE.LOGIN, PAGE.CALLBACK, '/'].includes(
		path,
	);

	const step = await getOnboardingStep(
		request.cookies.get(SESSION_TOKEN)?.value,
	);

	const persistentQuery = request.nextUrl.searchParams;
	const query =
		persistentQuery.size > 0 ? `?${persistentQuery.toString()}` : '';

	// se o usuario nao esta logado nem em pagina de login ou callback de autorizacao
	// enviamos ele para o login
	if (!user && !isInPublicPath) {
		const whereToGo =
			path === '/' ? '' : `?redir_to=${encodeURIComponent(fullPath)}`;

		return NextResponse.redirect(
			new URL(`/app${PAGE.LOGIN}${whereToGo}`, request.url),
		);

		// se o usuario esta logado
	} else if (user) {
		if (path.startsWith(PAGE.ONBOARDING) && step === ONBOARDING_COMPLETED) {
			// middleware de onboarding ?
			return NextResponse.redirect(new URL(`/app/dashboard`, request.url));
		} else if (
			isNewUser &&
			!path.startsWith(PAGE.ONBOARDING) &&
			step !== ONBOARDING_COMPLETED
		) {
			return NextResponse.redirect(
				new URL(`/app/onboarding/${step}${query}`, request.url),
			);
		} else if (['/', PAGE.LOGIN].includes(path)) {
			return NextResponse.redirect(new URL(`/app/dashboard`, request.url));
		} else if (step != ONBOARDING_COMPLETED && step && !path.includes(step)) {
			return NextResponse.redirect(
				new URL(`/app/onboarding/${step}${query}`, request.url),
			);
		}
	}

	return NextResponse.rewrite(new URL(`${fullPath}`, request.url));
}
