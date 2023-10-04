import prisma from '../prisma.ts';
import {jsonResponse} from "../utils.ts";

export async function GET() {
    const types = await prisma().cards.findMany({
        distinct: "types",
        select: {
            types: true,
        }
    });
    return jsonResponse(types.map((type) => type.types).filter((type) => !type.includes(',')));
}
