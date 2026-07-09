import sanity from '@/utils/sanity';

export const useSanityHub = () => {
	const query = `*[_type == "hub"][0]{
    "viewText": viewText,
    "watchAllText": watchAllText,
    "watchAllLink": watchAllLink,
    "watchText": watchText,
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
      "title": title,
      "subtitle": subtitle,
      link
    },
    "seo": seo
  }`;

	return useAsyncData('sanity-hub', () => sanity.fetch(query));
};
