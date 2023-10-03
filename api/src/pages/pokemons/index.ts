import prisma from '../../prisma.ts';
import {jsonResponse} from "../../utils.ts";

export async function GET() {
	const pokemons = await prisma().pokemons.findMany();
	return jsonResponse(pokemons);
}
