import fs from 'fs';
import {fetchPokemons} from '../scrappers/pokemon_scraper.mjs';
import {fetchCards, fetchSets} from '../scrappers/tcg_call.mjs';
import {fetchPokemonTypes} from '../scrappers/types_scraper.mjs';
import type {Card, Pokemon, Set} from '../types';

export async function getPokemons() {
	if (fs.existsSync('./pokemons-full.json')) {
		return JSON.parse(fs.readFileSync('./pokemons-full.json', 'utf-8')) as Pokemon[];
	}

	await fetchPokemons();
	return getPokemons();
}

export async function getCards() {
	if (fs.existsSync('./cards-full.json')) {
		const cardData = JSON.parse(fs.readFileSync('./cards-full.json', 'utf-8')).flat() as Card[];
		return cardData.map(card => {
			card.rarity ??= 'Unknown';
			return card;
		});
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
