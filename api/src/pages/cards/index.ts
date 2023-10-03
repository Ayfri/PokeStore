import prisma from '../../prisma.ts';
import {jsonResponse} from "../../utils.ts";

export async function GET() {
	const cards = await prisma().cards.findMany({
		include: {
			pokemon: true,
			set: true,
		}
	});
	return jsonResponse(cards);
}
