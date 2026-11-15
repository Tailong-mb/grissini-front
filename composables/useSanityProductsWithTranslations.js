import sanity from '@/utils/sanity';

export const useSanityProductsWithTranslations = (category, page, limit) => {
	return useAsyncData(
		'sanity-products',
		() => {
			const cat = toValue(category) || 'all';
			const p = toValue(page) || 1;
			const l = toValue(limit) || 12;

			// Seuls les produits publiés dans Shopify (status active), comme Aishy / starter SETUP
			let filterQuery = `*[_type == "product" && defined(store) && !store.isDeleted && store.status == "active"`;
			if (cat && cat !== 'all') {
				filterQuery += ` && lower(store.productType) == $category`;
			}
			filterQuery += `]`;

			const start = (Number(p) - 1) * Number(l);
			const end = start + Number(l);

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
          "discoverProductText": discoverProductText,
          "preorderMessage": preorderMessage,
          "preorderButtonText": preorderButtonText
        },
        preorder,
        preorderMessage,
        preorderShippingDate,
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

			return sanity.fetch(query, { category: String(cat).toLowerCase() });
		},
		{ watch: [() => toValue(category), () => toValue(page)] },
	);
};

export const useSanityProductWithTranslations = (slug) => {
	return useAsyncData(
		`sanity-product-${toValue(slug)}`,
		() => {
			const query = `*[_type == "product" && store.slug.current == $slug && !store.isDeleted && store.status == "active"][0]{
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
          "discoverProductText": discoverProductText,
          "preorderMessage": preorderMessage,
          "preorderButtonText": preorderButtonText
        },
        preorder,
        preorderMessage,
        preorderShippingDate,
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

			return sanity.fetch(query, { slug: toValue(slug) });
		},
		{ watch: [slug] },
	);
};
