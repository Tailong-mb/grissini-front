<template>
	<div class="container product-detail-page">
		<div class="image-mobile-container col-start-1 col-end-6">
			<img v-for="image in product?.images" :key="image._id" :src="image.asset.url" :alt="product.translations?.title || product.title" />
		</div>
		<div class="content-container col-start-2 col-end-6">
			<h1>{{ product?.translations?.title || product?.title }}</h1>
			<p class="description">{{ product?.translations?.description || '' }}</p>
			<div v-if="product?.variants?.length > 1" class="variant-container">
				<div class="variant-item" v-for="variant in product?.variants" :key="variant._id" :class="{ active: selectedVariant?.title === variant.title }" @click="selectedVariant = variant">
					<p>{{ variant.title }}</p>
				</div>
			</div>
			<p>{{ product?.priceRange?.minVariantPrice }}</p>
			<button @click="handleAddToCart" :disabled="!selectedVariant || cartLoading" class="button-container">
				{{ cartLoading ? 'Adding...' : product?.translations?.addToCartText || 'Add to Cart' }}
			</button>
		</div>
		<div class="image-desktop-container tb:col-start-7 tb:col-end-11">
			<img v-for="image in product?.images" :key="image._id" :src="image.asset.url" :alt="product.translations?.title || product.title" />
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSanityProductWithTranslations } from '@/composables/useSanityProductsWithTranslations';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const { locale } = useI18n();
const { addToCart, loading: cartLoading, cart: cartData } = useCart();

const product = ref(null);
const selectedVariant = ref(null);
const quantity = ref(1);
const loading = ref(false);
const error = ref(null);

useHead(() => ({
	title: product.value ? `${product.value.translations?.title || product.value.title} - Grissini` : 'Product - Grissini',
	meta: [
		{
			name: 'description',
			content: product.value?.translations?.description || product.value?.title || 'Product details',
		},
	],
}));

const loadProduct = async () => {
	loading.value = true;
	error.value = null;

	try {
		const handle = route.params.handle;
		const productData = await useSanityProductWithTranslations(handle, locale.value);

		console.log('=== PRODUCT DETAIL PAGE DATA ===');
		console.log('Handle:', handle);
		console.log('Locale:', locale.value);
		console.log('Product Data:', productData);
		console.log('================================');

		if (!productData) {
			throw new Error('Product not found');
		}

		product.value = productData;

		// Sélectionner la première variante par défaut
		if (productData.variants?.length > 0) {
			selectedVariant.value = productData.variants[0];
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

	try {
		await addToCart(selectedVariant.value.shopifyId, quantity.value);
	} catch (err) {
		console.error('Error adding to cart:', err);
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

		.button-container {
			margin-top: 39rem;
			@include switzer(500, normal);
			font-size: 12rem;
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

			img {
				width: 100%;
				height: auto;
			}
		}
	}
}
</style>
