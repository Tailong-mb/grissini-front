import sanity from '@/utils/sanity';

export const useSanityComposition = async () => {
	const query = `*[_type == "composition"][0]{
    "description": description,
    email,
    "items": items[]{
      "title": title,
      "description": description
    },
    "seo": seo
  }`;

	const result = await sanity.fetch(query);
	return result;
};
