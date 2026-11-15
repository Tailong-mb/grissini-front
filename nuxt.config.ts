import { SITE_NAME, DEFAULT_SITE_URL, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE } from './utils/seo';

const SITE_URL = process.env.NUXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	ssr: true,
	devtools: { enabled: false },

	modules: ['@nuxtjs/i18n'],

	// Defaults globaux (surchargés page par page via useSeo, rendu côté serveur).
	app: {
		head: {
			htmlAttrs: { lang: 'en' },
			title: SITE_NAME,
			meta: [
				{ name: 'description', content: DEFAULT_DESCRIPTION },
				{ name: 'theme-color', content: '#ffffff' },
				{ property: 'og:site_name', content: SITE_NAME },
				{ property: 'og:type', content: 'website' },
				{ property: 'og:title', content: SITE_NAME },
				{ property: 'og:description', content: DEFAULT_DESCRIPTION },
				{ property: 'og:image', content: DEFAULT_OG_IMAGE },
				{ property: 'og:image:width', content: '1200' },
				{ property: 'og:image:height', content: '630' },
				{ name: 'twitter:card', content: 'summary_large_image' },
			],
			link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
		},
	},

	i18n: {
		baseUrl: SITE_URL,
		locales: [
			{ code: 'en', language: 'en', name: 'English', file: 'en.json' },
			{ code: 'fr', language: 'fr', name: 'Français', file: 'fr.json' },
			{ code: 'zh', language: 'zh', name: '中文', file: 'zh.json' },
			{ code: 'no', language: 'nb', name: 'Norsk', file: 'no.json' },
			{ code: 'sv', language: 'sv', name: 'Svenska', file: 'sv.json' },
			{ code: 'ja', language: 'ja', name: '日本語', file: 'ja.json' },
			{ code: 'es', language: 'es', name: 'Español', file: 'es.json' },
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
		notionApiToken: process.env.NOTION_API_TOKEN,
		notionConcertsDatabaseId: process.env.NOTION_CONCERTS_DATABASE_ID,
		public: {
			SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN,
			SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
			SHOPIFY_STOREFRONT_API_VERSION: process.env.SHOPIFY_STOREFRONT_API_VERSION,
			/** Google Tag Manager container ID (e.g. GTM-XXXXXX). Used with Cookie Information for consent-aware tracking. */
			GTM_ID: process.env.NUXT_PUBLIC_GTM_ID || '',
			/** Mode shop only : redirige tout vers /products (+ légal) et filtre le menu. */
			shopOnly: process.env.NUXT_PUBLIC_SHOP_ONLY === 'true',
			/** URL de prod : canonical, hreflang, og:url, sitemap. */
			siteUrl: SITE_URL,
			sanity: {
				projectId: process.env.SANITY_PROJECT_ID || 'f7eqgv37',
				dataset: process.env.SANITY_DATASET || 'production',
				apiVersion: process.env.SANITY_API_VERSION || '2025-07-23',
				useCdn: true,
			},
		},
	},

	build: {
		transpile: ['gsap'],
	},

	plugins: [
		{ src: '~/plugins/gtm-consent.client.js', mode: 'client', ssr: false },
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
