import sanity from '@/utils/sanity';
import { isAllowedInShopOnly } from '@/utils/shopOnly';

export const useSanityNavigation = () => {
	const { shopOnly } = useRuntimeConfig().public;

	const query = `*[_type == "navigationSettings"][0]{
    "mainNavigation": mainNavigation.links[]{
      "text": text,
      url,
      isActive
    }
  }`;

	return useAsyncData('sanity-navigation', () => sanity.fetch(query), {
		transform: (data) => {
			if (!shopOnly || !data?.mainNavigation) return data;
			return {
				...data,
				mainNavigation: data.mainNavigation.filter((link) => isAllowedInShopOnly(link.url)),
			};
		},
	});
};
