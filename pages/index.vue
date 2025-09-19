<template>
	<div class="collections-page">
		<div class="container">
			<div class="page-header">
				<h1 v-if="homeData?.title">{{ getLocalizedTitle(homeData.title) }}</h1>
				<h1 v-else>Nos collections</h1>
				<LanguageSwitcher />
			</div>
			<div v-if="loading" class="collections-page__loading">
				<div class="loading-spinner"></div>
				<p>Chargement des collections...</p>
			</div>
			<div v-else-if="error" class="collections-page__error">
				<p>{{ error }}</p>
				<button @click="loadCollections" class="btn btn--primary">Réessayer</button>
			</div>
			<div v-else class="collections-list">
				<div v-if="collections.length > 0" class="collections-grid">
					<div v-for="collection in collections" :key="collection._id" class="collection-card">
						<NuxtLink :to="`/collections/${collection.slug}`">
							<img v-if="collection.imageUrl" :src="collection.imageUrl" :alt="collection.title" class="collection-card__image" />
							<div class="collection-card__content">
								<h2>{{ collection.title }}</h2>
								<p v-if="collection.descriptionHtml">{{ truncateDescription(collection.descriptionHtml) }}</p>
							</div>
						</NuxtLink>
					</div>
				</div>
				<div v-else>
					<p>Aucune collection trouvée.</p>
				</div>
			</div>
		</div>
		<!-- Section produits -->
		<div class="products-section">
			<h1>Nos produits</h1>
			<div v-if="loadingProducts" class="products-section__loading">
				<div class="loading-spinner"></div>
				<p>Chargement des produits...</p>
			</div>
			<div v-else-if="errorProducts" class="products-section__error">
				<p>{{ errorProducts }}</p>
				<button @click="loadProducts" class="btn btn--primary">Réessayer</button>
			</div>
			<div v-else class="products-grid">
				<ProductCard v-for="product in products" :key="product._id" :product="product" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSanityCollections } from '@/composables/useSanityCollections';
import { useSanityProducts } from '@/composables/useSanityProducts';
import { useSanityHome } from '@/composables/useSanityHome';
import ProductCard from '@/components/ProductCard.vue';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const collections = ref([]);
const loading = ref(false);
const error = ref(null);

const products = ref([]);
const loadingProducts = ref(false);
const errorProducts = ref(null);

const homeData = ref(null);
const loadingHome = ref(false);
const errorHome = ref(null);

const loadCollections = async () => {
	loading.value = true;
	error.value = null;
	try {
		collections.value = await useSanityCollections();
	} catch (err) {
		error.value = err.message;
	} finally {
		loading.value = false;
	}
};

const loadProducts = async () => {
	loadingProducts.value = true;
	errorProducts.value = null;
	try {
		products.value = await useSanityProducts();
	} catch (err) {
		errorProducts.value = err.message;
	} finally {
		loadingProducts.value = false;
	}
};

const loadHomeData = async () => {
	loadingHome.value = true;
	errorHome.value = null;
	try {
		homeData.value = await useSanityHome();
	} catch (err) {
		errorHome.value = err.message;
	} finally {
		loadingHome.value = false;
	}
};

const getLocalizedTitle = (titleObject) => {
	if (!titleObject) return '';

	return titleObject[locale.value] || titleObject.fr || titleObject.en || '';
};

const truncateDescription = (description, maxLength = 100) => {
	if (!description) return '';
	if (description.length <= maxLength) return description;
	return description.substring(0, maxLength) + '...';
};

onMounted(() => {
	loadHomeData();
	loadCollections();
	loadProducts();
});
</script>

<style scoped>
.page-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
}

.collections-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 2rem;
}
.collection-card {
	border: 1px solid #e5e5e5;
	border-radius: 8px;
	overflow: hidden;
	background: white;
	width: 300px;
	transition: box-shadow 0.2s;
}
.collection-card:hover {
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.collection-card__image {
	width: 100%;
	height: 180px;
	object-fit: cover;
}
.collection-card__content {
	padding: 1rem;
}
.products-section {
	margin-top: 3rem;
}
.products-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 2rem;
}
.products-section__loading,
.products-section__error {
	margin: 2rem 0;
	text-align: center;
}
</style>
