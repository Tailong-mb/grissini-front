import sanity from '@/utils/sanity';

export const useSanityShop = async (locale = 'en') => {
	// Requête optimisée qui récupère tout en une fois
	const query = `{
    "shop": *[_type == "shop"][0]{
      "productsPerPage": productsPerPage,
      "categories": categories[]{
        key,
        "label": label.${locale}
      },
      "seo": seo
    },
    "productCounts": {
      "all": length(*[_type == "product" && defined(store) && !store.isDeleted]),
      "vinyls": length(*[_type == "product" && defined(store) && !store.isDeleted && lower(store.productType) == "vinyl"]),
      "cd": length(*[_type == "product" && defined(store) && !store.isDeleted && lower(store.productType) == "cd"]),
      "clothes": length(*[_type == "product" && defined(store) && !store.isDeleted && lower(store.productType) == "clothes"])
    }
  }`;

	const result = await sanity.fetch(query);

	// Assigner les compteurs aux catégories
	if (result?.shop?.categories && result?.productCounts) {
		result.shop.categories.forEach((category) => {
			const count = result.productCounts[category.key] || 0;
			category.count = count;
		});
	}
	return result.shop;
};
