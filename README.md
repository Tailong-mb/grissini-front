# Grissini — front

Nuxt 3 (SPA) + Sanity + Shopify Storefront.

```bash
npm install
npm run dev     # http://localhost:3000 (seule origine localhost autorisée dans les CORS Sanity)
npm run build   # ne pas lancer pendant que `dev` tourne (dossier .nuxt partagé)
```

## Variables d'environnement (`.env`)

| Variable | Rôle |
|---|---|
| `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, `SHOPIFY_STOREFRONT_API_VERSION` | Shop / panier |
| `MAILCHIMP_API_KEY`, `MAILCHIMP_AUDIENCE_ID` | Newsletter (`/api/newsletter`) |
| `NOTION_API_TOKEN`, `NOTION_CONCERTS_DATABASE_ID` | Page lives (`/api/concerts`) |
| `NUXT_PUBLIC_GTM_ID` | Google Tag Manager |
| `NUXT_PUBLIC_SHOP_ONLY` | `true` : seuls `/products`, `/cgv`, `/mentions-legales` sont accessibles |
| `NUXT_PUBLIC_SITE_URL` | URL de prod (canonical, hreflang, sitemap). Défaut : `https://grissinimusic.com` |
