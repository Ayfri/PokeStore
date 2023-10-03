import {PrismaClient} from '@prisma/client';

let _prisma: PrismaClient | null = null;

// export only one getter


export default function prisma() {
	if (_prisma !== null) return _prisma;

	_prisma = new PrismaClient({
		datasources: {
			db: {
				url: import.meta.env.DATABASE_URL,
			},
		},
	});

	return _prisma;
}
