import {defineConfig} from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
	output: 'static',
	site: 'https://pokestore.ayfri.com',
	integrations: [
		sitemap({
			i18n: {
				defaultLocale: 'en',
				locales: {
					en: 'en-US',
				},
			},
		}), tailwind({
			applyBaseStyles: false,
		}),
	],
});
