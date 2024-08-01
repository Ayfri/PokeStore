import * as fs from "node:fs";
import {numberOfPokemons} from '../constants';

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
	const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species?limit=${numberOfPokemons}`);
	const json = await response.json() as SearchResults;
	console.log(`Fetched ${json.results.length} pokemons`);

	const fetchPromises = json.results.map(async (pokemon, index) => {
		const descriptionResponse = await fetch(pokemon.url);
		const descriptionJson = await descriptionResponse.json() as DescriptionData;
		const description = descriptionJson.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text?.replace(/[\n\f\r]/g, ' ') ?? '';
		console.log(`Fetching ${index + 1}/${json.results.length} ${pokemon.name}`);

		return {
			id: index + 1,
			name: pokemon.name,
			description,
			types: [],
		};
	});

	const pokemonsWithDescriptions = await Promise.all(fetchPromises);
	fs.writeFileSync('pokemons-full.json', JSON.stringify(pokemonsWithDescriptions, null, 2));
}
