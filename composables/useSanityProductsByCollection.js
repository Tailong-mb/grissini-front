import sanity from '@/utils/sanity';

export const useSanityProductsByCollection = async () => {
	const query = `*[_type == "product" && store.status == "active" && !store.isDeleted]{
    _id,
    "title": store.title,
    "slug": store.slug.current,
    "descriptionHtml": store.descriptionHtml,
    "priceRange": store.priceRange,
    "previewImageUrl": store.previewImageUrl,
    variants: store.variants[]->{
      _id,
      title,
      sku,
      price,
      previewImageUrl
    }
  }`;
	return await sanity.fetch(query);
};
