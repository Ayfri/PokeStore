import pokemons from './pokemons.json' assert {type: 'json'};
import fs from "fs";

async function addDescriptions() {
	const fetchPromises = pokemons.map(async pokemon => {
		const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}/`);
		const json = await response.json();
		pokemon.description = json.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text.replace(/[\n\f\r]/g, ' ');
		return pokemon;
	});

	return await Promise.all(fetchPromises);
}

const pokemonsWithDescriptions = await addDescriptions();
fs.writeFileSync('pokemons.json', JSON.stringify(pokemonsWithDescriptions, null, 2));
