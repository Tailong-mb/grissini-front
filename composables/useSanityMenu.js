import sanity from '@/utils/sanity';

export const useSanityMenu = async () => {
	const query = `*[_type == "menuSettings"][0]{
    "menuText": menu.menuText,
    "menuClose": menu.menuClose,
    "description": menu.description,
    "newsletterText": menu.newsletterText,
    "contactText": menu.contactText,
    "mail": menu.mail
  }`;

	const result = await sanity.fetch(query);
	return result;
};
