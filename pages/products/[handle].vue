<template>
	<div>
		<h1>Product Detail Page</h1>
		<p>Check console for data logs</p>

		<div v-if="loading">Loading product...</div>
		<div v-else-if="error">Error: {{ error }}</div>
		<div v-else-if="product">
			<h2>{{ product.translations?.title || product.title }}</h2>
			<p><strong>Description:</strong> {{ product.translations?.description || 'No description' }}</p>
			<p><strong>Price:</strong> {{ product.priceRange?.minVariantPrice }} - {{ product.priceRange?.maxVariantPrice }}</p>
			<p><strong>Images:</strong> {{ product.images?.length || 0 }}</p>
			<p><strong>Variants:</strong> {{ product.variants?.length || 0 }}</p>
			<p><strong>Product Type:</strong> {{ product.productType || 'No type' }}</p>
			<p><strong>Vendor:</strong> {{ product.vendor || 'No vendor' }}</p>

			<!-- Variants selection -->
			<div v-if="product.variants?.length > 1">
				<h3>Select Variant:</h3>
				<select v-model="selectedVariant" style="padding: 10px; margin: 10px 0">
					<option v-for="variant in product.variants" :key="variant._id" :value="variant">{{ variant.title }} - {{ variant.price }}</option>
				</select>
			</div>

			<!-- Quantity -->
			<div>
				<label>Quantity:</label>
				<input v-model="quantity" type="number" min="1" style="padding: 5px; margin: 10px" />
			</div>

			<!-- Add to Cart Button -->
			<button @click="handleAddToCart" :disabled="!selectedVariant || cartLoading" style="background: #007bff; color: white; padding: 15px 30px; border: none; cursor: pointer; margin-top: 20px; font-size: 16px">
				{{ cartLoading ? 'Adding...' : product.translations?.addToCartText || 'Add to Cart' }}
			</button>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSanityProductWithTranslations } from '@/composables/useSanityProductsWithTranslations';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const { locale } = useI18n();
const { addToCart, loading: cartLoading } = useCart();

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
		product.value = productData;

		// Sélectionner la première variante par défaut
		if (productData.variants?.length > 0) {
			selectedVariant.value = productData.variants[0];
		}

		console.log('=== PRODUCT DETAIL PAGE DATA ===');
		console.log('Handle:', handle);
		console.log('Locale:', locale.value);
		console.log('Product Data:', productData);
		console.log('================================');
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
		console.log('Product added to cart:', product.value.translations?.title || product.value.title);
	} catch (err) {
		console.error('Error adding to cart:', err);
	}
};

onMounted(() => {
	loadProduct();
});
</script>
