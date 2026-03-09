export default defineNuxtRouteMiddleware((to) => {
	// Autoriser uniquement les routes de la partie shop :
	// - /products (listing)
	// - /products/... (fiche produit)
	// et leurs variantes préfixées par la locale (ex. /fr/products).
	// On laisse passer aussi les routes techniques courantes (API, assets, _nuxt).

	const originalPath = to.path || '/';

	// Routes techniques à ignorer
	if (
		originalPath.startsWith('/api') ||
		originalPath.startsWith('/_nuxt') ||
		originalPath.startsWith('/__') ||
		originalPath.startsWith('/favicon') ||
		originalPath.startsWith('/assets')
	) {
		return;
	}

	// Gérer les préfixes de langue (strategy: prefix_except_default)
	// Locales non par défaut (default = en)
	const localeCodes = ['fr', 'zh', 'no', 'sv', 'ja', 'es'];
	const segments = originalPath.split('/');
	const firstSegment = segments[1];

	let localePrefix = '';
	let path = originalPath;

	if (localeCodes.includes(firstSegment)) {
		localePrefix = `/${firstSegment}`;
		path = '/' + segments.slice(2).join('/');
		if (path === '//') path = '/';
	}

	const isProductsRoot = path === '/products';
	const isProductChild = path.startsWith('/products/');

	if (!isProductsRoot && !isProductChild) {
		// Rediriger vers /[locale]/products si une locale est présente,
		// sinon vers /products
		const target = localePrefix ? `${localePrefix}/products` : '/products';
		return navigateTo(target, { replace: true });
	}
});

