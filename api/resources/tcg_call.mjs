import pokemon from 'pokemontcgsdk'
import fs from 'fs'

pokemon.configure({apiKey: '786b31c9-ece0-4b34-8a15-7dbf891b7c54'})

// async await version
async function getPokemon(index) {
    /**
     *
     * @type {import('pokemontcgsdk').Card[]}
     */
    const cards = await pokemon.card.all({
        q: `nationalPokedexNumbers:${index}`,
        orderBy: 'nationalPokedexNumbers',
        select: 'name,rarity,images,set,cardmarket'
    })

    console.log(`Pokedex: ${index}/151, caught ${cards[0].name} ! (${cards.length} cards)`)

    return cards.map(card => {
        return {
            name: card.name,
            rarity: card.rarity,
            image: card.images.large,
            set_name: card.set.name,
            price: card?.cardmarket?.prices?.averageSellPrice || card?.tcgplayer?.prices?.holofoil?.market
                || card?.tcgplayer?.prices?.reverseHolofoil?.market || card?.tcgplayer?.prices?.normal?.market
                || card?.tcgplayer?.prices?.["1stEditionHolofoil"]?.market || card?.tcgplayer?.prices?.["1stEditionNormal"]?.market
        }
    }).filter((_, index) => index <= 10).sort((a, b) => {
        return b.price - a.price
    });
}

async function getSet() {
    /**
     *
     * @type {import('pokemontcgsdk').Set[]}
     */
    const sets = await pokemon.set.all({
        select: 'name,images'
    })

    console.log(`Found ${sets.length} sets !`)

    sets.map(set => {
        return {
            name: set.name,
            logo: set.images.logo
        }
    })

    // remove duplicate names
    const uniqueNames = [...new Set(sets.map(set => set.name))];
    return uniqueNames.map(name => {
        return {
            name: name,
            logo: sets.find(set => set.name === name).images.logo
        }
    });
}

//
// UNCOMMENT TO GET POKÉMONS
//
// const pokemonGroups = [];
// for (let i = 1; i <= 151; i++) {
//     pokemonGroups.push(await getPokemon(i));
// }
// fs.writeFileSync('cards.json', JSON.stringify(pokemonGroups, null, 2))

//
// UNCOMMENT TO GET SETS
//
// const sets = await getSet();
// fs.writeFileSync('sets.json', JSON.stringify(sets, null, 2))




