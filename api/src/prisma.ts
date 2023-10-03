import {PrismaClient} from '@prisma/client';

let _prisma: PrismaClient | null = null;

export default function prisma() {
	if (_prisma) return _prisma;

	_prisma = new PrismaClient({
		datasources: {
			db: {
				url: import.meta.env.DATABASE_URL,
			},
		},
	});

	return _prisma;
}
