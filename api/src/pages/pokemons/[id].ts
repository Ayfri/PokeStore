import type {APIRoute} from "astro";
import prisma from '../../prisma.ts';

type GetParameters = APIRoute & {
	params: {
		id: string;
	};
};

export async function GET({params}: GetParameters) {
	const pokemon = await prisma().pokemons.findUnique({
		where: {
			id: parseInt(params.id),
		},
	});

	return new Response(JSON.stringify(pokemon));
}
