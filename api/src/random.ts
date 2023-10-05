const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function randomBetween(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Generate a new ID
 * Schema is "dddddddrrrrrrrr" where r is a random number and d is the current timestamp
 */
export function newId() {
	const now = Date.now();
	const nowString = now.toString().substring(0, 7);
	const random = randomBetween(1000000, 9999999);
	return parseInt(`${nowString}${random}`);
}

export function newToken(length = 64) {
	let token = '';
	for (let i = 0; i < length; i++) {
		token += chars[randomBetween(0, chars.length - 1)];
	}
	return token;
}
