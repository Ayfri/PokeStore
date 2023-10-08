import prisma from '../../prisma.ts';
import {jsonResponse} from "../../utils.ts";
import type {APIRoute} from "astro";

type SearchParameters = {
	numero: string;
	types: string;
	name: string;
	rarity: string;
	set: string;
}

type GetParameters = APIRoute & {
	url: URL;
};

type FilterValue = {
	contains?: string;
	equals?: number;
}

type Filter = {
	[key: string]: FilterValue;
}

export async function GET({url}: GetParameters) {
	const params = Object.fromEntries(url.searchParams.entries()) as SearchParameters;

	const cardFilter: Filter = {};
	if (params.types) cardFilter.types = {contains: params.types};
	if (params.rarity) cardFilter.rarity = {contains: params.rarity};

	const pokemonFilter: Filter = {};
	if (params.name) pokemonFilter.name = {contains: params.name};
	if (params.numero) pokemonFilter.numero = {equals: parseInt(params.numero)};

	const setFilter: Filter = {};
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
