import fs from 'fs';
import cards from './cards.json' assert {type: "json"};

const cards_types = [];

const cardsFlat = cards.flat().map(group => {
    let card_types;
    if (group.types.includes(',')) {
        card_types = group.types.split(', ');
    } else {
        card_types = [group.types];
    }
    for (const type of card_types) {
        if (!cards_types.includes(type)) {
            cards_types.push(type);
            console.log(`Added ${type} to types`)
        }
    }
});

console.log(cardsFlat.length);
console.log(cards_types.length);

fs.writeFileSync('types.json', JSON.stringify(cards_types, null, 2))