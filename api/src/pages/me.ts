import type {APIContext} from 'astro';
import prisma from '../prisma.ts';
import {jsonResponse} from '../utils.ts';
import {SESSION_TOKEN} from '../constants.ts';


const prismaClient = prisma();

export async function GET({cookies}: APIContext) {
	if (!cookies.has(SESSION_TOKEN)) return new Response('Unauthorized.', {status: 401});
	const sessionToken = cookies.get(SESSION_TOKEN);

	const session = await prismaClient.sessions.findUnique({
		where: {
			id: sessionToken.value,
		},
		include: {
			user: true,
		},
	});

	if (!session) return new Response('Unauthorized.', {status: 401});

	return jsonResponse(session.user);
}
