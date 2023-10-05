import type {MiddlewareResponseHandler} from 'astro';
import type {App} from './env';

type Locals = App.Locals;

export const onRequest: MiddlewareResponseHandler = async (context, next) => {
	const locals = context.locals as Locals;
	const cookies = context.request.headers.get('cookie')?.split(';').map((cookie) => {
		const [name, value] = cookie.split('=');
		return {
			name,
			value,
		};
	});

	const cookiesAsObject = Object.fromEntries(
		cookies?.map((cookie) => [
			cookie.name.trim(),
			cookie.value,
		]) ?? [],
	);

	if ('session-token' in cookiesAsObject) {
		const response = await fetch(`${import.meta.env.API_URL}/me`, {
			headers: {
				'cookie': Object.entries(cookiesAsObject).map(([name, value]) => `${name}=${value}`).join('; '),
			},
		});

		if (response.status === 200) {
			locals.user = await response.json();
			return next();
		}
	}

	return next();
};
