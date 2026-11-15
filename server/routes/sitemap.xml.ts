import { SHOP_ONLY_ALLOWED } from '~/utils/shopOnly';

// Locales publiées (prefix_except_default : `en` sans préfixe)
const LOCALES = ['en', 'fr', 'zh', 'no', 'sv', 'ja', 'es'];
const DEFAULT_LOCALE = 'en';
const ALL_PAGES = ['/', '/about', '/products', '/hub', '/lives', '/composition', '/cgv', '/mentions-legales'];

const SANITY_QUERY_URL = 'https://f7eqgv37.apicdn.sanity.io/v2025-07-23/data/query/production';
const PRODUCTS_QUERY = `*[_type == "product" && defined(store.slug.current) && !store.isDeleted && store.status == "active"]{
  "slug": store.slug.current,
  _updatedAt
}`;

const localize = (locale: string, path: string) => {
	if (locale === DEFAULT_LOCALE) return path;
	return path === '/' ? `/${locale}` : `/${locale}${path}`;
};

export default defineEventHandler(async (event) => {
	const { siteUrl, shopOnly } = useRuntimeConfig().public;

	const products = await $fetch<{ result: { slug: string; _updatedAt: string }[] }>(SANITY_QUERY_URL, {
		query: { query: PRODUCTS_QUERY },
	})
		.then((res) => res.result || [])
		.catch(() => []);

	const pages = shopOnly ? SHOP_ONLY_ALLOWED : ALL_PAGES;
	const entries = [
		...pages.map((path) => ({ path, lastmod: null as string | null })),
		...products.map((p) => ({ path: `/products/${p.slug}`, lastmod: p._updatedAt })),
	];

	const urls = entries.flatMap(({ path, lastmod }) =>
		LOCALES.map((locale) => {
			const loc = `${siteUrl}${localize(locale, path)}`;
			return `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`;
		}),
	);

	setHeader(event, 'Content-Type', 'application/xml; charset=utf-8');
	setHeader(event, 'Cache-Control', 'public, max-age=3600');

	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
});
