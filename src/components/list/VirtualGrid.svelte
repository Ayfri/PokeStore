<script lang="ts">
	import ScrollToBottom from '@components/list/ScrollToBottom.svelte';
	import {onMount} from 'svelte';
	import type {Card} from '~/types.js';

	export let items: Card[];
	export let itemHeight: number;
	export let itemWidth: number;
	export let gapX: number = 0;
	export let gapY: number = 0;
	export let marginTop: number = 0;

	const marginRows = 2;

	let container: HTMLDivElement;
	let clientWidth: number;
	let itemsPerRow: number = 1;
	let visibleRows: number = 0;
	let visibleItems: Card[] = [];
	let scrollingTo: boolean = false;

	$: if (container && items) updateVisibleItems();
	$: if ('window' in globalThis) visibleRows = Math.ceil(window.innerHeight / (itemHeight + gapY));
	$: leftMargin = (clientWidth - (itemsPerRow * itemWidth + (itemsPerRow - 1) * gapX)) / 2;

	onMount(updateVisibleItems);

	function updateVisibleItems() {
		if (scrollingTo) return;
		itemsPerRow = Math.floor(clientWidth / (itemWidth + gapX));
		const scrollTop = container.scrollTop;
		const start = Math.floor(scrollTop / (itemHeight + gapY)) * itemsPerRow;
		const end = start + visibleRows * itemsPerRow;
		visibleItems = items.slice(start, end + itemsPerRow * marginRows);
	}

	function scrollToLast() {
		scrollingTo = true;
		const start = items.length - visibleRows * itemsPerRow;
		const end = start + visibleRows * itemsPerRow;
		visibleItems = items.slice(start, end + itemsPerRow * marginRows);

		const scrollTop = (items.length / itemsPerRow) * (itemHeight + gapY) + marginTop;
		queueMicrotask(() => {
			container.scrollTop = scrollTop;
			scrollingTo = false;
		});
	}
</script>

<svelte:window on:resize={updateVisibleItems}/>

<div bind:this={container} bind:clientWidth class="relative flex-1 w-full h-full overflow-y-scroll scrollbar-hide" on:scroll={updateVisibleItems}>
	<div class="absolute size-[1px]" style="top: {Math.ceil((items.length) / itemsPerRow) * (itemHeight + gapY) + marginTop}px;"></div>

	{#each items as item, i (item.image)}
		{#if visibleItems.includes(item)}
			{#key item.image}
				<div class="absolute" style="top: {Math.floor(i / itemsPerRow) * (itemHeight + gapY) + marginTop}px; left: {i % itemsPerRow * (itemWidth + gapX) + leftMargin}px">
					<slot {item}/>
				</div>
			{/key}
		{/if}
	{/each}
</div>

<ScrollToBottom on:click={scrollToLast}/>
