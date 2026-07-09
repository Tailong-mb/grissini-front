import sanity from '@/utils/sanity';

export const useSanityComposition = () => {
	const query = `*[_type == "composition"][0]{
    "description": description,
    email,
    "items": items[]{
      "title": title,
      "description": description
    },
    "seo": seo
  }`;

	return useAsyncData('sanity-composition', () => sanity.fetch(query));
};
