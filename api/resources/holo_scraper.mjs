import fs from 'fs';
import cards from './cards-old.json' assert {type: 'json'};

const holoCards = [];

cards.flat().map(group => {
	console.log(`${group.name} / ${group.rarity} / ${group.image} / ${group.set_name} / ${group.price}`);
	if (group.rarity) {
		if (group.rarity.includes('Holo')) {
			holoCards.push(group);
		}
	}
});

fs.writeFileSync('holo_cards.json', JSON.stringify(holoCards, null, 2));
