import {configDotenv} from 'dotenv';
import * as fs from 'node:fs/promises';
import pokemon from 'pokemontcgsdk';
import {numberOfPokemons} from '../constants';
import type {Card} from '../types';

// Load and configure environment variables
const dotenv = configDotenv({path: '.env'});
const apiKey = dotenv?.parsed?.POKEMON_TCG_API_KEY;

if (!apiKey) {
	throw new Error('Pokémon TCG API key is missing from .env file');
}

pokemon.configure({apiKey});

type FetchedCard = {
	name: string;
	rarity: string;
	images: {
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
			console.error(`Pokedex: ${index}/${numberOfPokemons}, error: ${e}, retrying...`);
			await new Promise(resolve => setTimeout(resolve, 2000));
			return fetchPokemon(index);
		}

		if (e.message.includes('429')) {
			console.error(`Pokedex: ${index}/${numberOfPokemons}, rate limit reached, retrying...`);
			await new Promise(resolve => setTimeout(resolve, 4000));
			return fetchPokemon(index);
		}
	}
}

async function getPokemon(index: number) {
	const cards = await fetchPokemon(index);

	if (!cards) {
		console.log(`Pokedex: ${index}/${numberOfPokemons}, no cards found for this Pokémon!`);
		return [];
	}

	if (cards.length === 0) {
		console.log(`Pokedex: ${index}/${numberOfPokemons}, no cards found!`);
		return [];
	}

	console.log(`Pokedex: ${index}/${numberOfPokemons}, caught ${cards[0].name}! (${cards.length} cards)`);

	return cards.map((card: FetchedCard) => {
		const price = card?.cardmarket?.prices?.averageSellPrice || card?.tcgplayer?.prices?.holofoil?.market ||
			card?.tcgplayer?.prices?.reverseHolofoil?.market ||
			card?.tcgplayer?.prices?.normal?.market || card?.tcgplayer?.prices?.["1stEditionHolofoil"]?.market ||
			card?.tcgplayer?.prices?.["1stEditionNormal"]?.market;

		return {
			name: card.name,
			rarity: card.rarity,
			image: card.images.large,
			numero: card.nationalPokedexNumbers.join(', '),
			set_name: card.set.name,
			price,
			types: card.types.join(', '),
		};
	}).sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
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
		const cardsJson = JSON.parse(await fs.readFile('cards-full.json', 'utf-8'));

		const cards = cardsJson.flat() as Card[];
		const setsWithCards = sets.filter(set => cards.some(card => card.set_name === set.name));
		const uniqueNames = [...new Set(setsWithCards.map(set => set.name))];

		return uniqueNames.map(name => ({
			name,
			logo: sets.find(set => set.name === name)?.images?.logo,
		}));
	} catch (error) {
		console.error('Error reading cards-full.json', error);
		return setsData;
	}
}

export async function fetchCards() {
	const pokemonGroups = [];
	const interval = 10;

	for (let i = 0; i <= numberOfPokemons; i += interval) {
		await new Promise(resolve => setTimeout(resolve, 5000));
		const promises = Array.from({length: interval}, (_, j) => getPokemon(i + j + 1));
		const result = await Promise.all(promises);
		pokemonGroups.push(...result);
	}

	await fs.writeFile('cards-full.json', JSON.stringify(pokemonGroups.flat(), null, 2));
	console.log('Finished writing Pokémon cards to cards-full.json');
}

export async function fetchSets() {
	const sets = await fetchAndFilterSets();
	console.log(`Filtered sets, writing ${sets.length} sets!`);
	await fs.writeFile('sets-full.json', JSON.stringify(sets, null, 2));
	console.log('Finished writing sets to sets-full.json');
}
