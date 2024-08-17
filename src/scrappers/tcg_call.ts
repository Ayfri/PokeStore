import * as fs from 'node:fs/promises';
import pokemon from 'pokemontcgsdk';
import {POKEMONS_COUNT} from '../constants';
import type {Card} from '../types';
import {CARDS, SETS} from './files.ts';

// Load and configure environment variables
const apiKey = import.meta.env.POKEMON_TCG_API_KEY;

if (!apiKey) {
	throw new Error('Pokémon TCG API key is missing from .env file, key: POKEMON_TCG_API_KEY');
}

pokemon.configure({apiKey});

type FetchedCard = {
	id: string;
	name: string;
	rarity: string;
	images: {
		small: string;
		large: string;
	};
	nationalPokedexNumbers: number[];
	set: {
		name: string;
	};
	cardmarket: {
		prices: {
			averageSellPrice: number;
		};
	};
	tcgplayer?: {
		prices?: {
			holofoil?: {
				market?: number;
			};
			reverseHolofoil?: {
				market?: number;
			};
			normal?: {
				market?: number;
			};
			"1stEditionHolofoil"?: {
				market?: number;
			};
			"1stEditionNormal"?: {
				market?: number;
			};
		};
	};
	types: string[];
};

async function fetchPokemon(index: number) {
	try {
		return await pokemon.card.all({
			q: `nationalPokedexNumbers:${index}`,
			orderBy: 'nationalPokedexNumbers',
			select: 'name,rarity,images,set,cardmarket,types,nationalPokedexNumbers',
		}) as FetchedCard[];
	} catch (e) {
		if (!(e instanceof Error)) {
			console.error(`Pokedex: ${index}/${POKEMONS_COUNT}, error: ${e}, retrying...`);
			await new Promise(resolve => setTimeout(resolve, 3000));
			return fetchPokemon(index);
		}

		if (e.message.includes('429')) {
			console.error(`Pokedex: ${index}/${POKEMONS_COUNT}, rate limit reached, retrying...`);
			await new Promise(resolve => setTimeout(resolve, 5000));
			return fetchPokemon(index);
		}
	}
}

async function getPokemon(index: number) {
	const cards = await fetchPokemon(index);

	if (!cards) {
		console.log(`Pokedex: ${index}/${POKEMONS_COUNT}, no cards found for this Pokémon!`);
		return [];
	}

	if (cards.length === 0) {
		console.log(`Pokedex: ${index}/${POKEMONS_COUNT}, no cards found!`);
		return [];
	}

	console.log(`Pokedex: ${index}/${POKEMONS_COUNT}, caught ${cards[0].name}! (${cards.length} cards)`);

	const fetchedCards = cards.map(async (card: FetchedCard) => {
		const tcgplayerPrices = card?.tcgplayer?.prices ?? {};

		const price = card.cardmarket?.prices?.averageSellPrice || tcgplayerPrices.holofoil?.market ||
			tcgplayerPrices.reverseHolofoil?.market ||
			tcgplayerPrices.normal?.market || tcgplayerPrices["1stEditionHolofoil"]?.market ||
			tcgplayerPrices["1stEditionNormal"]?.market;

		const smallImageURL = card.images.small;
		const image = await fetch(smallImageURL);
		const buffer = await image.arrayBuffer();
		const bufferView = new Uint8Array(buffer);
		const meanColor = bufferView.reduce(
			(acc, val, i, arr) => {
				if (i % 4 === 3) return acc;
				const index = Math.floor(i / 4);
				const color = index % 3;
				acc[color] += val / (arr.length / 4);
				return acc;
			},
			[
				0,
				0,
				0,
			],
		).map(Math.round);
		const meanColorHex = meanColor.map(val => val.toString(16).padStart(2, '0')).join('');

		return {
			id: card.id,
			image: card.images.large,
			meanColor: meanColorHex,
			name: card.name,
			numero: card.nationalPokedexNumbers.join(', '),
			price,
			rarity: card.rarity,
			set_name: card.set.name,
			types: card.types.join(', '),
		};
	});
	const allCards = await Promise.all(fetchedCards);
	return allCards.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
}

type FetchedSet = {
	name: string;
	images: {
		logo: string;
	};
};

async function fetchAndFilterSets() {
	const sets = await pokemon.set.all({
		select: 'name,images',
	}) as FetchedSet[];

	console.log(`Found ${sets.length} sets!`);

	const setsData = sets.map(set => ({
		name: set.name,
		logo: set.images.logo,
	}));

	try {
		const cardsJson = JSON.parse(await fs.readFile(CARDS, 'utf-8'));

		const cards = cardsJson.flat() as Card[];
		const setsWithCards = sets.filter(set => cards.some(card => card.set_name === set.name));
		const uniqueNames = [...new Set(setsWithCards.map(set => set.name))];

		return uniqueNames.map(name => ({
			name,
			logo: sets.find(set => set.name === name)?.images?.logo,
		}));
	} catch (error) {
		console.error(`Error reading ${CARDS}`, error);
		return setsData;
	}
}

export async function fetchCards() {
	const pokemonGroups = [];
	const interval = 10;

	for (let i = 0; i <= POKEMONS_COUNT; i += interval) {
		await new Promise(resolve => setTimeout(resolve, 7500));
		const promises = Array.from({length: interval}, (_, j) => getPokemon(i + j + 1));
		const result = await Promise.all(promises);
		pokemonGroups.push(...result);
	}

	await fs.writeFile(CARDS, JSON.stringify(pokemonGroups.flat()));
	console.log(`Finished writing Pokémon cards to ${CARDS}`);
}

export async function fetchSets() {
	const sets = await fetchAndFilterSets();
	console.log(`Filtered sets, writing ${sets.length} sets!`);
	await fs.writeFile(SETS, JSON.stringify(sets));
	console.log(`Finished writing sets to ${SETS}`);
}
