export type InputType = "date" | "datetime-local" | "email" | "number" | "password" | "range" | "text" | "url" | "week"

export interface Input {
	autocomplete?: string | boolean;
	label?: string;
	placeholder: string;
	required?: boolean;
	type: InputType;
}

export function displayError(error: string, form: HTMLFormElement = document.querySelector('form') as HTMLFormElement) {
	const errorElement = form.querySelector('.error') as HTMLParagraphElement;
	errorElement.innerText = error;
}

export function displaySuccess(success: string, form: HTMLFormElement = document.querySelector('form') as HTMLFormElement) {
	const successElement = form.querySelector('.success') as HTMLParagraphElement;
	successElement.innerText = success;
}

export function handleForm<T = any>(
	onResult: (result: string, response: Response, form: HTMLFormElement, event: SubmitEvent) => void,
	getAsJson?: false,
	form?: HTMLFormElement,
	beforeSubmit?: (form: HTMLFormElement, formData: FormData, event: SubmitEvent) => boolean,
	useSubmitterFormAction?: boolean,
): void;
export function handleForm<T = any>(
	onResult: (result: T, response: Response, form: HTMLFormElement, event: SubmitEvent) => void,
	getAsJson?: true,
	form?: HTMLFormElement,
	beforeSubmit?: (form: HTMLFormElement, formData: FormData, event: SubmitEvent) => boolean,
	useSubmitterFormAction?: boolean,
): void;
export function handleForm<T = any>(
	onResult: (result: T, response: Response, form: HTMLFormElement, event: SubmitEvent) => void = () => console.log('Form submitted'),
	getAsJson?: boolean,
	form?: HTMLFormElement,
	beforeSubmit?: (form: HTMLFormElement, formData: FormData, event: SubmitEvent) => boolean,
	useSubmitterFormAction?: boolean,
) {
	const foundForm = form ?? document.querySelector('form') as HTMLFormElement;
	getAsJson ??= true;
	useSubmitterFormAction ??= false;

	foundForm.addEventListener('submit', async event => {
		event.preventDefault();
		const formData = new FormData(foundForm);
		const formSelects = foundForm.querySelectorAll('select');
		formSelects.forEach(select => {
			const name = select.getAttribute('name') as string;
			const selectOptionsValues = [...select.options].filter(option => option.selected).map(option => option.value);
			formData.set(name, selectOptionsValues.join(','));
		});
		if (!beforeSubmit?.(foundForm, formData, event)) return;

		const route = useSubmitterFormAction ? (event.submitter as HTMLInputElement).formAction : foundForm.action;
		const response = await fetch(route, {
			method: foundForm.method,
			body: formData,
		});
		const result = getAsJson ? await response.json() : await response.text();
		onResult(result, response, foundForm, event);
	});
}
