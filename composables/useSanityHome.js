import sanity from '@/utils/sanity';

export const useSanityHome = () => {
	const query = `*[_type == "home"][0]{
      "title": title,
      "items": items[]{
        _key,
        "thumbnail": thumbnail.asset->{_id, url, metadata},
        "video": video.asset->{_id, url, originalFilename},
        "title": title,
        "description": description,
        "linkName": linkName,
        "url": url
      },
      "seo": seo
    }`;

	return useAsyncData('sanity-home', () => sanity.fetch(query));
};
