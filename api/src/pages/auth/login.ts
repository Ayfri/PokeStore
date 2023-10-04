import type {APIContext} from 'astro';
import prisma from '../../prisma.ts';
import {errorResponse, formData, jsonResponse} from '../../utils.ts';

interface Credentials {
	username: string;
	password: string;
}

const prismaClient = prisma();

export async function POST({request}: APIContext) {
	const credentials = formData<Credentials>(request);

	const user = await prismaClient.users.findFirst({
		where: {
			username: credentials.username, AND: {
				password: credentials.password,
			},
		},
	});

	if (!user) return errorResponse('Invalid username or password.', 401);

	return jsonResponse(user);
}
