import sanity from '@/utils/sanity';

export const useSanityCgv = async (locale = 'en') => {
	const query = `*[_type == "cgv"][0]{
    "title": coalesce(title.${locale}, title.en),
    "content": coalesce(content.${locale}, content.en)[]{
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

	const result = await sanity.fetch(query);
	return result;
};
