import type {APIContext} from 'astro';
import prisma from '../../prisma.ts';
import {SESSION_TOKEN} from '../../constants.ts';

const prismaClient = prisma();

export async function POST({cookies}: APIContext) {
	if (!cookies.has(SESSION_TOKEN)) return new Response('Unauthorized.', {status: 401});
	const sessionToken = cookies.get(SESSION_TOKEN);

	const session = await prismaClient.sessions.count({
		where: {
			id: sessionToken.value,
		},
	});

	if (!session) return new Response('Unauthorized.', {status: 401});

	await prismaClient.sessions.delete({
		where: {
			id: sessionToken.value,
		},
	});

	return new Response('ok', {
		status: 200,
	});
}
