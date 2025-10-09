<template>
	<div class="newsletter-popin container" :class="{ active: isOpen }">
		<div class="newsletter-popin__left tb:col-start-1 tb:col-end-8" :class="{ active: isOpen }" @click="closeCart"></div>
		<div class="newsletter-popin__right col-start-1 col-end-6 tb:col-start-8 tb:col-end-13">
			<button class="newsletter-popin__right__close" :class="{ active: isOpen }" @click="closeCart">
				{{ data?.menuClose }}
			</button>
			<h2 :class="{ active: isOpen }">
				{{ data?.cartTitle }}
			</h2>
			<div class="lines"></div>

			<div class="line col-start-1 col-end-6 tb:col-start-1 tb:col-end-5"></div>

			<template v-if="cartData && cartData.lines?.edges && cartData.lines.edges.length > 0">
				<template v-for="edge in cartData?.lines?.edges" :key="edge.node.id">
					<div class="image-product col-start-1 col-end-2">
						<img :src="edge.node.merchandise?.product?.images?.edges?.[0]?.node?.url || ''" :alt="edge.node.merchandise?.product?.images?.edges?.[0]?.node?.altText || edge.node.merchandise?.product?.title" />
					</div>
					<div class="col-start-2 col-end-4 tb:col-start-2 tb:col-end-3 title-product">
						{{ edge.node.merchandise?.product?.title }}
					</div>
					<div class="col-start-3 col-end-5 tb:col-start-3 tb:col-end-4 quantity">
						<button class="less-product" @click="updateQuantity(edge.node.id, edge.node.quantity - 1)" :disabled="edge.node.quantity <= 1">-</button>
						<div class="quantity">{{ edge.node.quantity }}</div>
						<button class="more-product" @click="updateQuantity(edge.node.id, edge.node.quantity + 1)">+</button>
					</div>
					<div class="col-start-5 col-end-6 tb:col-start-4 tb:col-end-5 title-product">
						{{ formatPrice(edge.node.cost?.subtotalAmount) }}
					</div>
					<div class="line col-start-1 col-end-6 tb:col-start-1 tb:col-end-5"></div>
				</template>
			</template>

			<!-- Message si panier vide -->
			<template v-else>
				<div class="empty-cart col-start-1 col-end-6 tb:col-start-1 tb:col-end-5">Votre panier est vide</div>
			</template>
		</div>

		<!-- Total et bouton checkout -->
		<div v-if="cartData && cartData.lines?.edges && cartData.lines.edges.length > 0" class="cart-footer" :class="{ active: isOpen }">
			<div class="cart-total">
				<span class="total-label">{{ data?.totalLabel }}:</span>
				<span class="total-amount">{{ formatPrice(cartData.cost?.totalAmount) }}</span>
			</div>
			<button class="checkout-btn" @click="goToCheckout">Passer la commande</button>
		</div>
	</div>
</template>

<script setup>
const { locale } = useI18n();
const { isOpen, closeCart, cart: cartData, updateCartLine, removeFromCart, checkout, initializeCart } = useCart();
const rawData = ref(null);

const data = computed(() => {
	if (!rawData.value) return null;

	return {
		menuClose: rawData.value.menu?.menuClose?.[locale.value] || rawData.value.menu?.menuClose?.en || rawData.value.menu?.menuClose,
		cartTitle: rawData.value.menu?.cartTitle?.[locale.value] || rawData.value.menu?.cartTitle?.en || rawData.value.menu?.cartTitle,
		totalLabel: rawData.value.menu?.totalLabel?.[locale.value] || rawData.value.menu?.totalLabel?.en || rawData.value.menu?.totalLabel,
	};
});

const cartCount = computed(() => {
	return cartData.value?.totalQuantity || 0;
});

// Formater le prix
const formatPrice = (priceData) => {
	if (!priceData) return '0,00 €';
	const amount = parseFloat(priceData.amount);
	return new Intl.NumberFormat('fr-FR', {
		style: 'currency',
		currency: priceData.currencyCode || 'EUR',
	}).format(amount);
};

// Mettre à jour la quantité d'un produit
const updateQuantity = async (lineId, newQuantity) => {
	try {
		if (newQuantity <= 0) {
			// Supprimer le produit si quantité <= 0
			await removeFromCart(lineId);
		} else {
			// Mettre à jour la quantité
			await updateCartLine(lineId, newQuantity);
		}
	} catch (error) {
		console.error('Erreur lors de la mise à jour du panier:', error);
	}
};

// Aller au checkout
const goToCheckout = () => {
	checkout();
};

const loadNewsletterData = async () => {
	try {
		rawData.value = await useSanityMenu();
	} catch (err) {
		console.error('Newsletter loading error:', err);
	}
};

