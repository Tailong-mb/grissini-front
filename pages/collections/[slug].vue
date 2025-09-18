<template>
	<div class="collection-detail-page">
		<div class="container">
			<NuxtLink to="/">← Retour aux collections</NuxtLink>
			<div v-if="loading" class="collection-detail__loading">
				<div class="loading-spinner"></div>
				<p>Chargement de la collection...</p>
			</div>
			<div v-else-if="error" class="collection-detail__error">
				<p>{{ error }}</p>
				<button @click="loadCollection" class="btn btn--primary">Réessayer</button>
			</div>
			<div v-else-if="collection" class="collection-detail">
				<h1>{{ collection.title }}</h1>
				<img v-if="collection.imageUrl" :src="collection.imageUrl" :alt="collection.title" class="collection-detail__image" />
				<p v-if="collection.descriptionHtml">{{ collection.descriptionHtml }}</p>
				<h2>Produits</h2>
				<div v-if="products.length > 0" class="products-grid">
					<ProductCard v-for="product in products" :key="product._id" :product="product" />
				</div>
				<div v-else>
					<p>Aucun produit dans cette collection.</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSanityCollections } from '@/composables/useSanityCollections';
import { useSanityProductsByCollection } from '@/composables/useSanityProductsByCollection';
import ProductCard from '@/components/ProductCard.vue';

const route = useRoute();
const collection = ref(null);
const products = ref([]);
const loading = ref(false);
const error = ref(null);

const loadCollection = async () => {
	loading.value = true;
	error.value = null;
	try {
		const collections = await useSanityCollections();
		collection.value = collections.find((c) => c.slug === route.params.slug);
		if (collection.value) {
			products.value = await useSanityProductsByCollection(collection.value.collectionId);
		} else {
			products.value = [];
		}
	} catch (err) {
		error.value = err.message;
	} finally {
		loading.value = false;
	}
};

onMounted(loadCollection);
</script>

<style scoped>
.products-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 2rem;
}
.collection-detail__image {
	width: 100%;
	max-width: 600px;
	margin-bottom: 2rem;
	border-radius: 8px;
}
</style>
