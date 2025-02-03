import { cookies } from 'next/headers';
import { fetcher } from '@/lib/functions/fetcher';
import { EVO_API_KEY } from '../constants/main';

interface SWRError extends Error {
	status: number;
}

export async function authFetch<JSON = unknown>(
	input: RequestInfo,
	init?: RequestInit,
): Promise<JSON> {
	const cookiesStore = await cookies();
	return fetcher(input, {
		...(init || {}),
		headers: {
			...(init?.headers || {}),
			Cookie: cookiesStore.toString(),
		},
	});
}

export async function simpleAuthFetch<Text = unknown>(
	input: RequestInfo,
	init?: RequestInit,
): Promise<Text> {
	const cookiesStore = await cookies();
	const response = await fetch(input, {
		...(init || {}),
		headers: {
			...(init?.headers || {}),
			Cookie: cookiesStore.toString(),
		},
	});

	if (!response.ok) {
		const error = await response.text();
		const err = new Error(error) as SWRError;
		err.status = response.status;
		throw err;
	}

	return response.text() as Text;
}

export async function evoFetcher<JSON = unknown>(
	input: RequestInfo,
	init?: RequestInit,
): Promise<JSON> {
	return authFetch(input, {
		...(init || {}),
		headers: {
			...(init?.headers || {}),
			apikey: EVO_API_KEY,
		},
	});
}
