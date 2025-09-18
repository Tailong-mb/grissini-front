<template>
  <div class="product-detail-page">
    <div class="container">
      <div v-if="loading" class="product-detail-page__loading">
        <div class="loading-spinner"></div>
        <p>Loading product...</p>
      </div>

      <div v-else-if="error" class="product-detail-page__error">
        <p>{{ error }}</p>
        <NuxtLink to="/products" class="btn btn--primary">Back to Products</NuxtLink>
      </div>

      <div v-else-if="product" class="product-detail">
        <!-- Breadcrumb -->
        <nav class="breadcrumb">
          <NuxtLink to="/" class="breadcrumb__link">Home</NuxtLink>
          <span class="breadcrumb__separator">/</span>
          <NuxtLink to="/products" class="breadcrumb__link">Products</NuxtLink>
          <span class="breadcrumb__separator">/</span>
          <span class="breadcrumb__current">{{ product.title }}</span>
        </nav>

        <div class="product-detail__content">
          <!-- Images -->
          <div class="product-detail__images">
            <div class="product-detail__main-image">
              <img 
                v-if="selectedImage && selectedImage.url"
                :src="selectedImage.url" 
                :alt="selectedImage.altText || product.title"
                loading="lazy"
              />
              <div v-else class="product-detail__placeholder">
                <span>No image</span>
              </div>
            </div>
            
            <div v-if="product.images?.edges?.length > 1" class="product-detail__thumbnails">
              <button
                v-for="(edge, index) in product.images.edges"
                :key="edge.node.id"
                @click="selectedImage = edge.node"
                :class="['thumbnail', { 'thumbnail--active': selectedImage?.id === edge.node.id }]"
              >
                <img 
                  :src="edge.node.url" 
                  :alt="edge.node.altText || product.title"
                  loading="lazy"
                />
              </button>
            </div>
          </div>

          <!-- Product Info -->
          <div class="product-detail__info">
            <h1 class="product-detail__title">{{ product.title }}</h1>
            
            <div v-if="product.vendor" class="product-detail__vendor">
              By {{ product.vendor }}
            </div>

            <div class="product-detail__price">
              <span v-if="selectedVariant?.price" class="price">
                {{ formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode) }}
              </span>
              <span v-if="selectedVariant?.compareAtPrice && selectedVariant.compareAtPrice.amount !== selectedVariant.price.amount" class="compare-price">
                {{ formatPrice(selectedVariant.compareAtPrice.amount, selectedVariant.compareAtPrice.currencyCode) }}
              </span>
            </div>

            <div v-if="product.description" class="product-detail__description">
              <h3>Description</h3>
              <p>{{ product.description }}</p>
            </div>

            <!-- Variants -->
            <div v-if="product.variants?.edges?.length > 1" class="product-detail__variants">
              <h3>Options</h3>
              <div class="variants-grid">
                <button
                  v-for="edge in product.variants.edges"
                  :key="edge.node.id"
                  @click="selectedVariant = edge.node"
                  :class="['variant-btn', { 
                    'variant-btn--active': selectedVariant?.id === edge.node.id,
                    'variant-btn--unavailable': !edge.node.availableForSale
                  }]"
                  :disabled="!edge.node.availableForSale"
                >
                  {{ edge.node.title }}
                </button>
              </div>
            </div>

            <!-- Add to Cart -->
            <div class="product-detail__actions">
              <div class="quantity-selector">
                <label for="quantity">Quantity:</label>
                <select v-model="quantity" id="quantity" class="quantity-select">
                  <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                </select>
              </div>

              <button 
                @click="handleAddToCart"
                :disabled="cartLoading || !selectedVariant?.availableForSale"
                class="btn btn--primary btn--large"
              >
                <span v-if="cartLoading">Adding...</span>
                <span v-else-if="!selectedVariant?.availableForSale">Out of Stock</span>
                <span v-else>Add to Cart</span>
              </button>
            </div>

            <!-- Product Meta -->
            <div class="product-detail__meta">
              <div v-if="product.productType" class="meta-item">
                <strong>Type:</strong> {{ product.productType }}
              </div>
              <div v-if="product.tags?.length > 0" class="meta-item">
                <strong>Tags:</strong> 
                <span v-for="tag in product.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { formatPrice } from '~/utils/shopify';

const route = useRoute();
const { getProductByHandle } = useShopify();
const { addToCart, loading: cartLoading } = useCart();

