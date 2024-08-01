import fs from 'fs';
import {fetchHoloCards} from '../scrappers/holo_scraper';
import {fetchPokemons} from '../scrappers/pokemon_scraper';
import {fetchCards, fetchSets} from '../scrappers/tcg_call';
import {fetchPokemonTypes} from '../scrappers/types_scraper';
import type {Card, Pokemon, Set} from '../types';

export async function getPokemons() {
	if (fs.existsSync('./pokemons-full.json')) {
		return JSON.parse(fs.readFileSync('./pokemons-full.json', 'utf-8')) as Pokemon[];
	}

	await fetchPokemons();
	return getPokemons();
}

export async function getCards() {
	const pokemons = await getPokemons();
	const sets = await getSets();
	if (fs.existsSync('./cards-full.json')) {
		const cardData = JSON.parse(fs.readFileSync('./cards-full.json', 'utf-8')).flat() as Card[];
		return cardData.map(card => {
			card.rarity ??= 'Unknown';
			card.pokemon = pokemons.find(pokemon => pokemon.id === parseInt(card.numero));
			card.set = sets.find(set => set.name === card.set_name);

			return card;
		}).filter(card => card.pokemon);
	}

	await fetchCards();
	return getCards();
}

export async function getSets() {
	if (fs.existsSync('./sets-full.json')) {
		return JSON.parse(fs.readFileSync('./sets-full.json', 'utf-8')) as Set[];
	}

	await fetchSets();
	return getSets();
}

export async function getTypes() {
	if (fs.existsSync('./types.json')) {
		return JSON.parse(fs.readFileSync('./types.json', 'utf-8')) as string[];
	}

	await fetchPokemonTypes();
	return getTypes();
}

export async function getRarities() {
	const cards = await getCards();
	return [...new Set(cards.map(card => card.rarity).filter(rarity => rarity))];
}

export async function getHoloFoilsCards() {
	if (fs.existsSync('./holo-foils.json')) {
		return JSON.parse(fs.readFileSync('./holo-foils.json', 'utf-8')) as Card[];
	}

	await fetchHoloCards();
	return getHoloFoilsCards();
}
