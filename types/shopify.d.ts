// Types pour l'API Shopify Storefront

export interface ShopifyImage {
  id: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyPriceRange {
  minVariantPrice: ShopifyMoney;
  maxVariantPrice: ShopifyMoney;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  sku?: string;
  price: ShopifyMoney;
  compareAtPrice?: ShopifyMoney;
  availableForSale: boolean;
  quantityAvailable?: number;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  vendor?: string;
  productType?: string;
  tags: string[];
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  variants: {
    edges: Array<{
      node: ShopifyProductVariant;
    }>;
  };
  priceRange: ShopifyPriceRange;
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: ShopifyImage;
  productsCount: number;
  products?: {
    pageInfo: ShopifyPageInfo;
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}

export interface ShopifyShop {
  name: string;
  description?: string;
  primaryDomain: {
    url: string;
    host: string;
  };
  currencyCode: string;
  moneyFormat: string;
  shipsToCountries: string[];
}

export interface ShopifyPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  cost: {
    subtotalAmount: ShopifyMoney;
  };
  merchandise: {
    id: string;
    title: string;
    sku?: string;
    price: ShopifyMoney;
    product: {
      id: string;
      title: string;
      handle: string;
      images: {
        edges: Array<{
          node: ShopifyImage;
        }>;
      };
    };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyMoney;
    totalAmount: ShopifyMoney;
    totalTaxAmount: ShopifyMoney;
  };
  lines: {
    edges: Array<{
      node: ShopifyCartLine;
    }>;
  };
}

// Types pour les réponses API
export interface ShopifyProductsResponse {
  products: {
    pageInfo: ShopifyPageInfo;
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}

export interface ShopifyProductResponse {
  product: ShopifyProduct;
}

export interface ShopifyCollectionsResponse {
  collections: {
    pageInfo: ShopifyPageInfo;
    edges: Array<{
      node: ShopifyCollection;
    }>;
  };
}

export interface ShopifyCollectionResponse {
  collection: ShopifyCollection;
}

export interface ShopifyShopResponse {
  shop: ShopifyShop;
}

export interface ShopifyCartResponse {
  cart: ShopifyCart;
}

export interface ShopifyCartCreateResponse {
  cartCreate: {
    cart: ShopifyCart;
    userErrors: Array<{
      field: string[];
      message: string;
    }>;
  };
}

export interface ShopifyCartLinesAddResponse {
  cartLinesAdd: {
    cart: ShopifyCart;
    userErrors: Array<{
      field: string[];
      message: string;
    }>;
  };
}

export interface ShopifyCartLinesUpdateResponse {
  cartLinesUpdate: {
    cart: ShopifyCart;
    userErrors: Array<{
      field: string[];
      message: string;
    }>;
  };
}

export interface ShopifyCartLinesRemoveResponse {
  cartLinesRemove: {
    cart: ShopifyCart;
    userErrors: Array<{
      field: string[];
      message: string;
    }>;
  };
} 