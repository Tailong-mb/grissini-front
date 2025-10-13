import sanity from '@/utils/sanity';

export const useSanityMenu = async () => {
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
      "cartTitle": menu.cartTitle,
      "totalLabel": menu.totalLabel,
    },
    "socialMedia": *[_type == "socialMediaSettings"][0]{
      "socialLinks": socialMedia.links[]{
        url,
        "linkText": text,
        isActive
      }
    }
  }`;

	const result = await sanity.fetch(query);
	return result;
};
