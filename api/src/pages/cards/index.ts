import prisma from '../../prisma.ts';
import {jsonResponse} from "../../utils.ts";
import type {APIRoute} from "astro";

type GetParameters = APIRoute & {
	d: {
		searchParams: {
			id: string;
			types: string;
			name: string;
			rarity: string;
			set: string;
		}
	};

	url: URL;
};

export async function GET({url}: GetParameters) {
	const params = Object.fromEntries(url.searchParams.entries());

	const cardFilter: Record<string, any> = {};
	if (params.types) cardFilter.types = {contains: params.types};
	if (params.rarity) cardFilter.rarity = {contains: params.rarity};

	const pokemonFilter: Record<string, any> = {};
	if (params.name) pokemonFilter.name = {contains: params.name};
	if (params.numero) pokemonFilter.numero = {equals: parseInt(params.numero)};

	const setFilter: Record<string, any> = {};
	if (params.set) setFilter.name = {contains: params.set};
	const cards = await prisma().cards.findMany({
		include: {
			pokemon: true,
			set: true,
		},
		where: {
			pokemon: pokemonFilter,
			set: setFilter,
			...cardFilter,
		},
	});
	return jsonResponse(cards);
}
