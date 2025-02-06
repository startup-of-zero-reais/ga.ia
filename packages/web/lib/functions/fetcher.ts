interface SWRError extends Error {
	status: number;
}

const NO_CONTENT = 204;

export async function fetcher<JSON = unknown>(
	input: RequestInfo,
	init?: RequestInit,
): Promise<JSON> {
	const response = await fetch(input, init);

	if (!response.ok) {
		const error = await response.text();
		const err = new Error(error) as SWRError;
		err.status = response.status;
		throw err;
	}

	if (response.status === NO_CONTENT) {
		return null as JSON;
	}

	return response.json();
}

export async function fetcherWithCookies<JSON = unknown>(
	input: RequestInfo,
	init?: RequestInit,
): Promise<JSON> {
	return await fetcher(input, {
		...(init || {}),
		credentials: 'include',
		keepalive: true,
		mode: 'cors',
	});
}
