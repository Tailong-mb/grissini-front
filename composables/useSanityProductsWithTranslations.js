import sanity from '@/utils/sanity';

export const useSanityProductsWithTranslations = async (category = 'all', page = 1, limit = 12) => {
	// Construire la requête de filtrage
	let filterQuery = `*[_type == "product" && defined(store) && !store.isDeleted`;

	// Ajouter le filtre de catégorie
	if (category && category !== 'all') {
		filterQuery += ` && lower(store.productType) == "${category}"`;
	}

	filterQuery += `]`;

	// Pagination
	const start = (page - 1) * limit;
	const end = start + limit;

	const query = `${filterQuery}[${start}...${end}]{
    _id,
    "title": store.title,
    "slug": store.slug.current,
    "priceRange": store.priceRange,
    "previewImageUrl": store.previewImageUrl,
    "productType": store.productType,
    "vendor": store.vendor,
    "tags": store.tags,
    "translations": translations{
      "title": title,
      "description": description,
      "shortDescription": shortDescription,
      "addToCartText": addToCartText,
      "discoverProductText": discoverProductText
    },
    "images": images[]{
      asset->{
        _id,
        url,
        metadata
      }
    },
    "variants": *[_type == "productVariant" && store.productId == ^.store.id]{
      _id,
      "title": store.title,
      "sku": store.sku,
      "price": store.price,
      "compareAtPrice": store.compareAtPrice,
      "shopifyId": store.gid,
      "inventory": store.inventory
    },
    "seo": seo
  }`;

	const result = await sanity.fetch(query);
	return result;
};

// Composable pour récupérer un produit spécifique avec traductions
export const useSanityProductWithTranslations = async (slug) => {
	const query = `*[_type == "product" && store.slug.current == $slug && !store.isDeleted][0]{
    _id,
    "title": store.title,
    "slug": store.slug.current,
    "priceRange": store.priceRange,
    "previewImageUrl": store.previewImageUrl,
    "productType": store.productType,
    "vendor": store.vendor,
    "tags": store.tags,
    "translations": translations{
      "title": title,
      "description": description,
      "shortDescription": shortDescription,
      "addToCartText": addToCartText,
      "discoverProductText": discoverProductText
    },
    "images": images[]{
      asset->{
        _id,
        url,
        metadata
      }
    },
    "variants": *[_type == "productVariant" && store.productId == ^.store.id]{
      _id,
      "title": store.title,
      "sku": store.sku,
      "price": store.price,
      "compareAtPrice": store.compareAtPrice,
      "shopifyId": store.gid,
      "inventory": store.inventory,
      "options": {
        "option1": store.option1,
        "option2": store.option2,
        "option3": store.option3
      }
    },
    "seo": seo
  }`;

	const result = await sanity.fetch(query, { slug });
	return result;
};
