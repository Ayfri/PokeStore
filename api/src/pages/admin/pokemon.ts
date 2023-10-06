import type {APIContext} from 'astro';
import prisma from '../../prisma.ts';
import {newId} from '../../random.ts';
import {errorResponse, formData} from '../../utils.ts';

interface Pokemon {
	description: string;
	name: string;
	numero: string;
	type: string;
}

const prismaClient = prisma();

export async function POST({request, url}: APIContext) {
	const searchParam = url.searchParams.get('button');
	let {description, name, numero, type} = await formData<Pokemon>(request);
	console.log(`description: ${description}, name: ${name}, numero: ${numero}, type: ${type}`);
	const number = Number.parseInt(numero.toString());
	if (number.toString() !== numero) return errorResponse('Numero must be a number.');

	if (!description || !name || !numero || !type) {
		return errorResponse('Missing fields.');
	}

	/*todo: remove params*/
	const existingPokemon = await prismaClient.pokemons.findFirst({
		where: {
			OR: [
				{numero: number},
				{name},
				{description},
			],
		}
	});

	switch (searchParam) {
		case 'add':
			if (existingPokemon) {
				if (existingPokemon.description === description) return errorResponse('Description already exists.');
				if (existingPokemon.name === name) return errorResponse('Name already exists.');
				if (existingPokemon.numero === number) return errorResponse('Numero already exists.');
			} else {
				const pokemon = await prismaClient.pokemons.create({
					data: {
						id: newId(), description, name, numero: number, type,
					},
				});

				if (!pokemon) return errorResponse('Unknown error.');
				return new Response('Pokemon successfully created!', {
					status: 201,
				});
			}
			break;

		case 'edit':
			if (!existingPokemon) return errorResponse('Pokemon does not exist.');
			if (isNaN(parseInt(number.toString()))) return errorResponse('Numero must be a number.');
			if (existingPokemon.description === description && existingPokemon.name === name && existingPokemon.numero === number && existingPokemon.type === type) return errorResponse('No changes were made.');
			const pokemon = await prismaClient.pokemons.update({
				where: {
					id: existingPokemon.id,
				},
				data: {
					description, name, numero: number, type,
				}
			});

			if (!pokemon) return errorResponse('Unknown error.');
			return new Response('Pokemon successfully edited!', {
				status: 201,
			});
	}
}
