/**
 * Shopify Consent Bridge
 *
 * À ajouter dans le thème Shopify (checkout ou thème principal) ou en "App embed",
 * pour que le consentement collecté sur le storefront (Nuxt + Cookie Information)
 * soit propagé à Shopify via l’API Customer Privacy.
 *
 * Ce script lit les paramètres d’URL (passés depuis le storefront au clic "Passer la commande")
 * et appelle Shopify.customerPrivacy.setTrackingConsent().
 *
 * Paramètres attendus (query string) :
 *   - consent_analytics   : "1" ou "0"
 *   - consent_marketing   : "1" ou "0"
 *   - consent_preferences : "1" ou "0" (optionnel)
 *   - consent_sale_of_data: "1" ou "0" (optionnel)
 */

(function () {
  function getConsentFromUrl() {
    if (typeof window === 'undefined' || !window.location || !window.location.search) {
      return null;
    }
    var params = new URLSearchParams(window.location.search);
    var analytics = params.get('consent_analytics');
    var marketing = params.get('consent_marketing');
    var preferences = params.get('consent_preferences');
    var saleOfData = params.get('consent_sale_of_data');

    if (analytics === null && marketing === null) {
      return null;
    }

    return {
      analytics: analytics === '1',
      marketing: marketing === '1',
      preferences: preferences === '1',
      sale_of_data: saleOfData === '1',
    };
  }

  function applyConsent(consent) {
    if (!window.Shopify || !window.Shopify.loadFeatures) {
      return;
    }

    window.Shopify.loadFeatures(
      [
        {
          name: 'consent-tracking-api',
          version: '0.1',
        },
      ],
      function (error) {
        if (error) {
          console.warn('[Consent Bridge] Shopify consent API load error:', error);
          return;
        }

        if (!window.Shopify.customerPrivacy || !window.Shopify.customerPrivacy.setTrackingConsent) {
          return;
        }

        window.Shopify.customerPrivacy.setTrackingConsent(
          {
            analytics: consent.analytics,
            marketing: consent.marketing,
            preferences: consent.preferences,
            sale_of_data: consent.sale_of_data,
          },
          function (result) {
            if (result && result.error) {
              console.warn('[Consent Bridge] setTrackingConsent error:', result.error);
            }
          }
        );
      }
    );
  }

  function run() {
    var consent = getConsentFromUrl();
    if (!consent) {
      return;
    }
    applyConsent(consent);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
