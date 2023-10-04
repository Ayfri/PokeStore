export function jsonResponse(obj: any) {
	return new Response(JSON.stringify(obj, (key, value) => {
		return typeof value === 'bigint' ? parseInt(value.toString()) : value;
	}), {
		headers: {
			'Content-Type': 'application/json',
		},
	});
}

export function errorResponse(message: string, status: number = 400) {
	return new Response(message, {
		status,
	});
}

export function parameters<T = Record<string, any>>(url: URL): T {
	return Object.fromEntries(url.searchParams.entries()) as T;
}

export async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
