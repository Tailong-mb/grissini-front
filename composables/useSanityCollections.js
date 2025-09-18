import sanity from '@/utils/sanity';

export const useSanityCollections = async () => {
	const query = `*[_type == "collection"]{
    _id,
    "title": store.title,
    "slug": store.slug.current
  }`;
	return await sanity.fetch(query);
};
