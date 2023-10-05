/// <reference types="astro/client" />
import type {User} from './types';

export declare namespace App {
	export interface Locals {
		user: User;
	}
}

interface ImportMetaEnv {
	readonly API_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
