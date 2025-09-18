import { getShopifyClient, validateShopifyConfig, cleanShopifyData } from '~/utils/shopify';

// Queries GraphQL pour Shopify
const QUERIES = {
  // Récupérer tous les produits
  GET_PRODUCTS: `
    query GetProducts($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            id
            title
            handle
            description
            createdAt
            updatedAt
            publishedAt
            vendor
            productType
            tags
            images(first: 10) {
              edges {
                node {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  sku
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  availableForSale
                  quantityAvailable
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `,

  // Récupérer un produit par handle
  GET_PRODUCT_BY_HANDLE: `
    query GetProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        createdAt
        updatedAt
        publishedAt
        vendor
        productType
        tags
        images(first: 10) {
          edges {
            node {
              id
              url
              altText
              width
              height
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              sku
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              availableForSale
              quantityAvailable
              selectedOptions {
                name
                value
              }
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  `,

  // Récupérer toutes les collections
  GET_COLLECTIONS: `
    query GetCollections($first: Int!, $after: String) {
      collections(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            id
            title
            handle
            description
            image {
              id
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  `,

  // Récupérer une collection par handle
  GET_COLLECTION_BY_HANDLE: `
    query GetCollectionByHandle($handle: String!, $first: Int!, $after: String) {
      collection(handle: $handle) {
        id
        title
        handle
        description
        image {
          id
          url
          altText
          width
          height
        }
        products(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          edges {
            node {
              id
              title
              handle
              description
              images(first: 1) {
                edges {
                  node {
                    id
                    url
                    altText
                    width
                    height
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  `,

  // Récupérer les informations de la boutique
  GET_SHOP_INFO: `
    query GetShopInfo {
      shop {
        name
        description
        primaryDomain {
          url
          host
        }
      }
    }
  `
};

export const useShopify = () => {
  // Validation de la configuration au démarrage
  try {
    validateShopifyConfig();
  } catch (error) {
    console.error('Shopify configuration error:', error.message);
  }

  // Récupérer tous les produits
  const getProducts = async (first = 20, after = null) => {
    try {
      const shopifyClient = getShopifyClient();
      const variables = { first, after };
      const data = await shopifyClient.request(QUERIES.GET_PRODUCTS, variables);
      return cleanShopifyData(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };

  // Récupérer un produit par handle
  const getProductByHandle = async (handle) => {
    try {
      const shopifyClient = getShopifyClient();
      const variables = { handle };
      const data = await shopifyClient.request(QUERIES.GET_PRODUCT_BY_HANDLE, variables);
      return cleanShopifyData(data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  };

  // Récupérer toutes les collections
  const getCollections = async (first = 20, after = null) => {
    try {
      const shopifyClient = getShopifyClient();
      const variables = { first, after };
      const data = await shopifyClient.request(QUERIES.GET_COLLECTIONS, variables);
      return cleanShopifyData(data.collections);
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  };

  // Récupérer une collection par handle
  const getCollectionByHandle = async (handle, first = 20, after = null) => {
    try {
      const shopifyClient = getShopifyClient();
      const variables = { handle, first, after };
      const data = await shopifyClient.request(QUERIES.GET_COLLECTION_BY_HANDLE, variables);
      return cleanShopifyData(data.collection);
    } catch (error) {
      console.error('Error fetching collection:', error);
      throw error;
    }
  };

  // Récupérer les informations de la boutique
  const getShopInfo = async () => {
    try {
      const shopifyClient = getShopifyClient();
      const data = await shopifyClient.request(QUERIES.GET_SHOP_INFO);
      return cleanShopifyData(data.shop);
    } catch (error) {
      console.error('Error fetching shop info:', error);
      throw error;
    }
  };

  return {
    getProducts,
    getProductByHandle,
    getCollections,
    getCollectionByHandle,
    getShopInfo,
  };
}; 