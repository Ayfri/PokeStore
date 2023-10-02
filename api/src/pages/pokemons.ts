import type {APIRoute} from "astro";

type GetParameters = APIRoute & {
	params: {
		id?: number;
	};
};

export async function GET({params}: GetParameters) {
	return new Response(
		JSON.stringify({
			name: "Astro",
			url: "https://astro.build/",
		})
	);
}
