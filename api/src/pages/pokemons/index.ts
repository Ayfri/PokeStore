import prisma from '../../prisma.ts';

export async function GET() {
	const pokemons = await prisma().pokemons.findMany();
	return new Response(JSON.stringify(pokemons));
}
