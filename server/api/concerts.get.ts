export default defineEventHandler(async () => {
	const config = useRuntimeConfig();
	const token = config.notionApiToken;
	const databaseId = config.notionConcertsDatabaseId;

	if (!token || !databaseId) {
		throw createError({
			statusCode: 500,
			message: 'Notion configuration is missing',
		});
	}

	const now = new Date();
	const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

	const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Notion-Version': '2022-06-28',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			filter: {
				and: [
					{
						property: 'URL Tickets',
						url: { is_not_empty: true },
					},
					{
						property: 'Date',
						date: { on_or_after: today },
					},
				],
			},
			sorts: [
				{ property: 'Date', direction: 'ascending' },
				{ property: 'Time', direction: 'ascending' },
			],
		}),
	});

	if (!response.ok) {
		const error = await response.json();
		throw createError({
			statusCode: response.status,
			message: error.message || 'Failed to fetch concerts from Notion',
		});
	}

	const data = await response.json();

	const getTextValue = (prop: any) => {
		if (!prop) return '';
		if (prop.type === 'title') return prop.title?.[0]?.plain_text || '';
		if (prop.type === 'rich_text') return prop.rich_text?.[0]?.plain_text || '';
		if (prop.type === 'formula') return prop.formula?.string || String(prop.formula?.number ?? '') || '';
		if (prop.type === 'select') return prop.select?.name || '';
		if (prop.type === 'multi_select') return prop.multi_select?.[0]?.name || '';
		if (prop.type === 'url') return prop.url || '';
		if (prop.type === 'date') return prop.date?.start || '';
		if (prop.type === 'number') return String(prop.number ?? '');
		return '';
	};

	const concerts = data.results.map((page: any) => {
		const props = page.properties;
		return {
			id: page.id,
			title: getTextValue(props['EVENT NAME']),
			date: getTextValue(props['Date']),
			time: getTextValue(props['Time']),
			city: getTextValue(props['City']),
			country: getTextValue(props['Country']),
			ticketUrl: getTextValue(props['URL Tickets']),
			// TODO placeholder temporaire pour prévisualisation (aucune colonne image dans Notion) — à retirer / brancher sur la vraie colonne image
			imageUrl: 'https://www.grandes-scenes.com/wp-content/uploads/2026/03/Concert-on-Titan-300-x-300-1.png',
		};
	});

	return concerts;
});
