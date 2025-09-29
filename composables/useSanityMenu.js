import sanity from '@/utils/sanity';

export const useSanityMenu = async (locale = 'en') => {
	const query = `*[_type == "menuSettings"][0]{
    "menuText": menu.menuText.${locale},
    "menuClose": menu.menuClose.${locale},
    "description": menu.description.${locale},
    "newsletterText": menu.newsletterText.${locale},
    "contactText": menu.contactText.${locale},
    "mail": menu.mail
  }`;

	const result = await sanity.fetch(query);
	return result;
};
