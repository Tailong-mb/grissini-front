<template>
	<div>
		<h1>Shop Page</h1>
		<p>Check console for data logs</p>

		<!-- Category filters -->
		<div v-if="shopData?.categories">
			<h2>Categories:</h2>
			<button
				v-for="category in shopData.categories"
				:key="category.key"
				@click="loadProducts(category.key)"
				:style="{
					backgroundColor: selectedCategory === category.key ? '#007bff' : '#f8f9fa',
					color: selectedCategory === category.key ? 'white' : 'black',
					padding: '10px 20px',
					margin: '5px',
					border: '1px solid #ccc',
					cursor: 'pointer',
				}"
			>
				{{ category.label }}
			</button>
		</div>

		<!-- Products -->
		<div v-if="products">
			<h2>Products ({{ selectedCategory }}): {{ products.length }} found</h2>
			<div v-for="product in products" :key="product._id" style="border: 1px solid #ddd; padding: 15px; margin: 10px 0">
				<h3>{{ product.translations?.title || product.title }}</h3>
				<p><strong>Description:</strong> {{ product.translations?.description || 'No description' }}</p>
				<p><strong>Price:</strong> {{ product.priceRange?.minVariantPrice }} - {{ product.priceRange?.maxVariantPrice }}</p>
				<p><strong>Images:</strong> {{ product.images?.length || 0 }}</p>
				<p><strong>Variants:</strong> {{ product.variants?.length || 0 }}</p>
				<p><strong>Product Type:</strong> {{ product.productType || 'No type' }}</p>
				<p><strong>Vendor:</strong> {{ product.vendor || 'No vendor' }}</p>
				<p><strong>Add to Cart Text:</strong> {{ product.translations?.addToCartText || 'Add to Cart' }}</p>
				<button @click="handleAddToCart(product)" :disabled="!product.variants?.length" style="background: #007bff; color: white; padding: 10px 20px; border: none; cursor: pointer; margin-top: 10px">
					{{ product.translations?.addToCartText || 'Add to Cart' }}
				</button>
			</div>
		</div>

		<div v-if="loading">Loading products...</div>
		<div v-if="error">Error: {{ error }}</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSanityShop } from '@/composables/useSanityShop';
import { useSanityProductsWithTranslations } from '@/composables/useSanityProductsWithTranslations';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const shopData = ref(null);
const products = ref(null);
const selectedCategory = ref('all');
const loading = ref(false);
const error = ref(null);

const loadShopData = async () => {
	loading.value = true;
	error.value = null;
	try {
		shopData.value = await useSanityShop(locale.value);
		console.log('=== SHOP PAGE DATA ===');
		console.log('Locale:', locale.value);
		console.log('Shop Data:', shopData.value);
		console.log('======================');
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
		products.value = await useSanityProductsWithTranslations(locale.value, category);
		console.log('=== PRODUCTS DATA ===');
		console.log('Category:', category);
		console.log('Products:', products.value);
		console.log('=====================');
	} catch (err) {
		console.error('Products loading error:', err);
	}
};

const handleAddToCart = async (product) => {
	if (!product.variants?.length) {
		console.error('No variants available for this product');
		return;
	}

	try {
		// Utiliser votre système d'ajout au panier existant
		const { addToCart } = useCart();
		const firstVariant = product.variants[0];

		await addToCart(firstVariant.shopifyId, 1);
		console.log('Product added to cart:', product.translations?.title || product.title);
	} catch (err) {
		console.error('Error adding to cart:', err);
	}
};

onMounted(async () => {
	await loadShopData();
	await loadProducts('all');
});
</script>
