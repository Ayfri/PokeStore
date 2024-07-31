import fs from 'fs/promises'; // Using fs/promises for async operations


export async function fetchHoloCards() {
	const cards = await fs.readFile('cards-full.json', 'utf-8');

	const holoCards = cards.flat().filter(group => {
		console.log(`${group.name} / ${group.rarity} / ${group.image} / ${group.set_name} / ${group.price}`);
		return group.rarity && group.rarity.includes('Holo');
	});

	try {
		await fs.writeFile('holo-cards.json', JSON.stringify(holoCards, null, 2));
	} catch (error) {
		console.error('Failed to write holo cards to file:', error);
	}
}
