import type {APIContext} from 'astro';
import prisma from '../../prisma.ts';
import {newId} from '../../random.ts';
import {errorResponse, formData} from '../../utils.ts';

interface Pokemon {
	description: string;
	name: string;
	numero: number;
	type: string;
}

const prismaClient = prisma();

export async function POST({request, url}: APIContext) {
	const searchParam = url.searchParams.get('button');
	let {description, name, numero, type} = await formData<Pokemon>(request);
	console.log(`description: ${description}, name: ${name}, numero: ${numero}, type: ${type}`);
	numero = parseInt(numero.toString());

	if(!description || !name || !numero || !type) {
		return errorResponse('Missing fields.');
	}

	/*todo: edit & remove params*/
	const existingPokemon = await prismaClient.pokemons.findFirst({
		where: {
			OR: [
				{numero},
				{name},
				{description},
			],
		}
	});

	if(searchParam === 'add' && existingPokemon) {
		if (existingPokemon.description === description) return errorResponse('Description already exists.');
		if (existingPokemon.name === name) return errorResponse('Name already exists.');
		if (existingPokemon.numero === numero) return errorResponse('Numero already exists.');
	}

	const pokemon = await prismaClient.pokemons.create({
		data: {
			id: newId(), description, name, numero, type,
		},
	});


	if (!pokemon) return errorResponse('Unknown error.');
	return new Response('Pokemon successfully created!', {
		status: 201,
	})
}
