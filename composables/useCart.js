import { getShopifyClient, cleanShopifyData } from '~/utils/shopify';
const isOpen = ref(false);
const CART_QUERIES = {
	CREATE_CART: `
    mutation CreateCart($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                cost {
                  subtotalAmount {
                    amount
                    currencyCode
                  }
                }
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    sku
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      id
                      title
                      handle
                      images(first: 1) {
                        edges {
                          node {
                            id
                            url
                            altText
                            width
                            height
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `,

	GET_CART: `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        totalQuantity
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              cost {
                subtotalAmount {
                  amount
                  currencyCode
                }
              }
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  sku
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          id
                          url
                          altText
                          width
                          height
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `,

	ADD_TO_CART: `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                cost {
                  subtotalAmount {
                    amount
                    currencyCode
                  }
                }
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    sku
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      id
                      title
                      handle
                      images(first: 1) {
                        edges {
                          node {
                            id
                            url
                            altText
                            width
                            height
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `,

	UPDATE_CART_LINE: `
    mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                cost {
                  subtotalAmount {
                    amount
                    currencyCode
                  }
                }
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    sku
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      id
                      title
                      handle
                      images(first: 1) {
                        edges {
                          node {
                            id
                            url
                            altText
                            width
                            height
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `,

	REMOVE_FROM_CART: `
    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                cost {
                  subtotalAmount {
                    amount
                    currencyCode
                  }
                }
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    sku
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      id
                      title
                      handle
                      images(first: 1) {
                        edges {
                          node {
                            id
                            url
                            altText
                            width
                            height
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `,
};

export const useCart = () => {
	const cart = ref(null);
	const loading = ref(false);
	const error = ref(null);

	const getStoredCartId = () => {
		if (process.client) {
			return localStorage.getItem('shopify_cart_id');
		}
		return null;
	};

	const storeCartId = (cartId) => {
		if (process.client) {
			localStorage.setItem('shopify_cart_id', cartId);
		}
	};

	const createCart = async (lines = []) => {
		loading.value = true;
		error.value = null;

		try {
			const shopifyClient = getShopifyClient();
			const variables = { input: { lines } };
			const data = await shopifyClient.request(CART_QUERIES.CREATE_CART, variables);

			if (data.cartCreate.userErrors.length > 0) {
				throw new Error(data.cartCreate.userErrors[0].message);
			}

			const newCart = cleanShopifyData(data.cartCreate.cart);
			cart.value = newCart;
			storeCartId(newCart.id);

			return newCart;
		} catch (err) {
			error.value = err.message;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const getCart = async (cartId) => {
		loading.value = true;
		error.value = null;

		try {
			const shopifyClient = getShopifyClient();
			const variables = { cartId };
			const data = await shopifyClient.request(CART_QUERIES.GET_CART, variables);

			const existingCart = cleanShopifyData(data.cart);
			cart.value = existingCart;

			return existingCart;
		} catch (err) {
			error.value = err.message;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const addToCart = async (variantId, quantity = 1) => {
		loading.value = true;
		error.value = null;

		try {
			let currentCart = cart.value;

			if (!currentCart) {
				currentCart = await createCart([{ merchandiseId: variantId, quantity }]);
				return currentCart;
			}

			const shopifyClient = getShopifyClient();
			const variables = {
				cartId: currentCart.id,
				lines: [{ merchandiseId: variantId, quantity }],
			};

			const data = await shopifyClient.request(CART_QUERIES.ADD_TO_CART, variables);

			if (data.cartLinesAdd.userErrors.length > 0) {
				throw new Error(data.cartLinesAdd.userErrors[0].message);
			}

			const updatedCart = cleanShopifyData(data.cartLinesAdd.cart);
			cart.value = updatedCart;

			return updatedCart;
		} catch (err) {
			error.value = err.message;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const updateCartLine = async (lineId, quantity) => {
		loading.value = true;
		error.value = null;

		try {
			if (!cart.value) {
				throw new Error('No cart found');
			}

			const shopifyClient = getShopifyClient();
			const variables = {
				cartId: cart.value.id,
				lines: [{ id: lineId, quantity }],
			};

			const data = await shopifyClient.request(CART_QUERIES.UPDATE_CART_LINE, variables);

			if (data.cartLinesUpdate.userErrors.length > 0) {
				throw new Error(data.cartLinesUpdate.userErrors[0].message);
			}

			const updatedCart = cleanShopifyData(data.cartLinesUpdate.cart);
			cart.value = updatedCart;

			return updatedCart;
		} catch (err) {
			error.value = err.message;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const removeFromCart = async (lineId) => {
		loading.value = true;
		error.value = null;

		try {
			if (!cart.value) {
				throw new Error('No cart found');
			}

			const shopifyClient = getShopifyClient();
			const variables = {
				cartId: cart.value.id,
				lineIds: [lineId],
			};

			const data = await shopifyClient.request(CART_QUERIES.REMOVE_FROM_CART, variables);

			if (data.cartLinesRemove.userErrors.length > 0) {
				throw new Error(data.cartLinesRemove.userErrors[0].message);
			}

			const updatedCart = cleanShopifyData(data.cartLinesRemove.cart);
			cart.value = updatedCart;

			return updatedCart;
		} catch (err) {
			error.value = err.message;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const clearCart = async () => {
		if (!cart.value) return;

		const lineIds = cart.value.lines.edges.map((edge) => edge.node.id);
		if (lineIds.length > 0) {
			await removeFromCart(lineIds[0]);
			if (lineIds.length > 1) {
				await clearCart();
			}
		}
	};

	const initializeCart = async () => {
		const storedCartId = getStoredCartId();
		if (storedCartId) {
			try {
				await getCart(storedCartId);
			} catch (err) {
				// Si le panier n'existe plus, le supprimer du localStorage
				if (process.client) {
					localStorage.removeItem('shopify_cart_id');
				}
			}
		}
	};

	// Rediriger vers le checkout
	const checkout = () => {
		if (cart.value?.checkoutUrl) {
			window.location.href = cart.value.checkoutUrl;
		}
	};

	const openCart = () => {
		isOpen.value = true;
	};

	const closeCart = () => {
		isOpen.value = false;
	};

	return {
		cart: readonly(cart),
		loading: readonly(loading),
		error: readonly(error),
		createCart,
		getCart,
		addToCart,
		updateCartLine,
		removeFromCart,
		clearCart,
		initializeCart,
		checkout,
		openCart,
		closeCart,
		isOpen: readonly(isOpen),
	};
};
