/// <reference types="astro/client" />
interface ImportMetaEnv {
	readonly DATABASE_URL: string;
	readonly POKEMON_TCG_API_KEY: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
