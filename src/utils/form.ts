export type InputType = "date" | "datetime-local" | "email" | "number" | "password" | "range" | "text" | "url" | "week"

export interface Input {
	label?: string;
	placeholder: string;
	required?: boolean;
	type: InputType;
}

export function handleForm<T = any>(onResult: (result: T, response: Response, form: HTMLFormElement) => void = () => {
	console.log('Form submitted');
}, getAsJson: boolean = true, form: HTMLFormElement = document.querySelector('form') as HTMLFormElement) {
	form.addEventListener('submit', async (event) => {
		event.preventDefault();
		const formData = new FormData(form);
		const response = await fetch(form.action, {
			method: form.method, body: formData,
		});
		const result = getAsJson ? await response.json() : await response.text();
		onResult(result, response, form);
	});
}
