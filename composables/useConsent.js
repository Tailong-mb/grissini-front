/**
 * Lit le consentement actuel (Cookie Information / GTM Consent Mode) pour le transmettre
 * au checkout Shopify via l'URL (consent_analytics, consent_marketing, etc.).
 */

function getConsentFromDataLayer() {
	if (typeof window === 'undefined') return null;
	// GTM Consent Mode stocke parfois le dernier état dans dataLayer
	const dl = window.dataLayer || [];
	for (let i = dl.length - 1; i >= 0; i--) {
		const e = dl[i];
		if (e && e.event === 'consent_update' && e.analytics_storage !== undefined) {
			return {
				analytics: e.analytics_storage === 'granted',
				marketing: e.ad_storage === 'granted',
				preferences: true,
				sale_of_data: false,
			};
		}
	}
	return null;
}

/** Cookie Information peut exposer un état dans un cookie ou window */
function getConsentFromCookieInformation() {
	if (typeof window === 'undefined') return null;
	// Cookie Information (cookieinformation.com) peut exposer CookieConsent ou similar
	const c = window.CookieConsent || window.CookieInformation;
	if (c && typeof c.getConsentGivenFor === 'function') {
		try {
			return {
				analytics: !!c.getConsentGivenFor('cookie_cat_statistic') || !!c.getConsentGivenFor('statistics'),
				marketing: !!c.getConsentGivenFor('cookie_cat_marketing') || !!c.getConsentGivenFor('marketing'),
				preferences: true,
				sale_of_data: false,
			};
		} catch (_) {
			// ignore
		}
	}
	if (c && c.consent) {
		return {
			analytics: !!(c.consent.statistics || c.consent.analytics),
			marketing: !!c.consent.marketing,
			preferences: true,
			sale_of_data: false,
		};
	}
	return null;
}

export function useConsent() {
	/** Retourne l'objet consentement { analytics, marketing, preferences, sale_of_data } ou null */
	function getConsent() {
		return getConsentFromCookieInformation() || getConsentFromDataLayer();
	}

	/**
	 * Construit la query string de consentement pour l'URL de checkout Shopify.
	 * À append à checkoutUrl pour que le script Shopify (docs/shopify-consent-bridge.js) lise le consentement.
	 */
	function getCheckoutConsentParams() {
		const consent = getConsent();
		if (!consent) return '';

		const params = new URLSearchParams();
		params.set('consent_analytics', consent.analytics ? '1' : '0');
		params.set('consent_marketing', consent.marketing ? '1' : '0');
		params.set('consent_preferences', consent.preferences ? '1' : '0');
		params.set('consent_sale_of_data', consent.sale_of_data ? '1' : '0');
		const qs = params.toString();
		return qs ? (qs.startsWith('?') ? qs : '?' + qs) : '';
	}

	/**
	 * Retourne l'URL de checkout avec les paramètres de consentement ajoutés.
	 */
	function appendConsentToCheckoutUrl(checkoutUrl) {
		if (!checkoutUrl || typeof checkoutUrl !== 'string') return checkoutUrl;
		const consentParams = getCheckoutConsentParams();
		if (!consentParams) return checkoutUrl;
		const sep = checkoutUrl.includes('?') ? '&' : '?';
		return checkoutUrl + sep + consentParams.replace(/^\?/, '');
	}

	return {
		getConsent,
		getCheckoutConsentParams,
		appendConsentToCheckoutUrl,
	};
}
