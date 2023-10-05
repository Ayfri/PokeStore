import type {APIContext} from 'astro';
import prisma from '../../prisma.ts';
import {errorResponse, formData} from '../../utils.ts';
import {newToken} from '../../random.ts';

interface Credentials {
	username: string;
	password: string;
}

const prismaClient = prisma();

export async function POST({request}: APIContext) {
	const credentials = await formData<Credentials>(request);

	const user = await prismaClient.users.findFirst({
		where: {
			username: credentials.username,
			AND: {
				password: credentials.password,
			},
		},
	});

	if (!user) return errorResponse('Invalid username or password.', 401);

	const token = newToken();
	await prismaClient.sessions.create({
		data: {
			id: token,
			userId: user.id,
		},
	});

	return new Response(token, {status: 200});
}
