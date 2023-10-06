import type {APIContext} from 'astro';
import prisma from '../../prisma.ts';
import {newId} from '../../random.ts';
import {errorResponse, formData, jsonResponse} from '../../utils.ts';

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

	/*todo: make every fields required*/
	/*todo: get every types (only first one got)*/
	/*todo: display error/success in front*/
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

	if(searchParam === 'add') {
		if (existingPokemon) return errorResponse('Pokemon already exists.', 409);
	}

	const pokemon = await prismaClient.pokemons.create({
		data: {
			id: newId(), description, name, numero, type,
		},
	});


	if (!pokemon) return errorResponse('Unknown error.');
	return jsonResponse(pokemon);
}
