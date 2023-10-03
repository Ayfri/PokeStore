import cards from '../../resources/cards.json';
import sets from '../../resources/sets.json';
import pokemons from '../../resources/pokemons.json';
import prisma from '../prisma.ts';
import type {Prisma} from '@prisma/client';
import {newId} from '../random.ts';
import {sleep} from '../utils.ts';

const prismaClient = prisma();

async function pushSets() {
	console.log(`Pushing ${sets.length} sets`);
	await prismaClient.sets.createMany({
		data: sets.map((set) => ({
			id: newId(),
			imageUrl: set.logo,
			name: set.name,
		})),
	});
}

async function pushPokemons() {
	console.log(`Pushing ${pokemons.pokemon.length} pokemons`);
	await prismaClient.pokemons.createMany({
		data: pokemons.pokemon.map((pokemon) => ({
			id: newId(),
			name: pokemon.name.replace(/ [♀♂] /, ''),
			description: 'DESCRIPTION NOT FOUND',
			numero: parseInt(pokemon.num),
			type: pokemon.type.join(','),
		})),
	});
}

async function pushCards() {
	console.log(`Pushing ${cards.length} cards`);
	const pokemons = await prismaClient.pokemons.findMany();
	const [data] = await Promise.all([
		cards.map((pokemonCards) => pokemonCards.map(async (card) => {
			const set = await prismaClient.sets.findFirst({
				where: {
					name: {
						contains: card.set_name,
					}
				},
			});

			const pokemon = pokemons.find((pokemon) => card.name.toLowerCase().includes(pokemon.name.toLowerCase()));

			if (set === null || !pokemon) {
				console.log(`Missing set or pokemon for card '${card.name}', set '${card.set_name}', pokemon '${card.name}', found set '${set?.name}', found pokemon '${pokemon?.name}'`);
				return null;
			}

			if (!card.rarity) {
				console.log(`Missing rarity for card '${card.name}', set '${card.set_name}', pokemon '${card.name}'`);
			}

			return ({
				id: newId(),
				price: card.price || null,
				imageUrl: card.image,
				rarity: card.rarity || "Unknown",
				setId: set.id,
				pokemonId: pokemon.id,
			});
		})).flat(),
	]);

	const result = (await Promise.all(data)).filter((card) => card !== null) as Array<Prisma.CardsCreateManyInput>;

	await prismaClient.cards.createMany({
		data: result,
	});
}

async function removeAllSetsAndPokemons() {
	await prismaClient.cards.deleteMany({});
	await prismaClient.sets.deleteMany({});
}

export async function migrate() {
	await removeAllSetsAndPokemons();
	await pushSets();
	await pushPokemons();
	await sleep(500);
	await pushCards();
}
