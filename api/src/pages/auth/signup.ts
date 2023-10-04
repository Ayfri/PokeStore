import prisma from '../../prisma.ts';
import type {APIContext} from 'astro';
import {errorResponse, parameters} from '../../utils.ts';
import {newId} from '../../random.ts';

interface Credentials {
	email: string;
	password: string;
	username: string;
}

const prismaClient = prisma();

function checkValue(value: string, regex: RegExp, min: number, max: number, name: string, message: string = `Invalid ${name.toLowerCase()}.`) {
	if (value.match(regex) === null) return errorResponse(message);
	if (value.length < min) return errorResponse(`${name} must be at least ${min} characters long.`);
	if (value.length > max) return errorResponse(`${name} must be at most ${max} characters long.`);
}

export async function POST({url}: APIContext) {
	const {password, email, username} = parameters<Credentials>(url);
	checkValue(password, /^[a-zA-Z0-9]{8,}$/, 8, 40, 'Password', 'Password must be at least 8 characters long and contain only letters and numbers.');
	checkValue(username, /^[a-zA-Z0-9]{3,}$/, 3, 32, 'Username');
	checkValue(email, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 5, 500, 'Email', 'Invalid email address.');

	const user = await prismaClient.users.create({
		data: {
			id: newId(), username, password, email,
		},
	});

	if (!user) return errorResponse('Unknown error.');
	return user;
}
