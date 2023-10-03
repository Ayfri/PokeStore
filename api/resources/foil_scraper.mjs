import fs from 'fs';
import holoCards from './holo_cards.json' assert {type: "json"};

// card image example: https://images.pokemontcg.io/sm9/1_hires.png
// get foil : https://cdn.malie.io/file/malie-io/tcgl/cards/png/en/sm9/sm9_en_001_std.foil.png
// get etch : https://cdn.malie.io/file/malie-io/tcgl/cards/png/en/sm9/sm9_en_001_std.etch.png

const result = [];

async function getMask() {
    for (const card of holoCards) {
        const card_image_url = card.image;
        const set_id = card_image_url.split('/')[3];
        const card_id = card_image_url.split('/')[4].split('_')[0];
        console.log(`url: ${card_image_url} / set_id: ${set_id} / card_id: ${card_id}`);
        const foil_url = `https://cdn.malie.io/file/malie-io/tcgl/cards/png/en/${set_id}/${set_id}_en_${card_id.padStart(3, '0')}_std.foil.png`;
        console.log(`          >>>> foil_url: ${foil_url}`);
        const etch_url = `https://cdn.malie.io/file/malie-io/tcgl/cards/png/en/${set_id}/${set_id}_en_${card_id.padStart(3, '0')}_std.etch.png`;
        console.log(`          >>>> etch_url: ${etch_url}`);
    }
}

await getMask();

