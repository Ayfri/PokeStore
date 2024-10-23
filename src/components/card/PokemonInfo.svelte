<script lang="ts">
	import {pascalCase} from '$helpers/strings.js';
	import PageTitle from '@components/PageTitle.svelte';
	import type {Card, Pokemon} from '~/types.js';

	export let pokemons: Pokemon[];
	export let card: Card;

	const pokemonName = card.pokemon.name;
	const capitalizedPokemonName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);

	const evolvesTo = card.pokemon.evolves_to?.map(evolution => {
		const pokemon = pokemons.find(pokemon => pokemon.id === evolution)!;
		return {
			id: evolution,
			name: pokemon.name,
		};
	})?.sort((a, b) => a.name.localeCompare(b.name)) ?? [];

	const evolvesFrom = card.pokemon.evolves_from ? pokemons.find(pokemon => pokemon.id === card.pokemon.evolves_from)! : undefined;
</script>

<div class="mb-8 flex flex-col items-center gap-4 max-lg:gap-0">
	<p
		class="px-5 py-2 bg-gray-800 border-[3px] border-gold-400 rounded-[1rem] text-2xl"
		id="card-price"
		title="Average current price"
	>
		{card.price ? `${card.price} $` : 'Priceless'}
	</p>

	<PageTitle title={capitalizedPokemonName}/>

	<div class="flex flex-col items-center gap-4 max-lg:flex-col max-lg:items-center text-xl">
		<div
			class="flex gap-4"
			id="card-types"
		>
			{#each card.types.toLowerCase().split(',') as type}
				<p class={`card-type ${type}`}>{type}</p>
			{/each}
		</div>
		<p class="text-center">{card.pokemon.description}</p>
		{#if evolvesFrom}
			<p class="text-gold-400">
				Evolves from:
				<a
					class="text-blue-300 underline"
					href={`/card/${evolvesFrom.id}/`}
					title={`${pascalCase(card.pokemon.name)} is the evolution of ${pascalCase(evolvesFrom.name)}`}
				>
					{pascalCase(evolvesFrom.name)}
				</a>
			</p>
		{/if}

		{#if card.pokemon.evolves_to}
			<p class="text-gold-400">
				Evolves to:
				{#each evolvesTo as evolution, i}
					<a
						class="text-blue-300 underline"
						href={`/card/${evolution.id}/`}
						title={`${pascalCase(card.pokemon.name)} can evolve to ${pascalCase(evolution.name)}`}
					>
						{pascalCase(evolution.name)}
					</a>
					{i === evolvesTo.length - 1 ? '' : ', '}
				{/each}
			</p>
		{/if}
	</div>
</div>
