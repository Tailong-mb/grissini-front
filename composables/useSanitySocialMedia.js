import sanity from '@/utils/sanity';

export const useSanitySocialMedia = async (locale = 'en') => {
	const query = `*[_type == "socialMediaSettings"][0]{
    "socialLinks": socialLinks[]{
      url,
      "linkText": linkText.${locale},
      isActive
    }
  }`;

	const result = await sanity.fetch(query);
	return result;
};
