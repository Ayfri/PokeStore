// import cards.json, get every objects that contains "holo" in rarity

import fs from 'fs';
import cards from './cards.json' assert {type: "json"};

const holoCards = [];

const cardsFlat = cards.flat().map(group => {
    console.log(`${group.name} / ${group.rarity} / ${group.image} / ${group.set_name} / ${group.price}`);
    if (group.rarity) {
        if (group.rarity.includes('Holo')) {
            holoCards.push(group);
        }
    }
});

console.log(cardsFlat.length);
console.log(holoCards.length);

fs.writeFileSync('holo_cards.json', JSON.stringify(holoCards, null, 2));
