import * as sass from 'sass';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	ssr: false,
	devtools: { enabled: false },

	runtimeConfig: {
		public: {
			SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN,
			SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
			SHOPIFY_STOREFRONT_API_VERSION: process.env.SHOPIFY_STOREFRONT_API_VERSION,
			NUXT_PUBLIC_SITE_URL: process.env.NUXT_PUBLIC_SITE_URL
		}
	},

	build: {
		transpile: ['three', 'gsap'],
	},

	plugins: [
		{ src: '~/plugins/gsap.js', mode: 'client', ssr: false },
		{ src: '~/plugins/lenis.js', mode: 'client', ssr: false },
		{ src: '~/plugins/cart-init.client.js', mode: 'client', ssr: false },
	],

	vite: {
		build: {
			rollupOptions: {
				onwarn(warning: any, warn: any) {
					if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
						return;
					}
					warn(warning);
				},
			},
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@use "@/assets/scss/mixins.scss" as *; @use "@/assets/scss/variables.scss" as *;@use "@/assets/scss/fonts.scss" as *;@use "@/assets/scss/reset.scss" as *;',
					api: 'modern-compiler', // or "modern"
				},
			},
		},
	},

	compatibilityDate: '2024-10-24',
});
