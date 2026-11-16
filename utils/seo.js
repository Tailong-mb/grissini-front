export const SITE_NAME = 'Grissini Project';

export const DEFAULT_SITE_URL = 'https://grissinimusic.com';

export const DEFAULT_DESCRIPTION =
	'Official shop of the Grissini Project: CDs, vinyls and merch from the ensemble reuniting classical music and Japanese pop culture from video games, animes and movies.';

export const DEFAULT_OG_IMAGE =
	'https://cdn.sanity.io/images/f7eqgv37/production/f6018e49330ca783267d4ccee6b746b15ca2af5a-2662x1402.jpg?w=1200&h=630&fit=crop&fm=jpg&q=85';

const SANITY_IMAGE_REF = /^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/;

/**
 * Résout une image Sanity (objet `{ asset: { _ref } }`, `{ asset: { url } }` ou URL) en URL 1200x630 pour Open Graph.
 */
export function toOgImage(image) {
	if (!image) return null;
	if (typeof image === 'string') return image;

	const url = image.asset?.url;
	if (url) return url.includes('cdn.sanity.io') ? `${url}?w=1200&h=630&fit=crop&fm=jpg&q=85` : url;

	const match = image.asset?._ref?.match(SANITY_IMAGE_REF);
	if (!match) return null;
	return `https://cdn.sanity.io/images/f7eqgv37/production/${match[1]}-${match[2]}.${match[3]}?w=1200&h=630&fit=crop&fm=jpg&q=85`;
}
