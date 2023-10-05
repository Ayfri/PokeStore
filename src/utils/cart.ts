import type {Card} from '../types';

export function getCart(): Card[] {
	const cart = localStorage.getItem('cart');
	if (!cart) return [];
	return JSON.parse(cart);
}
