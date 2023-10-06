import type {APIContext} from 'astro';
import prisma from '../../prisma.ts';
import {newId} from '../../random.ts';
import {errorResponse, formData} from '../../utils.ts';

interface Card {
	price: string;
	image: string;
	rarity: string;
	types: string;
	pokemon: string;
	set: string;
}

const prismaClient = prisma();

export async function POST({request, url}: APIContext) {
	const searchParam = url.searchParams.get('button');
	let {price, image, rarity, types, pokemon: pokemonName, set: setName} = await formData<Card>(request);
	console.log(`price: ${price}, image: ${image}, rarity: ${rarity}, types: ${types} pokemon: ${pokemonName} set: ${setName}`);
	const number = Number.parseFloat(price.toString());
	if (number.toString() !== price) return errorResponse('Price must be a number.');

	if (!price || !image || !rarity || !types) {
		return errorResponse('Missing fields.');
	}

	const existingCard = await prismaClient.cards.findFirst({
		include: {
			pokemon: true,
			set: true,
		},
		where: {
			OR: [
				{imageUrl: image},
			],
		}
	});

	const sameCard = await prismaClient.cards.findFirst({
		include: {
			pokemon: true,
			set: true,
		},
		where: {
			AND: [
				{imageUrl: image},
				{
					pokemon: {
						name: pokemonName,
					}
				},
				{
					set: {
						name: setName,
					}
				},
				{rarity},
				{types},
				{price: number},
			],
		}
	});

	const pokemonFull = await prismaClient.pokemons.findFirst({
		where: {
			name: pokemonName,
		}
	});
	if (!pokemonFull) return errorResponse('Pokemon does not exist.');

	const setFull = await prismaClient.sets.findFirst({
		where: {
			name: setName,
		}
	});
	if (!setFull) return errorResponse('Set does not exist.');

	switch (searchParam) {
		case 'add':
			if (existingCard) {
				if (existingCard.imageUrl === image) return errorResponse('Image already exists.');
			} else {
				const card = await prismaClient.cards.create({
					include: {
						pokemon: true,
						set: true,
					},
					data: {
						id: newId(),
						imageUrl: image,
						rarity,
						types,
						price: number,
						pokemonId: pokemonFull.id,
						setId: setFull.id,
					},
				});

				if (!card) return errorResponse('Unknown error.');
				return new Response('Pokemon successfully created!', {
					status: 201,
				});
			}
			break;

		case 'edit':
			if (!existingCard) return errorResponse('Card does not exist.');
			if (isNaN(parseInt(number.toString()))) return errorResponse('Numero must be a number.');
			if (existingCard.imageUrl === image && existingCard.rarity === rarity && existingCard.types === types && existingCard.price === number && existingCard.pokemon.name === pokemonName && existingCard.set.name === setName) return errorResponse('No changes were made.');
			const card = await prismaClient.cards.update({
				where: {
					id: existingCard.id, /*todo: find card.id with a new field called cardId*/
				},
				data: {
					imageUrl: image,
					rarity,
					types,
					price: number,
					pokemonId: pokemonFull.id,
					setId: setFull.id,
				}
			});

			if (!card) return errorResponse('Unknown error.');
			return new Response('Pokemon successfully edited!', {
				status: 201,
			});

		case 'remove':
			if (!sameCard) return errorResponse('Pokemon does not exist.');
			const deletedPokemon = await prismaClient.pokemons.delete({
				where: {
					id: sameCard.id,
				},
			});

			if (!deletedPokemon) return errorResponse('Unknown error.');
			return new Response('Pokemon successfully deleted!', {
				status: 201,
			});
	}

	return errorResponse('Unknown error.');
}
