import sanity from '@/utils/sanity';

export const useSanityShop = () => {
	const query = `{
    "shop": *[_type == "shop"][0]{
      "productsPerPage": productsPerPage,
      "categories": categories[]{
        key,
        "label": label
      },
      "seo": seo
    },
    "productCounts": {
      "all": length(*[_type == "product" && defined(store) && !store.isDeleted]),
      "vinyls": length(*[_type == "product" && defined(store) && !store.isDeleted && lower(store.productType) == "vinyls"]),
      "cd": length(*[_type == "product" && defined(store) && !store.isDeleted && lower(store.productType) == "cd"]),
      "clothes": length(*[_type == "product" && defined(store) && !store.isDeleted && lower(store.productType) == "clothes"])
    }
  }`;

	return useAsyncData('sanity-shop', async () => {
		const result = await sanity.fetch(query);

		if (result?.shop?.categories && result?.productCounts) {
			result.shop.categories.forEach((category) => {
				category.count = result.productCounts[category.key] || 0;
			});
		}
		return result.shop;
	});
};
