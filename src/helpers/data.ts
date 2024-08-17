import fs from 'fs';
import {CARDS, HOLO_CARDS, POKEMONS, SETS, TYPES} from '../scrappers/files.ts';
import {fetchHoloCards} from '../scrappers/holo_scraper';
import {fetchPokemons} from '../scrappers/pokemon_scraper';
import {fetchCards, fetchSets} from '../scrappers/tcg_call';
import {fetchPokemonTypes} from '../scrappers/types_scraper';
import type {Card, Pokemon, Set} from '../types';

export async function getPokemons() {
	if (fs.existsSync(POKEMONS)) {
		return JSON.parse(fs.readFileSync(POKEMONS, 'utf-8')) as Pokemon[];
	}

	await fetchPokemons();
	return getPokemons();
}

export async function getCards() {
	const pokemons = await getPokemons();
	if (fs.existsSync(CARDS)) {
		if (!fs.existsSync(SETS)) {
			await fetchSets();
		}

		const sets = await getSets();
		const cardData = JSON.parse(fs.readFileSync(CARDS, 'utf-8')).flat() as Card[];
		return cardData.map(card => {
			card.rarity ??= 'Unknown';
			card.pokemon = pokemons.find(pokemon => pokemon.id === parseInt(card.numero))!;
			card.set = sets.find(set => set.name === card.set_name)!;

			return card;
		}).filter(card => card.pokemon);
	}

	await fetchCards();
	return getCards();
}

export async function getSets() {
	if (fs.existsSync(SETS)) {
		return JSON.parse(fs.readFileSync(SETS, 'utf-8')) as Set[];
	}

	await getCards();
	await fetchSets();
	return getSets();
}

export async function getTypes() {
	if (fs.existsSync(TYPES)) {
		return JSON.parse(fs.readFileSync(TYPES, 'utf-8')) as string[];
	}

	await getCards();
	await fetchPokemonTypes();
	return getTypes();
}

export async function getRarities() {
	const cards = await getCards();
	return [...new Set(cards.map(card => card.rarity).filter(rarity => rarity))];
}

export async function getHoloFoilsCards() {
	if (fs.existsSync(HOLO_CARDS)) {
		return JSON.parse(fs.readFileSync(HOLO_CARDS, 'utf-8')) as Card[];
	}

	await getCards();
	await fetchHoloCards();
	return getHoloFoilsCards();
}
