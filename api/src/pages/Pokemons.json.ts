import type {APIRoute} from 'astro';

type Parameters = APIRoute & {
	params: {
		id: number
	}
}

export async function GET({params}: Parameters) {
	return new Response(JSON.stringify({
		name: 'Astro',
		url: 'https://astro.build/',
	}));
}
