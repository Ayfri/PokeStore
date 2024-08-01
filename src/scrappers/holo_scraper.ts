import * as fs from 'node:fs/promises';
import type {Card} from '../types'; // Using fs/promises for async operations


export async function fetchHoloCards() {
	const cards = JSON.parse(await fs.readFile('cards-full.json', 'utf-8')).flat() as Card[];

	const holoCards = cards.filter(card => {
		console.log(`Pokémon n°${card.numero} / ${card.rarity} / ${card.image} / ${card.set_name} / ${card.price}`);
		return card.rarity && card.rarity.includes('Holo');
	});

	try {
		await fs.writeFile('holo-cards.json', JSON.stringify(holoCards, null, 2));
	} catch (error) {
		console.error('Failed to write holo cards to file:', error);
	}
}
