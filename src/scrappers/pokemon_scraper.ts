import * as fs from "node:fs";
import {POKEMONS_COUNT} from '../constants.ts';
import {POKEMONS} from './files.ts';

type SearchResults = {
	results: {
		name: string,
		url: string
	}[]
};

type DescriptionData = {
	flavor_text_entries: {
		flavor_text: string,
		language: {
			name: string
		}
	}[]
};

export async function fetchPokemons() {
	const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species?limit=${POKEMONS_COUNT}`);
	const json = await response.json() as SearchResults;
	console.log(`Fetched ${json.results.length} pokémons, fetching descriptions...`);

	const fetchPromises = json.results.map(async (pokemon, index) => {
		try {
			const descriptionResponse = await fetch(pokemon.url);
			const descriptionJson = await descriptionResponse.json() as DescriptionData;
			const description = descriptionJson.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text?.replace(/[\n\f\r]/g, ' ') ?? '';
			console.log(`Fetching ${index + 1}/${json.results.length} ${pokemon.name}`);

			return {
				id: index + 1,
				name: pokemon.name,
				description,
			};
		} catch (error) {
			console.log(`Error fetching ${index + 1}/${json.results.length} ${pokemon.name}`);
			return undefined;
		}
	});

	const pokemonsWithDescriptions = await Promise.all(fetchPromises);
	fs.writeFileSync(POKEMONS, JSON.stringify(pokemonsWithDescriptions.filter(pokemon => pokemon)));
}
