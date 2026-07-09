import sanity from '@/utils/sanity';

export const useSanityNavigation = () => {
	const query = `*[_type == "navigationSettings"][0]{
    "mainNavigation": mainNavigation.links[]{
      "text": text,
      url,
      isActive
    }
  }`;

	return useAsyncData('sanity-navigation', () => sanity.fetch(query));
};
