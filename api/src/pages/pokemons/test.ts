import {migrate} from '../../scripts/imports.ts';

export async function GET() {
	await migrate();

	return new Response('ok');
}
