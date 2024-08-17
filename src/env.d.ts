/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly POKEMON_TCG_API_KEY: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
