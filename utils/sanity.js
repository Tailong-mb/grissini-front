import { createClient } from '@sanity/client';

export default createClient({
	projectId: 'f7eqgv37',
	dataset: 'production',
	useCdn: true,
	apiVersion: '2025-07-23',
});
