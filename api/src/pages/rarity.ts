import prisma from '../prisma.ts';
import {jsonResponse} from "../utils.ts";

export async function GET() {
    const rarity = await prisma().cards.findMany({
        distinct: "rarity",
        select: {
            rarity: true,
        }
    });
    return jsonResponse(rarity.map((obj) => obj.rarity).filter((obj) => !obj.includes(',')));
}
