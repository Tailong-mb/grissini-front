import sanityClient from '@/utils/sanity';

export const useSanityHome = async () => {
	try {
		const query = `*[_type == "home"][0]{
      title,
      seo
    }`;

		const data = await sanityClient.fetch(query);
		return data;
	} catch (error) {
		console.error('Error fetching home data:', error);
		throw error;
	}
};
