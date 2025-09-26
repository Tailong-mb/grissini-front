import sanity from '@/utils/sanity';

export const useSanityNavigation = async (locale = 'en') => {
	const query = `*[_type == "navigationSettings"][0]{
    "mainNavigation": mainNavigation[]{
      "text": text.${locale},
      url
    }
  }`;

	const result = await sanity.fetch(query);
	return result;
};
