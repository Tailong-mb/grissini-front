import { createClient } from '@sanity/client';

let client = null;

// Client créé à la première requête (config via runtimeConfig, comme le starter SETUP).
const getClient = () => {
	if (!client) {
		const { sanity } = useRuntimeConfig().public;
		client = createClient({ ...sanity, perspective: 'published', maxRetries: 2 });
	}
	return client;
};

export default {
	fetch: (query, params) => getClient().fetch(query, params),
};

// URL d'image Sanity optimisée (format auto, largeur bornée). Les URLs non Sanity sont renvoyées telles quelles.
export const sanityImage = (url, width = 1400) => {
	if (!url || !url.includes('cdn.sanity.io')) return url;
	return `${url}${url.includes('?') ? '&' : '?'}w=${width}&auto=format&q=80&fit=max`;
};
