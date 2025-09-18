<template>
	<div class="products-page">
		<div class="container">
			<header class="products-page__header">
				<h1 class="products-page__title">Our Products</h1>
			</header>

			<div v-if="loading" class="products-page__loading">
				<div class="loading-spinner"></div>
				<p>Loading products...</p>
			</div>

			<div v-else-if="error" class="products-page__error">
				<p>{{ error }}</p>
				<button @click="loadProducts" class="btn btn--primary">Try Again</button>
			</div>

			<div v-else class="products-page__content">
				<div v-if="products.length > 0" class="products-grid">
					<ProductCard v-for="product in products" :key="product._id" :product="product" />
				</div>
				<div v-else class="products-page__empty">
					<p>No products found.</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSanityProducts } from '@/composables/useSanityProducts';

// Meta tags pour le SEO
useHead({
	title: 'Products - Sanity Store',
	meta: [{ name: 'description', content: 'Browse our collection of products' }],
});

const products = ref([]);
const loading = ref(false);
const error = ref(null);

const loadProducts = async () => {
	loading.value = true;
	error.value = null;
	try {
		products.value = await useSanityProducts();
		console.log(products.value);
	} catch (err) {
		error.value = err.message;
	} finally {
		loading.value = false;
	}
};

onMounted(loadProducts);
</script>

<style lang="scss" scoped>
.products-page {
	padding: 40px 0;
	min-height: 100vh;
	background: #f8f9fa;

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
	}

	&__header {
		text-align: center;
		margin-bottom: 40px;
	}

	&__title {
		font-size: 2.5rem;
		font-weight: 700;
		color: #333;
		margin: 0 0 16px 0;
	}

	&__subtitle {
		font-size: 1.1rem;
		color: #666;
		margin: 0;
		max-width: 600px;
		margin: 0 auto;
	}

	&__loading,
	&__error,
	&__empty {
		text-align: center;
		padding: 60px 20px;
	}

	&__loading {
		.loading-spinner {
			width: 40px;
			height: 40px;
			border: 4px solid #f3f3f3;
			border-top: 4px solid #007bff;
			border-radius: 50%;
			animation: spin 1s linear infinite;
			margin: 0 auto 20px;
		}
	}

	&__error {
		p {
			color: #dc3545;
			margin-bottom: 20px;
		}
	}

	&__empty {
		p {
			color: #666;
			font-size: 1.1rem;
		}
	}

	&__content {
		.products-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
			gap: 24px;
			margin-bottom: 40px;
		}
	}

	&__pagination {
		text-align: center;

		.btn {
			padding: 12px 24px;
			font-size: 16px;
		}
	}
}

.btn {
	padding: 10px 20px;
	border: none;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;

	&--primary {
		background: #007bff;
		color: white;

		&:hover:not(:disabled) {
			background: #0056b3;
		}

		&:disabled {
			background: #ccc;
			cursor: not-allowed;
		}
	}

	&--secondary {
		background: #6c757d;
		color: white;

		&:hover:not(:disabled) {
			background: #545b62;
		}

		&:disabled {
			background: #ccc;
			cursor: not-allowed;
		}
	}
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

// Responsive
@media (max-width: 768px) {
	.products-page {
		padding: 20px 0;

		&__title {
			font-size: 2rem;
		}

		&__content .products-grid {
			grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
			gap: 16px;
		}
	}
}
</style>
