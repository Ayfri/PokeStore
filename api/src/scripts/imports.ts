import type {Prisma} from '@prisma/client';
import cards from '../../resources/cards.json'; /*todo: add old before push*/
import pokemons from '../../resources/pokemons.json';
import sets from '../../resources/sets.json';
import prisma from '../prisma.ts';
import {newId} from '../random.ts';

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
	console.log(`Pushing ${pokemons.length} pokemons`);
	await prismaClient.pokemons.createMany({
		data: pokemons.map((pokemon) => ({
			id: newId(),
			description: pokemon.description,
			name: pokemon.name.replace(/ [♀♂] /, ''),
			numero: pokemon.id,
			type: pokemon.types.join(','),
		})),
	});
}

type Card = {
	name: string; rarity?: string; image: string; numero: string; set_name: string; price?: number; types: string;
};

type Pokemon = {
	id: any;
	description?: string;
	name: any;
	numero: any;
	type?: string;
};

async function getCard(card: Card, pokemon: Pokemon) {
	const set = await prismaClient.sets.findFirst({
		where: {
			name: {
				equals: card.set_name,
			}
		},
	});

	if (set === null || !pokemon) {
		console.log(`Missing set or pokemon for card '${card.name}', set '${card.set_name}', found set '${set?.name}', found pokemon '${pokemon?.name}'`);
		return null;
	}

	if (!card.rarity) {
		console.log(`Missing rarity for card '${card.name}', set '${card.set_name}', pokemon '${card.name}'`);
	}

	return {
		id: newId(),
		imageUrl: card.image,
		pokemonId: pokemon.id,
		price: card.price || null,
		rarity: card.rarity || "Unknown",
		setId: set.id,
		types: card.types.replace(' ', ''),
	};
}

async function pushCards() {
	console.log(`Pushing ${cards.length} cards`);
	const pokemons = await prismaClient.pokemons.findMany();
	const values = pokemons.sort((a, b) => a.numero - b.numero).map(async (pokemon) => {
		return cards.flat().filter((card) => {
			const cardNumbers = card.numero.replaceAll(' ', '').split(',');
			return cardNumbers.includes(pokemon.numero.toString());
		}).map((card) => getCard(card, pokemon));
	});

	const data = await Promise.all(values);
	const result = (await Promise.all(data.flat())).filter((card) => card !== null) as Array<Prisma.CardsCreateManyInput>;

	// remove duplicates
	const filtered = result.filter((card, index, self) =>
		index === self.findIndex((t) => t.pokemonId === card.pokemonId && t.setId === card.setId)
	);

	await prismaClient.cards.createMany({
		data: filtered,
	});
}

async function removeAll() {
	await prismaClient.pokemons.deleteMany({});
	await prismaClient.sets.deleteMany({});
	await prismaClient.cards.deleteMany({});
}

export async function migrate() {
	await removeAll();
	await pushSets();
	await pushPokemons();
	await pushCards();
}
