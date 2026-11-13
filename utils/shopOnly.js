// Mode « shop only » : seules ces routes restent accessibles (sans préfixe de langue).
// CGV et mentions légales restent obligatoires pour la vente.
export const SHOP_ONLY_ALLOWED = ['/products', '/cgv', '/mentions-legales'];

const LOCALE_PREFIX = /^\/(fr|zh|no|sv|ja|es)(?=\/|$)/;

export const getLocalePrefix = (path = '') => {
	const match = path.match(LOCALE_PREFIX);
	return match ? `/${match[1]}` : '';
};

export const stripLocale = (path = '') => path.replace(LOCALE_PREFIX, '') || '/';

export const isAllowedInShopOnly = (path = '') => {
	const clean = stripLocale(path.startsWith('/') ? path : `/${path}`);
	return SHOP_ONLY_ALLOWED.some((allowed) => clean === allowed || clean.startsWith(`${allowed}/`));
};
