#!/usr/bin/env node

import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import { fetchPokemonTypes } from './src/scrappers/types_scraper.ts';
import { fetchPokemons } from './src/scrappers/pokemon_scraper.ts';
import { fetchHoloCards } from './src/scrappers/holo_scraper.ts';
import { fetchCards, fetchSets } from './src/scrappers/tcg_call.ts';
import { getCardMasks } from './src/scrappers/foil_scraper.ts';

interface ScraperOption {
    name: string;
    description: string;
    action: () => Promise<void>;
}

const scrapers: ScraperOption[] = [
    {
        name: 'cards',
        description: 'Fetch all Pokémon cards from TCG API',
        action: fetchCards
    },
    {
        name: 'foil',
        description: 'Generate foil URLs for holo cards',
        action: getCardMasks
    },
    {
        name: 'holo',
        description: 'Extract holographic cards from cards dataset',
        action: fetchHoloCards
    },
    {
        name: 'pokemons',
        description: 'Fetch all Pokémon data from PokéAPI',
        action: fetchPokemons
    },
    {
        name: 'sets',
        description: 'Fetch all card sets from TCG API',
        action: fetchSets
    },
    {
        name: 'types',
        description: 'Extract all Pokémon types from cards dataset',
        action: fetchPokemonTypes
    },
];

async function main() {
    console.log(chalk.blue.bold('=== Pokémon Data Scraper CLI ==='));
    console.log(chalk.gray('Select a scraper to run:'));

    const choice = await select({
        message: 'Choose a scraper to run:',
        choices: scrapers.map(scraper => ({
            name: `${chalk.green(scraper.name)} - ${scraper.description}`,
            value: scraper.name,
        })),
    });

    const selectedScraper = scrapers.find(scraper => scraper.name === choice);

    if (selectedScraper) {
        console.log(chalk.yellow(`Running ${selectedScraper.name} scraper...`));
        try {
            await selectedScraper.action();
            console.log(chalk.green(`✓ ${selectedScraper.name} scraper completed successfully!`));
        } catch (error) {
            console.error(chalk.red(`✗ Error running ${selectedScraper.name} scraper:`), error);
        }
    } else {
        console.error(chalk.red('Invalid selection'));
    }
}

main().catch(error => {
    console.error(chalk.red('Fatal error:'), error);
    process.exit(1);
});
