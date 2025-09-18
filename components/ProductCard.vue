<template>
	<div class="product-card">
		<div class="product-card__image">
			<img v-if="product.previewImageUrl" :src="product.previewImageUrl" :alt="product.title" loading="lazy" />
			<div v-else class="product-card__placeholder">
				<span>No image</span>
			</div>
		</div>

		<div class="product-card__content">
			<h3 class="product-card__title">
				<NuxtLink :to="`/products/${product.slug}`">
					{{ product.title }}
				</NuxtLink>
			</h3>

			<p v-if="product.descriptionHtml" class="product-card__description">
				{{ truncateDescription(product.descriptionHtml) }}
			</p>

			<div class="product-card__price">
				<span v-if="product.priceRange?.minVariantPrice">
					{{ formatPrice(product.priceRange.minVariantPrice, 'EUR') }}
				</span>
				<span v-if="product.priceRange?.maxVariantPrice && product.priceRange.minVariantPrice !== product.priceRange.maxVariantPrice"> - {{ formatPrice(product.priceRange.maxVariantPrice, 'EUR') }} </span>
			</div>
			<div class="product-card__actions">
				<NuxtLink class="btn btn--primary" :to="`/products/${product.slug}`"> Voir le produit </NuxtLink>
			</div>
		</div>
	</div>
</template>

<script setup>
import { formatPrice } from '~/utils/shopify';

const props = defineProps({
	product: {
		type: Object,
		required: true,
	},
});

const truncateDescription = (description, maxLength = 100) => {
	if (!description) return '';
	if (description.length <= maxLength) return description;
	return description.substring(0, maxLength) + '...';
};
</script>

<style lang="scss" scoped>
.product-card {
	border: 1px solid #e5e5e5;
	border-radius: 8px;
	overflow: hidden;
	transition: all 0.3s ease;
	background: white;

	&:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		transform: translateY(-2px);
	}

	&__image {
		position: relative;
		aspect-ratio: 1;
		overflow: hidden;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			transition: transform 0.3s ease;
		}

		&:hover img {
			transform: scale(1.05);
		}
	}

	&__placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f5f5f5;
		color: #999;
		font-size: 14px;
	}

	&__content {
		padding: 16px;
	}

	&__title {
		margin: 0 0 8px 0;
		font-size: 16px;
		font-weight: 600;

		a {
			color: inherit;
			text-decoration: none;

			&:hover {
				color: #007bff;
			}
		}
	}

	&__description {
		margin: 0 0 12px 0;
		font-size: 14px;
		color: #666;
		line-height: 1.4;
	}

	&__price {
		margin-bottom: 16px;

		.price {
			font-size: 18px;
			font-weight: 700;
			color: #333;
		}

		.price-range {
			font-size: 16px;
			color: #666;
			margin-left: 4px;
		}
	}

	&__actions {
		.btn {
			width: 100%;
			padding: 12px 16px;
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
		}
	}
}
</style>
