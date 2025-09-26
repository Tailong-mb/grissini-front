import sanity from '@/utils/sanity';

export const useSanityMenu = async (locale = 'en') => {
	const query = `*[_type == "menuSettings"][0]{
    "menuText": menuText.${locale},
    "menuClose": menuClose.${locale},
    "description": description.${locale},
    "newsletterText": newsletterText.${locale},
    "contactText": contactText.${locale},
    mail
  }`;

	const result = await sanity.fetch(query);
	return result;
};
