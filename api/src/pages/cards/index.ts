import prisma from '../../prisma.ts';

export async function GET() {
	const cards = await prisma().cards.findMany();
	return new Response(JSON.stringify(cards));
}
