import sanity from '@/utils/sanity';

export const useSanityCollections = () => {
	const query = `*[_type == "collection"]{
    _id,
    "title": store.title,
    "slug": store.slug.current
  }`;

	return useAsyncData('sanity-collections', () => sanity.fetch(query));
};
