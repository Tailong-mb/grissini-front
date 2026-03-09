/**
 * Push tracking events to dataLayer for GTM (GA4, Meta, etc.).
 * Les tags sont gérés dans GTM et ne se déclenchent qu'après consentement (Cookie Information).
 */

function ensureDataLayer() {
	if (typeof window === 'undefined') return;
	window.dataLayer = window.dataLayer || [];
}

export function useTracking() {
	function push(eventName, payload = {}) {
		ensureDataLayer();
		window.dataLayer.push({
			event: eventName,
			...payload,
		});
	}

	/** Vue produit affichée (fiche produit) */
	function trackViewItem({ itemId, itemName, price, currency = 'EUR', index = 0 }) {
		push('view_item', {
			currency,
			value: price,
			items: [
				{
					item_id: itemId,
					item_name: itemName,
					price,
					index,
				},
			],
		});
	}

	/** Ajout au panier */
	function trackAddToCart({ itemId, itemName, price, quantity = 1, currency = 'EUR' }) {
		push('add_to_cart', {
			currency,
			value: price * quantity,
			items: [
				{
					item_id: itemId,
					item_name: itemName,
					price,
					quantity,
				},
			],
		});
	}

	/** Début du checkout (clic "Passer la commande") */
	function trackBeginCheckout({ value, currency = 'EUR', items = [] }) {
		push('begin_checkout', {
			currency,
			value,
			items: items.map((item, index) => ({
				item_id: item.id,
				item_name: item.name,
				price: item.price,
				quantity: item.quantity,
				index,
			})),
		});
	}

	return {
		trackViewItem,
		trackAddToCart,
		trackBeginCheckout,
		push,
	};
}
