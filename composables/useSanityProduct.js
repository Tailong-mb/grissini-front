import sanity from '@/utils/sanity';

export const useSanityProduct = async (slug) => {
	const query = `*[_type == "product" && store.slug.current == $slug && store.status == "active" && !store.isDeleted][0]{
    _id,
    "title": store.title,
    "slug": store.slug.current,
    "descriptionHtml": store.descriptionHtml,
    "priceRange": store.priceRange,
    "previewImageUrl": store.previewImageUrl,
    "body": body,
    "variants": *[_type == "productVariant" && store.productId == ^.store.id]{
      _id,
      "title": store.title,
      "sku": store.sku,
      "price": store.price,
      "previewImageUrl": store.previewImageUrl,
      "shopifyId": store.gid
    },
    "seo": seo
  }`;

	const result = await sanity.fetch(query, { slug });

	return result;
};
