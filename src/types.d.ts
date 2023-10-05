export interface Card {
	imageUrl: string;
	types: string;
	rarity: string;
	price: number;
	pokemon: Pokemon;
	set: Set;
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
