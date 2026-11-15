import { SITE_NAME, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, toOgImage } from '@/utils/seo';

/**
 * Meta SEO d'une page (pattern Braid). Le canonical, les hreflang et og:locale sont gérés par i18n (useLocaleHead dans app.vue).
 *
 * Usage : useSeo(() => ({ seo: data.value?.seo, title: 'Shop', description, image }))
 * L'objet Sanity `seo { title, description, image }` est prioritaire sur les fallbacks.
 */
export function useSeo(getter = () => ({})) {
	const route = useRoute();
	const { siteUrl } = useRuntimeConfig().public;

	const resolved = computed(() => {
		const source = getter() || {};
		const seo = source.seo || {};
		const base = seo.title || source.title;

		return {
			title: base ? `${base} — ${SITE_NAME}` : SITE_NAME,
			description: seo.description || source.description || DEFAULT_DESCRIPTION,
			image: toOgImage(seo.image) || toOgImage(source.image) || DEFAULT_OG_IMAGE,
			robots: source.noindex ? 'noindex, nofollow' : 'index, follow',
		};
	});

	useSeoMeta({
		title: () => resolved.value.title,
		description: () => resolved.value.description,
		robots: () => resolved.value.robots,
		ogTitle: () => resolved.value.title,
		ogDescription: () => resolved.value.description,
		ogImage: () => resolved.value.image,
		ogUrl: () => `${siteUrl}${route.path}`,
		twitterCard: 'summary_large_image',
		twitterTitle: () => resolved.value.title,
		twitterDescription: () => resolved.value.description,
		twitterImage: () => resolved.value.image,
	});
}
