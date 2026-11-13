import { isAllowedInShopOnly, getLocalePrefix } from '@/utils/shopOnly';

export default defineNuxtRouteMiddleware((to) => {
	const { shopOnly } = useRuntimeConfig().public;
	if (!shopOnly || isAllowedInShopOnly(to.path)) return;

	return navigateTo(`${getLocalePrefix(to.path)}/products`, { replace: true });
});
