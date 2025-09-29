import sanity from '@/utils/sanity';

export const useSanityNavigation = async () => {
	const query = `*[_type == "navigationSettings"][0]{
    "mainNavigation": mainNavigation.links[]{
      "text": text,
      url,
      isActive
    }
  }`;

	const result = await sanity.fetch(query);
	return result;
};
