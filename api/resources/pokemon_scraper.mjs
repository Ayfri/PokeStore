import fs from "fs";
import {numberOfPokemons} from './constants.mjs';

async function fetchPokemons() {
	const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species?limit=${numberOfPokemons}`);
	const json = await response.json();
	console.log(`Fetched ${json.results.length} pokemons`);
	const fetchPromises = json.results.map(async (pokemon, index) => {
		const descriptionResponse = await fetch(pokemon.url);
		const descriptionJson = await descriptionResponse.json();
		const description = descriptionJson.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text?.replace(/[\n\f\r]/g, ' ') ?? '';
		console.log(`Fetching ${index + 1}/${json.results.length} ${pokemon.name}`);

		return {
			id: index + 1,
			name: pokemon.name,
			description,
			types: [],
		};
	});

	return await Promise.all(fetchPromises);
}

const pokemonsWithDescriptions = await fetchPokemons();
fs.writeFileSync('pokemons-full.json', JSON.stringify(pokemonsWithDescriptions, null, 2));
