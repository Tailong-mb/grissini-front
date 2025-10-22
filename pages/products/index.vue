<template>
	<div class="products-page container">
		<div v-if="localizedShopData?.categories" class="categories-wrapper col-start-1 col-end-6 tb:col-end-13">
			<button v-for="(category, index) in localizedShopData.categories" :key="category.key" @click="loadProducts(category.key)" :class="{ active: selectedCategory === category.key }">
				{{ category.label }}
				<span class="category-count" v-if="index !== 0">({{ category.count || 0 }})</span>
			</button>
		</div>
		<div v-for="(product, index) in localizedProducts" :key="product._id" class="product-card col-start-1 col-end-6" :class="gridClass[index % gridClass.length]">
			<div class="image-container">
				<img :src="product.images?.[0]?.asset?.url || product.previewImageUrl || '/placeholder-image.jpg'" :alt="product.translations?.title || product.title" />
			</div>
			<div class="content-container">
				<h2>{{ product.translations?.title || product.title }}</h2>
				<p>{{ formatPrice(product.priceRange?.minVariantPrice) }}</p>
				<NuxtLink :to="`/products/${product.slug}`" class="discover-link">
					{{ product.translations?.discoverProductText || 'Découvrir' }}
				</NuxtLink>
			</div>
		</div>
		<div v-if="loading">Loading products...</div>
		<div v-if="error">Error: {{ error }}</div>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useSanityShop } from '@/composables/useSanityShop';
import { useSanityProductsWithTranslations } from '@/composables/useSanityProductsWithTranslations';
import { useI18n } from 'vue-i18n';
import { getLocalizedText } from '@/utils/translate';

const { locale } = useI18n();

const gridClass = ['tb:col-end-1 tb:col-start-3', 'tb:col-end-4 tb:col-start-6', 'tb:col-end-7 tb:col-start-9', 'tb:col-end-10 tb:col-start-13'];

const shopData = ref(null);
const products = ref(null);
const selectedCategory = ref('all');
const loading = ref(false);
const error = ref(null);

// Computed pour les données localisées
const localizedShopData = computed(() => {
	if (!shopData.value) return null;

	return {
		...shopData.value,
		categories:
			shopData.value.categories?.map((category) => ({
				...category,
				label: getLocalizedText(category.label, locale.value),
			})) || [],
	};
});

const localizedProducts = computed(() => {
	if (!products.value) return null;

	return products.value.map((product) => ({
		...product,
		translations: {
			title: getLocalizedText(product.translations?.title, locale.value),
			description: getLocalizedText(product.translations?.description, locale.value),
			shortDescription: getLocalizedText(product.translations?.shortDescription, locale.value),
			addToCartText: getLocalizedText(product.translations?.addToCartText, locale.value),
			discoverProductText: getLocalizedText(product.translations?.discoverProductText, locale.value),
		},
	}));
});

const loadShopData = async () => {
	loading.value = true;
	error.value = null;
	try {
		shopData.value = await useSanityShop();
	} catch (err) {
		error.value = err.message;
		console.error('Shop page error:', err);
	} finally {
		loading.value = false;
	}
};

const loadProducts = async (category = 'all') => {
	selectedCategory.value = category;
	try {
		products.value = await useSanityProductsWithTranslations(category);
	} catch (err) {
		console.error('Products loading error:', err);
	}
};

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

onMounted(async () => {
	await loadShopData();
	await loadProducts('all');
});
</script>

<style scoped lang="scss">
.products-page {
	position: relative;
	padding: 120rem 0;

	.categories-wrapper {
		display: flex;
		gap: 8rem;
		margin-bottom: 50rem;

		button {
			display: flex;
			align-items: center;
			gap: 4rem;
			@include switzer(600, normal);
			font-size: 12rem;
			color: #747474;
			padding: 10rem;
			border: solid 1px #acacac;
			transition:
				border-color 0.3s linear,
				color 0.3s linear,
				background-color 0.3s linear;

			&.active {
				background-color: $black;
				color: $white;
				border-color: $black;

				.category-count {
					color: $white;
				}
			}

			.category-count {
				@include switzer(600, normal);
				font-size: 6rem;
				color: $black;
				transition: color 0.3s linear;
			}
		}
	}

	.product-card {
		display: flex;
		gap: 9rem;
		justify-content: space-between;
		margin-bottom: 50rem;

		@include tablet {
			margin-bottom: 100;
		}

		.image-container {
			width: calc(50% - 9rem);
			height: 100%;
			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}

		.content-container {
			width: calc(50% - 9rem);
			h2 {
				@include switzer(600, normal);
				font-size: 16rem;
				color: $black;
				margin-bottom: 6rem;
			}
			p {
				@include switzer(500, normal);
				font-size: 12rem;
				color: $black;
				margin-bottom: 6rem;
				opacity: 0.4;
			}

			.discover-link {
				@include switzer(500, normal);
				font-size: 12rem;
				padding: 10rem 20rem;
				background-color: $black;
				color: $white;
				border: solid 1px $black;
				text-decoration: none;
				display: inline-block;
				transition:
					background-color 0.3s linear,
					color 0.3s linear;

				&:hover {
					background-color: $white;
					color: $black;
				}
			}
		}
	}
}
</style>
