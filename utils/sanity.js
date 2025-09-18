import { createClient } from '@sanity/client';

export default createClient({
	projectId: 'ynsoowqy',
	dataset: 'production',
	useCdn: true,
	apiVersion: '2025-07-23',
});
