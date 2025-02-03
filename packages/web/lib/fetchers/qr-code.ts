import { API_DOMAIN } from '@/lib/constants/main';

const BASE_URL = `${API_DOMAIN}/v1/wpp/instance`;

export async function getQrCode(token: string, identification: string) {
	const response = await fetch(
		`${BASE_URL}/connect/${token}?name=${encodeURIComponent(identification)}`,
		{ credentials: 'include', keepalive: true },
	);

	const result = await response.text();
	if (!response.ok) {
		throw new Error(result);
	}

	return result as string;
}

interface Instance {
	id: string;
	name: string;
	connectionStatus: 'open' | 'connecting' | 'close';
	number: string;
	token: string;
}

export async function getInstance(token: string): Promise<Instance> {
	const response = await fetch(`${API_DOMAIN}/v1/wpp/instance/${token}`, {
		credentials: 'include',
		keepalive: true,
	});

	if (!response.ok) {
		const err = await response.text();
		throw new Error(err);
	}

	const json = await response.json();
	return json;
}
