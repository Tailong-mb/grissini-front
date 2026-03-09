/**
 * GTM + Consent Mode (Cookie Information)
 *
 * - Initialise dataLayer et Consent Mode par défaut à "denied" (avant tout tag).
 * - Charge le conteneur GTM. Les tags (GA4, Meta, etc.) et le CMP Cookie Information
 *   sont à configurer dans GTM et ne se déclenchent qu'après mise à jour du consentement.
 * - Envoie page_view sur chaque changement de route (pour GTM/GA4).
 */

export default defineNuxtPlugin((nuxtApp) => {
	const config = useRuntimeConfig();
	const gtmId = config.public?.GTM_ID;

	if (typeof window === 'undefined') return;

	// dataLayer et gtag pour Consent Mode v2 (requis avant Cookie Information / GTM)
	window.dataLayer = window.dataLayer || [];
	window.gtag = window.gtag || function () {
		window.dataLayer.push(arguments);
	};

	// Consent par défaut = refusé (Cookie Information met à jour après choix utilisateur)
	window.gtag('consent', 'default', {
		ad_storage: 'denied',
		ad_user_data: 'denied',
		ad_personalization: 'denied',
		analytics_storage: 'denied',
		regions: [],
	});

	// Chargement du conteneur GTM
	if (gtmId) {
		(function (w, d, s, l, id) {
			w[l] = w[l] || [];
			w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
			const f = d.getElementsByTagName(s)[0];
			const j = d.createElement(s);
			j.async = true;
			j.src = 'https://www.googletagmanager.com/gtm.js?id=' + id;
			f.parentNode.insertBefore(j, f);
		})(window, document, 'script', 'dataLayer', gtmId);
	}

	// Page view sur chaque route (pour GA4 / autres tags dans GTM)
	nuxtApp.hook('page:finish', () => {
		const route = useRoute();
		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push({
			event: 'page_view',
			page_path: route.fullPath,
			page_location: window.location.href,
			page_title: document.title || '',
		});
	});
});
