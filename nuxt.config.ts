import * as sass from 'sass';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	ssr: false,
	devtools: { enabled: false },

	modules: ['@nuxtjs/i18n'],

	i18n: {
		locales: [
			{
				code: 'en',
				name: 'English',
				file: 'en.json',
			},
			{
				code: 'fr',
				name: 'Français',
				file: 'fr.json',
			},
			{
				code: 'zh',
				name: '中文',
				file: 'zh.json',
			},
			{
				code: 'no',
				name: 'Norsk',
				file: 'no.json',
			},
			{
				code: 'sv',
				name: 'Svenska',
				file: 'sv.json',
			},
			{
				code: 'ja',
				name: '日本語',
				file: 'ja.json',
			},
			{
				code: 'es',
				name: 'Español',
				file: 'es.json',
			},
		],
		defaultLocale: 'en',
		lazy: true,
		langDir: 'locales/',
		strategy: 'prefix_except_default',
		detectBrowserLanguage: {
			useCookie: true,
			cookieKey: 'i18n_redirected',
			redirectOn: 'root',
		},
	},

	runtimeConfig: {
		mailchimpApiKey: process.env.MAILCHIMP_API_KEY,
		mailchimpAudienceId: process.env.MAILCHIMP_AUDIENCE_ID,
		public: {
			SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN,
			SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
			SHOPIFY_STOREFRONT_API_VERSION: process.env.SHOPIFY_STOREFRONT_API_VERSION,
		},
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
