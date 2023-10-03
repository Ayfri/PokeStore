import type {APIRoute} from "astro";
import prisma from '../../prisma.ts';
import {jsonResponse} from "../../utils.ts";

type GetParameters = APIRoute & {
	params: {
		id: string;
	};
};

export async function GET({params}: GetParameters) {
	const pokemon = await prisma().cards.findUnique({
		where: {
			id: parseInt(params.id),
		},
	});

	return jsonResponse(pokemon);
}
