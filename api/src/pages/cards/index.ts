import prisma from '../../prisma.ts';
import {jsonResponse} from "../../utils.ts";
import type {APIRoute} from "astro";

type GetParameters = APIRoute & {
    d: {
        searchParams: {
            id: string;
            types: string;
            name: string;
            rarity: string;
            set: string;
        }
    };

    url: URL;
};

export async function GET({url}: GetParameters) {
    console.log(url)
    const params = Object.fromEntries(url.searchParams.entries());

    const object: Record<string, any> = {};
    if (params.types) object.types = {contains: params.types}
    if (params.name) object.name = {contains: params.name}
    if (params.rarity) object.rarity = {contains: params.rarity}
    if (params.set) object.set = {contains: params.set}
    const cards = await prisma().cards.findMany({
        include: {
            pokemon: true,
            set: true,
        },
        where: object,
    });
    return jsonResponse(cards);
}