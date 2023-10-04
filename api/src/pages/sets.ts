import prisma from '../prisma.ts';
import {jsonResponse} from "../utils.ts";

export async function GET() {
    const sets = await prisma().sets.findMany({
        distinct: "name",
    });
    return jsonResponse(sets);
}