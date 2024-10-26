<script lang="ts">
	import ScrollToBottom from '@components/list/ScrollToBottom.svelte';
	import {onMount} from 'svelte';
	import type {Card} from '~/types.js';

	export let items: Card[];
	export let itemHeight: number;
	export let itemWidth: number;

	const marginRows = 2;

	let container: HTMLDivElement;
	let clientWidth: number;
	let itemsPerRow: number = 1;
	let visibleItems: Card[] = [];
	let scrollingTo = false;

	onMount(updateVisibleItems);

	function updateVisibleItems() {
		if (scrollingTo) return;
		itemsPerRow = Math.floor(clientWidth / itemWidth);
		const scrollTop = container.scrollTop;
		const start = Math.floor(scrollTop / itemHeight) * itemsPerRow;
		const end = start + visibleRows * itemsPerRow;
		visibleItems = items.slice(start, end + itemsPerRow * marginRows);
	}

	$: if (container && items) updateVisibleItems();
	$: leftMargin = (clientWidth - itemsPerRow * itemWidth) / 2;
	$: visibleRows = Math.ceil(window.innerHeight / itemHeight);

	function scrollToLast() {
		scrollingTo = true;
		const start = items.length - visibleRows * itemsPerRow;
		const end = start + visibleRows * itemsPerRow;
		visibleItems = items.slice(start, end + itemsPerRow * marginRows);
		const scrollTop = (items.length / itemsPerRow) * itemHeight;

		queueMicrotask(() => {
			container.scrollTop = scrollTop;
			scrollingTo = false;
		});
	}
</script>

<svelte:window on:resize={updateVisibleItems}/>

<div bind:this={container} class="relative w-full h-full overflow-scroll scrollbar-hide mb-4" on:scroll={updateVisibleItems}>
	<div bind:clientWidth class="w-full">
		{#each items as item, i (item.image)}
			{#if visibleItems.includes(item)}
				{#key item.image}
					<div class="inline absolute h-[{itemHeight}px]" style="top: {Math.floor(i / itemsPerRow) * itemHeight}px; left: {i % itemsPerRow * itemWidth + leftMargin}px">
						<slot {item}/>
					</div>
				{/key}
			{/if}
		{/each}
	</div>
</div>

<ScrollToBottom on:click={scrollToLast}/>
