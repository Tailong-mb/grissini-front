import sanity from '@/utils/sanity';

export const useSanityShop = async (locale = 'en') => {
	const query = `*[_type == "shop"][0]{
    "productsPerPage": productsPerPage,
    "categories": categories[]{
      key,
      "label": label.${locale}
    },
    "seo": seo
  }`;

	const result = await sanity.fetch(query);
	return result;
};
