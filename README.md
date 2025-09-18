# Nuxt 3 + Shopify Headless Setup

Un setup complet pour créer des applications e-commerce modernes avec Nuxt 3 et Shopify Headless.

## 🚀 Fonctionnalités

- ✅ **Intégration Shopify Storefront API** - API GraphQL complète
- ✅ **Gestion du panier** - Ajout, suppression, mise à jour des quantités
- ✅ **Pages produits** - Liste et détail des produits
- ✅ **Collections** - Navigation par catégories
- ✅ **Interface moderne** - Design responsive et animations
- ✅ **SEO optimisé** - Meta tags dynamiques
- ✅ **Performance** - Lazy loading, optimisations
- ✅ **TypeScript** - Support complet
- ✅ **i18n** - Internationalisation prête

## 📋 Prérequis

- Node.js 18+
- Compte Shopify (gratuit ou payant)
- Accès à l'API Storefront

## 🛠️ Installation

1. **Installer les dépendances**

```bash
npm install
```

2. **Installer les dépendances**

```bash
npm install
```

1. **Configurer les variables d'environnement**

```bash
cp env.example .env
```

1. **Remplir les variables Shopify dans `.env`**

```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
SHOPIFY_STOREFRONT_API_VERSION=2024-01
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🔧 Configuration Shopify

### 1. Créer un Storefront Access Token

1. Connectez-vous à votre admin Shopify
2. Allez dans **Settings > Apps and sales channels**
3. Cliquez sur **Develop apps**
4. Créez une nouvelle app ou utilisez une existante
5. Dans **Configuration > Storefront API**, activez les permissions :
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_product_tags`
   - `unauthenticated_read_selling_plans`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_write_customers`
   - `unauthenticated_read_customer_tags`
   - `unauthenticated_write_customer_tags`

6. Copiez le **Storefront access token**

### 2. Configurer les produits

Assurez-vous que vos produits dans Shopify ont :

- Des images
- Des descriptions
- Des variantes (si nécessaire)
- Des collections

## 🚀 Démarrage

```bash
# Mode développement
npm run dev

# Build pour production
npm run build

# Preview de la production
npm run preview
```

## 📁 Structure du projet

```
├── components/           # Composants Vue
│   ├── ProductCard.vue   # Carte produit
│   ├── CartIcon.vue      # Icône panier
│   └── Lang.vue          # Sélecteur de langue
├── composables/          # Composables Nuxt
│   ├── useShopify.js     # API Shopify
│   ├── useCart.js        # Gestion du panier
│   └── transition-composable.js
├── pages/                # Pages de l'application
│   ├── index.vue         # Page d'accueil
│   └── products/         # Pages produits
│       ├── index.vue     # Liste des produits
│       └── [handle].vue  # Détail produit
├── utils/                # Utilitaires
│   └── shopify.js        # Configuration Shopify
├── assets/               # Assets (SCSS, fonts)
├── locales/              # Fichiers de traduction
└── plugins/              # Plugins Nuxt
```

## 🛍️ Utilisation

### Composables disponibles

#### `useShopify()`

```javascript
const { 
  getProducts, 
  getProductByHandle, 
  getCollections, 
  getCollectionByHandle, 
  getShopInfo 
} = useShopify();

// Récupérer tous les produits
const products = await getProducts(20);

// Récupérer un produit par handle
const product = await getProductByHandle('product-handle');

// Récupérer les collections
const collections = await getCollections(10);
```

#### `useCart()`

```javascript
const { 
  cart, 
  loading, 
  error, 
  addToCart, 
  removeFromCart, 
  updateCartLine, 
  checkout 
} = useCart();

// Ajouter au panier
await addToCart(variantId, quantity);

// Mettre à jour la quantité
await updateCartLine(lineId, newQuantity);

// Supprimer du panier
await removeFromCart(lineId);

// Aller au checkout
checkout();
```

### Composants disponibles

#### `ProductCard`

```vue
<ProductCard :product="product" />
```

#### `CartIcon`

```vue
<CartIcon @toggle="toggleCart" />
```

## 🎨 Personnalisation

### Styles

Les styles sont organisés avec SCSS dans `assets/scss/` :

- `variables.scss` - Variables CSS
- `mixins.scss` - Mixins SCSS
- `reset.scss` - Reset CSS
- `fonts.scss` - Configuration des polices

### Thème

Modifiez les couleurs dans `assets/scss/variables.scss` :

```scss
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  // ...
}
```

### Internationalisation

Ajoutez vos traductions dans `locales/` :

```json
// locales/fr.json
{
  "products": {
    "addToCart": "Ajouter au panier",
    "outOfStock": "Rupture de stock"
  }
}
```

## 🔧 Configuration avancée

### Nuxt Config

Modifiez `nuxt.config.ts` pour :

- Changer le mode SSR/SPA
- Ajouter des modules
- Configurer les plugins

### API Shopify

Personnalisez les requêtes GraphQL dans `composables/useShopify.js`

### Performance

- Images optimisées avec lazy loading
- Pagination des produits
- Cache des requêtes API

## 🚀 Déploiement

### Vercel

1. Connectez votre repo GitHub
2. Configurez les variables d'environnement
3. Déployez automatiquement

### Netlify

1. Connectez votre repo
2. Build command: `npm run build`
3. Publish directory: `.output/public`

### Autres plateformes

Le projet génère des fichiers statiques compatibles avec toutes les plateformes.

## 🔒 Sécurité

- Les tokens Shopify sont sécurisés côté serveur
- Validation des données d'entrée
- Protection CSRF intégrée
- Headers de sécurité automatiques

## 📱 Responsive

Le design est entièrement responsive avec :

- Mobile-first approach
- Breakpoints optimisés
- Touch-friendly interactions

## 🧪 Tests

```bash
# Tests unitaires (à implémenter)
npm run test

# Tests E2E (à implémenter)
npm run test:e2e
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.

## 🆘 Support

- Documentation Shopify: <https://shopify.dev/docs/storefront-api>
- Documentation Nuxt: <https://nuxt.com/docs>
- Issues: Ouvrez une issue sur GitHub

## 🔄 Mises à jour

Pour mettre à jour les dépendances :

```bash
npm update
npm audit fix
```

---

**Note**: Ce setup est optimisé pour les performances et l'expérience utilisateur. Il utilise les meilleures pratiques de Nuxt 3 et de l'API Shopify Storefront.
