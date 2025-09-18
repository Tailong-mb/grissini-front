import { GraphQLClient } from 'graphql-request';

// Factory pour obtenir le client Shopify avec la config à jour
export function getShopifyClient() {
  const config = useRuntimeConfig();
  const SHOPIFY_STORE_DOMAIN = config.public.SHOPIFY_STORE_DOMAIN;
  const SHOPIFY_STOREFRONT_ACCESS_TOKEN = config.public.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const SHOPIFY_STOREFRONT_API_VERSION = config.public.SHOPIFY_STOREFRONT_API_VERSION || '2024-01';

  const SHOPIFY_GRAPHQL_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_STOREFRONT_API_VERSION}/graphql.json`;

  return new GraphQLClient(SHOPIFY_GRAPHQL_URL, {
    headers: {
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
  });
}

// Validation de la configuration
export function validateShopifyConfig() {
  const config = useRuntimeConfig();
  if (!config.public.SHOPIFY_STORE_DOMAIN) {
    throw new Error('SHOPIFY_STORE_DOMAIN is required');
  }
  if (!config.public.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    throw new Error('SHOPIFY_STOREFRONT_ACCESS_TOKEN is required');
  }
}

// Fonction utilitaire pour formater les prix
export function formatPrice(amount, currencyCode = 'EUR') {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}

// Fonction utilitaire pour formater les dates
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Fonction pour nettoyer les données de l'API Shopify
export function cleanShopifyData(data) {
  if (!data) return null;
  
  // Supprimer les propriétés __typename de GraphQL
  const clean = JSON.parse(JSON.stringify(data));
  return clean;
} 