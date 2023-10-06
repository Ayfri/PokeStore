export interface Card {
	id: number;
	imageUrl: string;
	pokemon: Pokemon;
	price: number;
	rarity: string;
	set: Set;
	types: string;
}

export interface Pokemon {
	numero: number;
	name: string;
	description: string;
	imageUrl: string;
	type: string;
}

export interface Set {
	name: string;
	imageUrl: string;
}

export interface User {
	id: number;
	username: string;
	password: string;
	email: string;
}

export interface PokemonStats {
	cards: Card[];
	name: string;
}
