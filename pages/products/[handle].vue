<template>
	<div class="container product-detail-page">
		<div class="image-mobile-container col-start-1 col-end-6">
			<img v-for="image in localizedProduct?.images" :key="image._id" :src="image.asset.url" :alt="localizedProduct.translations?.title || localizedProduct.title" />
		</div>
		<div class="content-container col-start-2 col-end-6">
			<h1>{{ localizedProduct?.translations?.title || localizedProduct?.title }}</h1>
			<p class="description">{{ localizedProduct?.translations?.description || '' }}</p>
			<div v-if="availableVariants?.length > 1" class="variant-container">
				<div class="variant-item" v-for="variant in availableVariants" :key="variant._id" :class="{ active: selectedVariant?.title === variant.title }" @click="selectedVariant = variant">
					<p>{{ variant.title }}</p>
				</div>
			</div>
			<p class="price">{{ formatPrice(localizedProduct?.priceRange?.minVariantPrice) }}</p>
			<div v-if="error" class="error-message">
				{{ error }}
			</div>
			<button @click="handleAddToCart" :disabled="!selectedVariant || cartLoading" class="button-container">
				{{ cartLoading ? 'Adding...' : localizedProduct?.translations?.addToCartText || 'Add to Cart' }}
			</button>
		</div>
		<div class="image-desktop-container tb:col-start-7 tb:col-end-11">
			<img v-for="image in localizedProduct?.images" :key="image._id" :src="image.asset.url" :alt="localizedProduct.translations?.title || localizedProduct.title" />
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useSanityProductWithTranslations } from '@/composables/useSanityProductsWithTranslations';
import { useI18n } from 'vue-i18n';
import { getLocalizedText } from '@/utils/translate';

const route = useRoute();
const { locale } = useI18n();
const { addToCart, loading: cartLoading, cart: cartData, openCart } = useCart();

// Formater le prix
const formatPrice = (priceData) => {
	if (!priceData) return 'Prix non disponible';

	// Si c'est déjà un objet avec amount et currencyCode
	if (typeof priceData === 'object' && priceData.amount && priceData.currencyCode) {
		const amount = parseFloat(priceData.amount);
		return new Intl.NumberFormat('fr-FR', {
			style: 'currency',
			currency: priceData.currencyCode,
		}).format(amount);
	}

	// Si c'est juste un string/number
	if (typeof priceData === 'string' || typeof priceData === 'number') {
		const amount = parseFloat(priceData);
		return new Intl.NumberFormat('fr-FR', {
			style: 'currency',
			currency: 'EUR', // Devise par défaut
		}).format(amount);
	}

	return 'Prix non disponible';
};

const product = ref(null);
const selectedVariant = ref(null);
const quantity = ref(1);
const loading = ref(false);
const error = ref(null);

// Computed pour les données localisées
const localizedProduct = computed(() => {
	if (!product.value) return null;

	return {
		...product.value,
		translations: {
			title: getLocalizedText(product.value.translations?.title, locale.value),
			description: getLocalizedText(product.value.translations?.description, locale.value),
			shortDescription: getLocalizedText(product.value.translations?.shortDescription, locale.value),
			addToCartText: getLocalizedText(product.value.translations?.addToCartText, locale.value),
			discoverProductText: getLocalizedText(product.value.translations?.discoverProductText, locale.value),
		},
	};
});

// Computed property to filter available variants
const availableVariants = computed(() => {
	if (!product.value?.variants) return [];

	return product.value.variants.filter((variant) => variant.shopifyId && variant.shopifyId.startsWith('gid://shopify/ProductVariant/'));
});

useHead(() => ({
	title: localizedProduct.value ? `${localizedProduct.value.translations?.title || localizedProduct.value.title} - Grissini` : 'Product - Grissini',
	meta: [
		{
			name: 'description',
			content: localizedProduct.value?.translations?.description || localizedProduct.value?.title || 'Product details',
		},
	],
}));

