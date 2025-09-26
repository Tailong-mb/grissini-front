import sanity from '@/utils/sanity';

export const useSanityAbout = async (locale = 'en') => {
	const query = `*[_type == "about"][0]{
    "viewText": viewText.${locale},
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
      "title": title.${locale},
      "description": description.${locale},
      "socialLinks": socialLinks[]{
        "text": text.${locale},
        url
      }
    },
    "seo": seo
  }`;

	const result = await sanity.fetch(query);
	return result;
};
