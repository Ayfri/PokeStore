import pokemon from 'pokemontcgsdk';
import {configDotenv} from "dotenv";
// noinspection ES6UnusedImports
import fs from "fs";


const dotenv = configDotenv({
	path: '../.env',
});

const maxPokemon = 1015;

pokemon.configure({apiKey: dotenv.parsed['POKEMON_TCG_API_KEY']});

async function getPokemon(index) {
	/**
	 * @type {import('pokemontcgsdk').Card[]}
	 */
	const cards = await pokemon.card.all({
		q: `nationalPokedexNumbers:${index}`,
		orderBy: 'nationalPokedexNumbers',
		select: 'name,rarity,images,set,cardmarket,types,nationalPokedexNumbers',
	});

	if (cards.length === 0) {
		console.log(`Pokedex: ${index}/${maxPokemon}, no cards found !`);
		return [];
	}

	console.log(`Pokedex: ${index}/${maxPokemon}, caught ${cards[0].name} ! (${cards.length} cards)`);

	const filteredCards = cards.map(card => ({
		name: card.name,
		rarity: card.rarity,
		image: card.images.large,
		numero: card.nationalPokedexNumbers.join(', '),
		set_name: card.set.name,
		price: card?.cardmarket?.prices?.averageSellPrice || card?.tcgplayer?.prices?.holofoil?.market || card?.tcgplayer?.prices?.reverseHolofoil?.market ||
			card?.tcgplayer?.prices?.normal?.market || card?.tcgplayer?.prices?.["1stEditionHolofoil"]?.market ||
			card?.tcgplayer?.prices?.["1stEditionNormal"]?.market,
		types: card.types.join(', '),
	})).sort((a, b) => b.price - a.price);

	return filteredCards;
}

async function getSet() {
	/**
	 * @type {import('pokemontcgsdk').Set[]}
	 */
	const sets = await pokemon.set.all({
		select: 'name,images',
	});

	console.log(`Found ${sets.length} sets !`);

	sets.map(set => ({
		name: set.name,
		logo: set.images.logo,
	}));

	// filter by cards
	const cardsJson = await import('./cards-old.json', {
		assert: {type: 'json'},
	});

	const cards = cardsJson.default.flat();
	const setsWithCards = sets.filter(set => cards.some(card => card.set_name === set.name));

	// remove duplicate names
	const uniqueNames = [...new Set(setsWithCards.map(set => set.name))];
	return uniqueNames.map(name => ({
		name: name,
		logo: sets.find(set => set.name === name).images.logo,
	}));
}


// UNCOMMENT TO GET POKÉMONS
// const promises = Array.from({length: maxPokemon}, (_, i) => getPokemon(i + 1));
// const pokemonGroups = promises.map((promise, index) => (

const pokemonGroups = [];
for (let i = 0; i < maxPokemon; i += 2) {
	const pokemonGroup = await Promise.all([
		getPokemon(i + 1),
		getPokemon(i + 2)
	]);
	pokemonGroups.push(...pokemonGroup);
}
fs.writeFileSync('cards-full.json', JSON.stringify(pokemonGroups, null, 2));


// UNCOMMENT TO GET SETS
const sets = await getSet();
console.log(`Filtered sets, writing ${sets.length} sets !`);
fs.writeFileSync('sets-full.json', JSON.stringify(sets, null, 2));
