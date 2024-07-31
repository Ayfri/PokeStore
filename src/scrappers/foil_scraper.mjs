// URLs format:
// card image example: https://images.pokemontcg.io/sm9/1_hires.png
// get foil : https://cdn.malie.io/file/malie-io/tcgl/cards/png/en/sm9/sm9_en_001_std.foil.png
// get etch : https://cdn.malie.io/file/malie-io/tcgl/cards/png/en/sm9/sm9_en_001_std.etch.png

import fs from 'fs/promises';

async function getCardMasks() {
	const holoCards = JSON.parse(await fs.readFile('holo_cards.json', 'utf-8'));

	for (const card of holoCards) {
		const urlSegments = card.image.split('/');
		if (urlSegments.length < 5) {
			console.error(`Invalid card image URL: ${card.image}`);
			continue;
		}

		const set_id = urlSegments[3];
		const card_id = urlSegments[4].split('_')[0].padStart(3, '0');

		console.log(`URL: ${card.image} / Set ID: ${set_id} / Card ID: ${card_id}`);

		const foil_url = `https://cdn.malie.io/file/malie-io/tcgl/cards/png/en/${set_id}/${set_id}_en_${card_id}_std.foil.png`;
		console.log(`>>>> Foil URL: ${foil_url}`);

		const etch_url = `https://cdn.malie.io/file/malie-io/tcgl/cards/png/en/${set_id}/${set_id}_en_${card_id}_std.etch.png`;
		console.log(`>>>> Etch URL: ${etch_url}`);
	}
}
