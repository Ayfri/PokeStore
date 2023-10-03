export async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function jsonResponse(obj: any) {
	return new Response(JSON.stringify(obj,
		(key, value) => {
			return typeof value === 'bigint' ? parseInt(value.toString()) : value;
		}), {
		headers: {
			'Content-Type': 'application/json',
		}
	});
}
