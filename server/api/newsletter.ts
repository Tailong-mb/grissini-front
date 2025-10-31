export default defineEventHandler(async (event) => {
	// Only allow POST requests
	if (event.method !== 'POST') {
		throw createError({
			statusCode: 405,
			message: 'Method Not Allowed',
		});
	}

	try {
		const body = await readBody(event);
		const { email } = body;

		// Validate email
		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			throw createError({
				statusCode: 400,
				message: 'Invalid email address',
			});
		}

		const config = useRuntimeConfig();
		const apiKey = config.mailchimpApiKey;
		const audienceId = config.mailchimpAudienceId;

		if (!apiKey || !audienceId) {
			throw createError({
				statusCode: 500,
				message: 'Mailchimp configuration is missing',
			});
		}

		// Extract datacenter from API key (format: xxxxx-us1)
		const datacenter = apiKey.split('-')[1] || 'us1';
		const apiUrl = `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}/members`;

		// Subscribe user to Mailchimp list
		// Mailchimp uses Basic Auth with any username and API key as password
		const authString = Buffer.from(`apikey:${apiKey}`).toString('base64');
		
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Basic ${authString}`,
			},
			body: JSON.stringify({
				email_address: email,
				status: 'subscribed', // or 'pending' if you want double opt-in
			}),
		});

		const data = await response.json();

		if (!response.ok) {
			// Handle Mailchimp errors
			if (data.title === 'Member Exists') {
				throw createError({
					statusCode: 409,
					message: 'This email is already subscribed',
				});
			}

			throw createError({
				statusCode: response.status,
				message: data.detail || data.title || 'Failed to subscribe to newsletter',
			});
		}

		return {
			success: true,
			message: 'Successfully subscribed to newsletter',
			data,
		};
	} catch (error: any) {
		// If it's already a createError, rethrow it
		if (error.statusCode) {
			throw error;
		}

		// Otherwise, create a generic error
		throw createError({
			statusCode: 500,
			message: error.message || 'An error occurred while subscribing to newsletter',
		});
	}
});

