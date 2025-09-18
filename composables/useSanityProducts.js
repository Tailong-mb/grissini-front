import sanity from '@/utils/sanity';

export const useSanityProducts = async () => {
	const query = `*[_type == "product" && defined(store.status) && store.status == 'active' && !store.isDeleted]{
    _id,
    "title": store.title,
    "slug": store.slug.current,
    "previewImageUrl": store.previewImageUrl,
    "variants": *[_type == "productVariant" && store.productId == ^.store.id]{
      _id,
      "title": store.title,
      "price": store.price,
      "image": store.image.asset->url
    }
  }`;
	return await sanity.fetch(query);
};
