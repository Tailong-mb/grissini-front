import sanity from '@/utils/sanity';

export const useSanityHome = async () => {
	try {
		// Query based on actual homeItem schema
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

		const data = await sanity.fetch(query);
		console.log('=== SANITY HOME RAW DATA ===');
		console.log('Raw data from Sanity:', data);
		console.log('Data keys:', Object.keys(data || {}));
		console.log('============================');
		return data;
	} catch (error) {
		console.error('Error fetching home data:', error);
		throw error;
	}
};