const loadProduct = async () => {
	loading.value = true;
	error.value = null;

	try {
		const handle = route.params.handle;
		const productData = await useSanityProductWithTranslations(handle);

		if (!productData) {
			throw new Error('Product not found');
		}

		product.value = productData;

		// Sélectionner la première variante disponible par défaut
		// Wait for the computed property to update
		await nextTick();

		if (availableVariants.value.length > 0) {
			selectedVariant.value = availableVariants.value[0];
		} else {
			error.value = 'This product is currently unavailable';
		}
	} catch (err) {
		error.value = err.message;
		console.error('Product detail page error:', err);
	} finally {
		loading.value = false;
	}
};

const handleAddToCart = async () => {
	if (!selectedVariant.value) {
		console.error('No variant selected');
		return;
	}

	// Debug: Log variant data
	console.log('Selected variant:', selectedVariant.value);
	console.log('Shopify ID:', selectedVariant.value.shopifyId);

	if (!selectedVariant.value.shopifyId) {
		console.error('No Shopify ID found for selected variant');
		error.value = 'Product variant not available';
		return;
	}

	try {
		await addToCart(selectedVariant.value.shopifyId, quantity.value);
		// Open cart after successful addition
		openCart();
	} catch (err) {
		console.error('Error adding to cart:', err);
		if (err.message.includes("n'existent pas") || err.message.includes('does not exist')) {
			error.value = 'This product variant is no longer available. Please refresh the page or contact support.';
		} else {
			error.value = 'Failed to add product to cart. Please try again.';
		}
	}
};

onMounted(async () => {
	await loadProduct();
});
</script>

<style scoped lang="scss">
.product-detail-page {
	position: relative;
	padding: 16dvh 0;

	@include tablet {
		padding: 0;
	}

	.image-mobile-container {
		display: flex;
		gap: 8rem;
		height: 35dvh;
		flex-wrap: nowrap;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		-ms-overflow-style: none;

		&::-webkit-scrollbar {
			display: none;
		}

		@include tablet {
			display: none;
		}

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
	.content-container {
		margin-top: 10dvh;

		@include tablet {
			position: fixed;
			width: 330rem;
			margin-top: 20vh;
		}

		h1 {
			@include switzer(600, normal);
			font-size: 12rem;
			color: $black;
			text-transform: uppercase;
		}

		.description {
			margin-top: 39rem;
			@include switzer(500, normal);
			font-size: 12rem;
			color: $black;
			opacity: 0.5;
		}

		.variant-container {
			display: flex;
			gap: 8rem;
			flex-wrap: wrap;
			margin-top: 39rem;
			.variant-item {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 40rem;
				height: 40rem;
				@include switzer(500, normal);
				font-size: 12rem;
				color: $black;
				padding: 10rem;
				border: 1px solid $black;
				cursor: pointer;
				transition:
					color 0.3s ease,
					background-color 0.3s ease;

				&:hover,
				&.active {
					background-color: $black;
					color: $white;
				}
			}
		}

		.price {
			margin-top: 50rem;
			margin-bottom: 39rem;
			@include switzer(600, normal);
			font-size: 12rem;
			color: $black;

			@include tablet {
				margin-top: 60rem;
				margin-bottom: 50rem;
			}
		}

		.error-message {
			margin-top: 20rem;
			@include switzer(400, normal);
			font-size: 10rem;
			color: #e74c3c;
			padding: 10rem;
			background-color: rgba(231, 76, 60, 0.1);
			border: 1px solid rgba(231, 76, 60, 0.3);
		}

		.button-container {
			margin-top: 39rem;
			@include switzer(500, normal);
			font-size: 8rem;
			color: $black;
			padding: 10rem;
			background-color: $black;
			color: $white;
			border: solid 1px $black;
			cursor: pointer;
			text-transform: uppercase;
			transition: all 0.3s ease;
			&:hover {
				background-color: $white;
				color: $black;
			}
			&:disabled {
				opacity: 0.5;
				cursor: not-allowed;
			}
		}
	}

	.image-desktop-container {
		display: none;
		@include tablet {
			display: flex;
			flex-direction: column;
			gap: 3rem;

			img {
				width: 100%;
				height: auto;
			}
		}
	}
}
</style>
