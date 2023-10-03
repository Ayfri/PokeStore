import type {APIRoute} from "astro";
import prisma from '../../prisma.ts';
import {jsonResponse} from "../../utils.ts";

type GetParameters = APIRoute & {
	params: {
		id: string;
	};
};

export async function GET({params}: GetParameters) {
	const cards = await prisma().cards.findUnique({
		where: {
			id: parseInt(params.id),
		},
		include: {
			pokemon: true,
			set: true,
		}
	});

	return jsonResponse(cards);
}
