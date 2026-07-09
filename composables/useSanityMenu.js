import sanity from '@/utils/sanity';

export const useSanityMenu = () => {
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
      "cartMenuTitle": menu.cartMenuTitle,
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

	return useAsyncData('sanity-menu', () => sanity.fetch(query));
};
