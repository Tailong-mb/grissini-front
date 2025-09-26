import sanity from '@/utils/sanity';

export const useSanityHub = async (locale = 'en') => {
	const query = `*[_type == "hub"][0]{
    "viewText": viewText.${locale},
    "watchAllText": watchAllText.${locale},
    "watchAllLink": watchAllLink,
    "watchText": watchText.${locale},
    "items": items[]{
      thumbnailMobile{
        asset->{
          _id,
          url,
          metadata
        }
      },
      thumbnailDesktop{
        asset->{
          _id,
          url,
          metadata
        }
      },
      videoMobile{
        asset->{
          _id,
          url,
          originalFilename
        }
      },
      videoDesktop{
        asset->{
          _id,
          url,
          originalFilename
        }
      },
      "title": title.${locale},
      "subtitle": subtitle.${locale},
      link
    },
    "seo": seo
  }`;

	const result = await sanity.fetch(query);
	return result;
};
