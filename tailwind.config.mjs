/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		fontFamily: {
			'clash': ['Clash Display', 'sans-serif'],
		},
		extend: {
			colors: {
				'gold': {
					'400': '#fbc54a',
				},
				'gray': {
					'400': '#aeaeae',
					'800': '#232323',
				},
			},
			screens: {
				'xs': '420px',
				'2xs': '350px',
			},
		},
	},
	plugins: [],
};
