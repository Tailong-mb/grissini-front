<template>
	<div class="product-detail-page"></div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { formatPrice } from '~/utils/shopify';

const route = useRoute();
const { getProductByHandle } = useShopify();
const { addToCart, loading: cartLoading } = useCart();

const product = ref(null);
const selectedVariant = ref(null);
const selectedImage = ref(null);
const quantity = ref(1);
const loading = ref(false);
const error = ref(null);

useHead(() => ({
	title: product.value ? `${product.value.title} - Shopify Store` : 'Product - Shopify Store',
	meta: [
		{
			name: 'description',
			content: product.value?.description || 'Product details',
		},
	],
}));

const loadProduct = async () => {
	loading.value = true;
	error.value = null;

	try {
		const productData = await getProductByHandle(route.params.handle);
		product.value = productData;

		// Sélectionner la première variante et image par défaut
		if (productData.variants?.edges?.length > 0) {
			selectedVariant.value = productData.variants.edges[0].node;
		}

		if (productData.images?.edges?.length > 0) {
			selectedImage.value = productData.images.edges[0].node;
		}
	} catch (err) {
		error.value = err.message;
	} finally {
		loading.value = false;
	}
};

const handleAddToCart = async () => {
	if (!selectedVariant.value?.availableForSale) return;

	try {
		await addToCart(selectedVariant.value.id, quantity.value);
	} catch (err) {
		console.error('Error adding to cart:', err);
	}
};

onMounted(() => {
	loadProduct();
});
</script>

<style lang="scss"></style>
