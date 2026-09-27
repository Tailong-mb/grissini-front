/**
 * Exemple de pixel personnalisé Shopify (Customer Events)
 *
 * À coller tel quel dans : Paramètres → Customer events → Add custom pixel → Code.
 * Shopify fournit dans le contexte : analytics, browser, init (et éventuellement customerPrivacy).
 *
 * Ce pixel :
 * - Lit le consentement via init.customerPrivacy (déjà renseigné par le script
 *   shopify-consent-bridge.js qui appelle setTrackingConsent avant chargement des pixels).
 * - Ne envoie des données qu’après vérification du consentement (analytics / marketing).
 * - Écoute checkout_started et checkout_completed.
 *
 * À adapter : IDs GA4, Meta Pixel, Google Ads (voir commentaires dans le code).
 */

// Consentement au chargement (mis à jour par le bridge avant que le pixel ne s’exécute)
var consent = (typeof init !== 'undefined' && init.customerPrivacy) || {};

// Si l’API expose customerPrivacy.subscribe, mettre à jour l’état à chaque changement
if (typeof customerPrivacy !== 'undefined' && customerPrivacy && customerPrivacy.subscribe === 'function') {
  customerPrivacy.subscribe('visitorConsentCollected', function (event) {
    if (event && event.customerPrivacy) consent = event.customerPrivacy;
  });
}

function analyticsAllowed() {
  return consent.analyticsProcessingAllowed === true;
}

function marketingAllowed() {
  return consent.marketingAllowed === true;
}

// ——— Checkout started ———
analytics.subscribe('checkout_started', function (event) {
  if (!analyticsAllowed()) return;
  var data = event && event.data && event.data.checkout;
  if (!data) return;

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: data.currencyCode,
      value: parseFloat((data.totalPrice && data.totalPrice.amount) || 0) || 0,
      items: (data.lineItems || []).map(function (line, i) {
        return {
          item_id: line.merchandise && line.merchandise.product && line.merchandise.product.id,
          item_name: line.merchandise && line.merchandise.product && line.merchandise.product.title,
          price: parseFloat((line.price && line.price.amount) || 0) || 0,
          quantity: line.quantity || 1,
          index: i,
        };
      }),
    });
  }
});

// ——— Checkout completed (purchase) ———
analytics.subscribe('checkout_completed', function (event) {
  var data = event && event.data && event.data.checkout;
  if (!data || !data.order) return;

  var orderId = data.order.id;
  var total = (data.totalPrice && data.totalPrice.amount) ? parseFloat(data.totalPrice.amount) : 0;
  var currency = data.currencyCode || 'EUR';

  // GA4 purchase (consentement analytics)
  if (analyticsAllowed() && typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: orderId,
      value: total,
      currency: currency,
      items: (data.lineItems || []).map(function (line, i) {
        return {
          item_id: line.merchandise && line.merchandise.product && line.merchandise.product.id,
          item_name: line.merchandise && line.merchandise.product && line.merchandise.product.title,
          price: parseFloat((line.price && line.price.amount) || 0) || 0,
          quantity: line.quantity || 1,
          index: i,
        };
      }),
    });
  }

  // Meta Pixel Purchase (consentement marketing)
  if (marketingAllowed() && typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      value: total,
      currency: currency,
      content_ids: (data.lineItems || []).map(function (line) {
        return line.merchandise && line.merchandise.product && line.merchandise.product.id;
      }),
      content_type: 'product',
      order_id: orderId,
    });
  }

  // Google Ads conversion (consentement marketing) — remplacer AW-XXXXXX/YYYYY par votre ID
  if (marketingAllowed() && typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: 'AW-XXXXXX/YYYYY',
      value: total,
      currency: currency,
      transaction_id: orderId,
    });
  }
});