// État réactif
const product = ref(null);
const selectedVariant = ref(null);
const selectedImage = ref(null);
const quantity = ref(1);
const loading = ref(false);
const error = ref(null);

// Meta tags dynamiques
useHead(() => ({
  title: product.value ? `${product.value.title} - Shopify Store` : 'Product - Shopify Store',
  meta: [
    { 
      name: 'description', 
      content: product.value?.description || 'Product details' 
    }
  ]
}));

// Charger le produit
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

// Ajouter au panier
const handleAddToCart = async () => {
  if (!selectedVariant.value?.availableForSale) return;
  
  try {
    await addToCart(selectedVariant.value.id, quantity.value);
  } catch (err) {
    console.error('Error adding to cart:', err);
  }
};

// Charger les données au montage du composant
onMounted(() => {
  loadProduct();
});
</script>

<style lang="scss" scoped>
.product-detail-page {
  padding: 40px 0;
  min-height: 100vh;
  background: #f8f9fa;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  &__loading,
  &__error {
    text-align: center;
    padding: 60px 20px;
    
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
}

.breadcrumb {
  margin-bottom: 30px;
  font-size: 14px;
  
  &__link {
    color: #007bff;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  &__separator {
    margin: 0 8px;
    color: #666;
  }
  
  &__current {
    color: #333;
    font-weight: 600;
  }
}

.product-detail {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  &__content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: start;
  }
  
  &__images {
    .product-detail__main-image {
      aspect-ratio: 1;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 20px;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .product-detail__placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      color: #999;
      font-size: 16px;
    }
  }
  
  &__thumbnails {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    
    .thumbnail {
      width: 80px;
      height: 80px;
      border: 2px solid transparent;
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      &:hover {
        border-color: #007bff;
      }
      
      &--active {
        border-color: #007bff;
      }
    }
  }
  
  &__info {
    .product-detail__title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #333;
      margin: 0 0 12px 0;
    }
    
    .product-detail__vendor {
      font-size: 1.1rem;
      color: #666;
      margin-bottom: 20px;
    }
    
    .product-detail__price {
      margin-bottom: 30px;
      
      .price {
        font-size: 2rem;
        font-weight: 700;
        color: #333;
      }
      
      .compare-price {
        font-size: 1.5rem;
        color: #999;
        text-decoration: line-through;
        margin-left: 12px;
      }
    }
    
    .product-detail__description {
      margin-bottom: 30px;
      
      h3 {
        font-size: 1.2rem;
        font-weight: 600;
        margin: 0 0 12px 0;
        color: #333;
      }
      
      p {
        line-height: 1.6;
        color: #666;
        margin: 0;
      }
    }
    
    .product-detail__variants {
      margin-bottom: 30px;
      
      h3 {
        font-size: 1.2rem;
        font-weight: 600;
        margin: 0 0 16px 0;
        color: #333;
      }
      
      .variants-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        
        .variant-btn {
          padding: 10px 16px;
          border: 2px solid #e5e5e5;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          
          &:hover:not(:disabled) {
            border-color: #007bff;
          }
          
          &--active {
            border-color: #007bff;
            background: #007bff;
            color: white;
          }
          
          &--unavailable {
            opacity: 0.5;
            cursor: not-allowed;
          }
        }
      }
    }
    
    .product-detail__actions {
      margin-bottom: 30px;
      
      .quantity-selector {
        margin-bottom: 20px;
        
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
        }
        
        .quantity-select {
          padding: 10px;
          border: 2px solid #e5e5e5;
          border-radius: 6px;
          font-size: 16px;
          min-width: 100px;
        }
      }
      
      .btn--large {
        width: 100%;
        padding: 16px 24px;
        font-size: 18px;
      }
    }
    
    .product-detail__meta {
      border-top: 1px solid #e5e5e5;
      padding-top: 20px;
      
      .meta-item {
        margin-bottom: 12px;
        font-size: 14px;
        
        strong {
          color: #333;
        }
        
        .tag {
          display: inline-block;
          background: #f0f0f0;
          padding: 4px 8px;
          border-radius: 4px;
          margin: 0 4px 4px 0;
          font-size: 12px;
        }
      }
    }
  }
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// Responsive
@media (max-width: 768px) {
  .product-detail {
    padding: 20px;
    
    &__content {
      grid-template-columns: 1fr;
      gap: 30px;
    }
    
    &__info .product-detail__title {
      font-size: 2rem;
    }
  }
}
</style> 