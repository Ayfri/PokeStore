import {migrate} from '../scripts/imports';

export async function GET() {
	await migrate();

	return new Response('ok');
}
