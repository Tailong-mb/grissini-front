import sanity from '@/utils/sanity';

export const useSanityComposition = async (locale = 'en') => {
	const query = `*[_type == "composition"][0]{
    "description": description.${locale},
    email,
    "items": items[]{
      "title": title.${locale},
      "description": description.${locale}
    },
    "seo": seo
  }`;

	const result = await sanity.fetch(query);
	return result;
};
