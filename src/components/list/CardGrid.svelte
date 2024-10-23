<script lang="ts">
	import "~/styles/colors.css";
	import {sortBy, sortOrder} from '$helpers/filters.js';
	import CardComponent from '@components/list/Card.svelte';
	import Filters from '@components/list/Filters.svelte';
	import PageTitle from '@components/PageTitle.svelte';
	import type {Card, Set} from '~/types.js';

	export let cards: Card[];
	export let sets: Set[];
	export let rarities: string[];
	export let types: string[];

	$: if ($sortOrder || $sortBy) {
		cards = cards.sort((a, b) => {
			const aNumero = parseInt(a.numero);
			const bNumero = parseInt(b.numero);
			if ($sortBy === 'sort-price') {
				return $sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
			} else if ($sortBy === 'sort-name') {
				return $sortOrder === 'asc' ? a.pokemon.name.localeCompare(b.pokemon.name) : b.pokemon.name.localeCompare(a.pokemon.name);
			}

			return $sortOrder === 'asc' ? aNumero - bNumero : bNumero - aNumero;
		});
	}
</script>

<div class="w-full mx-auto max-lg:px-2">
	<div class="flex max-lg:flex-col justify-between mx-28 max-lg:m-0 pb-2 lg:pb-3 items-center border-b-white border-b-[6px] max-lg:border-b-4">
		<PageTitle title="Card List"/>
		<div class="flex flex-col max-lg:flex-row items-end gap-3 leading-normal max-lg:-mt-1.5">
			<Filters {cards} {rarities} {sets} {types}/>
		</div>
	</div>
</div>

<div
	class="grid grid-cols-[repeat(auto-fit,minmax(30rem,1fr))] place-items-center justify-center w-full overflow-y-scroll overflow-x-hidden scrollbar-hide"
	id="cards-grid"
>
	{#each cards as card(card.image)}
		<CardComponent {card}/>
	{/each}
</div>
