import prisma from '../../prisma.ts';
import type {APIContext} from 'astro';
import {errorResponse, parameters} from '../../utils.ts';

interface Credentials {
	username: string;
	password: string;
}

const prismaClient = prisma();

export async function POST({url}: APIContext) {
	const credentials = parameters<Credentials>(url);

	const user = await prismaClient.users.findFirst({
		where: {
			username: credentials.username, AND: {
				password: credentials.password,
			},
		},
	});

	if (!user) return errorResponse('Invalid username or password.', 401);

	return user;
}
