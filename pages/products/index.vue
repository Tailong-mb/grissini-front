<template>
	<div class="products-page"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSanityProducts } from '@/composables/useSanityProducts';

useHead({
	title: 'Products - Sanity Store',
	meta: [{ name: 'description', content: 'Browse our collection of products' }],
});

const products = ref([]);
const loading = ref(false);
const error = ref(null);

onMounted(async () => {
	await loadProducts();
});

const loadProducts = async () => {
	loading.value = true;
	error.value = null;
	try {
		products.value = await useSanityProducts();
	} catch (err) {
		error.value = err.message;
	} finally {
		loading.value = false;
	}
};
</script>

<style lang="scss" scoped></style>
