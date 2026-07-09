import sanity from '@/utils/sanity';

export const useSanityCgv = (locale) => {
	return useAsyncData('sanity-cgv', () => {
		const l = toValue(locale);
		const query = `*[_type == "cgv"][0]{
      "title": coalesce(title.${l}, title.en),
      "content": coalesce(content.${l}, content.en)[]{
        ...,
        markDefs[]{
          ...,
          _type == "linkInternal" => {
            "url": select(
              reference->._type == "product" => "/products/" + reference->store.slug.current,
              reference->._type == "collection" => "/collections/" + reference->store.slug.current,
              reference->._type == "cgv" => "/cgv",
              reference->._type == "mentionsLegales" => "/mentions-legales",
              reference->._type == "home" => "/",
              "/"
            )
          }
        }
      },
      "seo": seo
    }`;

		return sanity.fetch(query);
	}, { watch: [locale] });
};
