import sanity from '@/utils/sanity';

export const useSanityNavigation = async (locale = 'en') => {
	const query = `*[_type == "navigationSettings"][0]{
    "mainNavigation": mainNavigation.links[]{
      "text": text.${locale},
      url,
      isActive
    }
  }`;

	const result = await sanity.fetch(query);
	return result;
};
