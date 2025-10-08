import sanity from '@/utils/sanity';

export const useSanityMenu = async (locale = 'en') => {
	const query = `{
    "menu": *[_type == "menuSettings"][0]{
      "menuText": menu.menuText,
      "menuClose": menu.menuClose,
      "description": menu.description,
      "newsletterText": menu.newsletterText,
      "descriptionNewsletter": menu.descriptionNewsletter,
      "contactText": menu.contactText,
      "mail": menu.mail,
      "emailLabel": menu.emailLabel,
    },
    "socialMedia": *[_type == "socialMediaSettings"][0]{
      "socialLinks": socialMedia.links[]{
        url,
        "linkText": text.${locale},
        isActive
      }
    }
  }`;

	const result = await sanity.fetch(query);
	return result;
};
