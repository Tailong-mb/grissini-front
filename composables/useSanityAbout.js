import sanity from '@/utils/sanity';

export const useSanityAbout = (locale) => {
	return useAsyncData('sanity-about', () => {
		const l = toValue(locale);
		const query = `*[_type == "about"][0]{
      "viewText": viewText.${l},
      "items": items[]{
        thumbnail{
          asset->{
            _id,
            url,
            metadata
          }
        },
        video{
          asset->{
            _id,
            url,
            originalFilename
          }
        },
        scrollImage{
          asset->{
            _id,
            url,
            metadata
          }
        },
        "title": title.${l},
        "description": description.${l},
        "socialLinks": socialLinks[]{
          "text": text.${l},
          url
        }
      },
      "seo": seo
    }`;

		return sanity.fetch(query);
	}, { watch: [locale] });
};
