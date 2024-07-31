export interface Card {
	image: string;
	pokemon: Pokemon;
	price: number;
	numero: string;
	rarity: string;
	set: Set;
	types: string;
}

export interface Pokemon {
	id: number;
	name: string;
	description: string;
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