onMounted(async () => {
	await loadNewsletterData();
	await initializeCart();
});
</script>

<style lang="scss" scoped>
.newsletter-popin {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100dvh;
	z-index: 150;
	margin: 0;
	transform: translate3d(100%, 0, 0);
	transition: transform 2s $out-cubic;

	&.active {
		transform: translate3d(0, 0, 0);
		transition: transform 1.2s $out-cubic;
	}

	&__left {
		display: none;

		@include tablet {
			display: block;
			height: 100%;
			background-color: $black;
			transition: opacity 0.1s linear;
			opacity: 0;

			&.active {
				opacity: 0.06;
				transition: 1.2s opacity 0.5s linear;
			}
		}
	}

	&__right {
		position: relative;
		background-color: $white;
		padding: 0 8rem;
		height: 100%;

		@include tablet {
			padding: 0 118rem;
		}

		&__close {
			position: absolute;
			top: 8rem;
			right: 8rem;
			background: none;
			border: none;
			padding: 0;
			margin: 0;
			cursor: pointer;
			color: $black;
			font-size: 12rem;
			text-transform: uppercase;
			transition: opacity 0.3s linear;
			@include switzer(600, normal);
			opacity: 0;

			&.active {
				opacity: 1;
			}

			&:hover {
				opacity: 0.7;
			}
		}

		h2 {
			@include switzer(600, normal);
			color: $black;
			text-transform: uppercase;
			font-size: 12rem;
			margin-top: 120rem;
			transition: opacity 0.2s linear;
			opacity: 0;
			padding-bottom: 24rem;

			&.active {
				opacity: 1;
				transition: 1.2s opacity 0.5s linear;
			}

			.cart__title-count {
				@include switzer(400, normal);
				font-size: 8rem;
				opacity: 0.6;
				margin-left: 8rem;
			}
		}

		.lines {
			width: 100%;
			height: 1rem;
			background-color: $black;
			opacity: 0.1;
		}
	}

	.grid-cart {
		margin-top: 30rem;
		opacity: 0;
		transition: opacity 0.2s linear;

		&.active {
			opacity: 1;
			transition: 1.2s opacity 0.5s linear;
		}

		.cart-head {
			@include switzer(400, normal);
			font-size: 8rem;
			color: $black;
			opacity: 0.4;
			text-transform: uppercase;
			margin-bottom: 16rem;
		}

		.line {
			height: 1rem;
			background-color: $black;
			opacity: 0.1;
			margin: 16rem 0;
		}

		.image-product {
			width: 64rem;
			height: 64rem;
			border: 1px solid rgba($black, 0.2);
			overflow: hidden;
			transition: border-color 0.3s linear;

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}

		.title-product {
			@include switzer(400, normal);
			font-size: 10rem;
			color: $black;
			align-self: center;
		}

		.quantity {
			display: flex;
			align-items: center;
			gap: 12rem;

			.less-product,
			.more-product {
				width: 24rem;
				height: 24rem;
				display: flex;
				align-items: center;
				justify-content: center;
				@include switzer(400, normal);
				font-size: 12rem;
				color: rgba($black, 0.6);
				background: none;
				border: 1px solid rgba($black, 0.2);
				transition: all 0.3s linear;
				cursor: pointer;

				&:hover:not(:disabled) {
					color: $black;
					border-color: $black;
				}

				&:disabled {
					opacity: 0.2;
					cursor: not-allowed;
				}
			}

			.quantity {
				@include switzer(400, normal);
				font-size: 10rem;
				color: $black;
				min-width: 20rem;
				text-align: center;
			}
		}
	}

	.empty-cart {
		@include switzer(400, normal);
		font-size: 10rem;
		color: $black;
		text-align: center;
		margin-top: 40rem;
		opacity: 0.6;
	}

	.cart-footer {
		margin-top: 40rem;
		opacity: 0;
		transition: opacity 0.2s linear;

		&.active {
			opacity: 1;
			transition: 1.2s opacity 0.5s linear;
		}

		.cart-total {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 24rem;
			padding: 16rem 0;
			border-top: 1px solid rgba($black, 0.1);

			.total-label {
				@include switzer(400, normal);
				font-size: 10rem;
				color: $black;
				text-transform: uppercase;
			}

			.total-amount {
				@include switzer(600, normal);
				font-size: 12rem;
				color: $black;
			}
		}

		.checkout-btn {
			@include switzer(400, normal);
			width: 100%;
			font-size: 10rem;
			text-transform: uppercase;
			padding: 16rem 24rem;
			color: $white;
			border: solid 1px $black;
			background-color: $black;
			cursor: pointer;
			transition: all 0.3s linear;

			&:hover {
				background-color: $white;
				color: $black;
			}
		}
	}
}
</style>
