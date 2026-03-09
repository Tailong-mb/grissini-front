export default defineNuxtRouteMiddleware((to) => {
	// Autoriser uniquement les routes de la partie shop :
	// - /products (listing)
	// - /products/... (fiche produit)
	// On laisse passer aussi les routes techniques courantes (API, assets, _nuxt).

	const path = to.path || '/';

	// Routes techniques à ignorer
	if (
		path.startsWith('/api') ||
		path.startsWith('/_nuxt') ||
		path.startsWith('/__') ||
		path.startsWith('/favicon') ||
		path.startsWith('/assets')
	) {
		return;
	}

	const isProductsRoot = path === '/products';
	const isProductChild = path.startsWith('/products/');

	if (!isProductsRoot && !isProductChild) {
		return navigateTo('/products', { replace: true });
	}
});

