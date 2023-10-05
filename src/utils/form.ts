export type InputType = "date" | "datetime-local" | "email" | "number" | "password" | "range" | "text" | "url" | "week"

export interface Input {
	autocomplete?: string | boolean;
	label?: string;
	placeholder: string;
	required?: boolean;
	type: InputType;
}

export function displayError(error: string, form: HTMLFormElement = document.querySelector('form') as HTMLFormElement) {
	const errorElement = form.querySelector('.error') as HTMLDivElement;
	errorElement.innerText = error;
}

export function handleForm<T = any>(
	onResult: (result: string, response: Response, form: HTMLFormElement) => void,
	getAsJson?: false,
	form?: HTMLFormElement,
): void;
export function handleForm<T = any>(
	onResult: (result: T, response: Response, form: HTMLFormElement) => void,
	getAsJson?: true,
	form?: HTMLFormElement,
): void;
export function handleForm<T = any>(onResult: (result: T, response: Response, form: HTMLFormElement) => void = () => {
	console.log('Form submitted');
}, getAsJson: boolean = true, form: HTMLFormElement = document.querySelector('form') as HTMLFormElement) {
	form.addEventListener('submit', async (event) => {
		event.preventDefault();
		const formData = new FormData(form);
		const response = await fetch(form.action, {
			method: form.method,
			body: formData,
		});
		const result = getAsJson ? await response.json() : await response.text();
		onResult(result, response, form);
	});
}
