import sanity from '@/utils/sanity';

export const useSanitySocialMedia = (locale) => {
	return useAsyncData('sanity-social-media', () => {
		const l = toValue(locale);
		const query = `*[_type == "socialMediaSettings"][0]{
      "socialLinks": socialLinks[]{
        url,
        "linkText": linkText.${l},
        isActive
      }
    }`;

		return sanity.fetch(query);
	}, { watch: [locale] });
};
