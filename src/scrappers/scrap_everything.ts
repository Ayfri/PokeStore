import fs from 'node:fs';
import {fetchPokemons} from './pokemon_scraper.mjs';
import {fetchCards} from './tcg_call.mjs';

export async function scrapEverything() {
	if (fs.existsSync('./pokemons-full.json')) {
		return;
	}

	await fetchPokemons();
	await fetchCards();
	const {fetchPokemonTypes} = await import('./types_scraper.mjs');
	await fetchPokemonTypes();
}
