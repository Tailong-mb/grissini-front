# Stratégie tracking et consentement – Grissini (Nuxt + Shopify)

Ce document formalise les conclusions des échanges avec Stefan Olsen et les choix techniques pour le projet.

## Contexte

- **Storefront** : Nuxt 3 (`grissini-front`), hébergé sur votre domaine (ex. storefront.example.com).
- **Boutique Shopify (Liquid)** : le thème **Hydrogen Redirect Theme** (`hydrogen-redirect-theme-main`) est publié sur l’Online Store. Il redirige tout le trafic (/, /products, /cart, etc.) vers le storefront Nuxt. Il ne gère pas le paiement.
- **Checkout** : hébergé par Shopify (domaine checkout Shopify). L’utilisateur y arrive depuis Nuxt via le lien « Passer la commande » (`checkoutUrl`). Le script de propagation du consentement et les pixels doivent être configurés côté **Checkout** (paramètres Shopify ou app embed), pas dans le thème Liquid.
- **CMP** : **Cookie Information**, utilisé via **Google Tag Manager (GTM)**.
- **Objectif** : traçabilité fiable du parcours (storefront + checkout) et conformité RGPD/consentement.

### Schéma des surfaces (où tourne quoi)

| Surface | Où ça tourne | Rôle |
|--------|----------------|------|
| **Storefront** | Votre app Nuxt (`grissini-front`) | Catalogue, panier, bouton « Passer la commande » → redirige vers l’URL de checkout Shopify. |
| **Boutique Liquid** | Thème **Hydrogen Redirect** (Online Store) | Redirige tout le trafic (/, /products, etc.) vers le storefront Nuxt. **Ne sert pas au paiement.** |
| **Checkout** | **Shopify** (pages hébergées par Shopify) | Tunnel de paiement (étapes, paiement, remerciement). **Ce n’est pas un thème** : c’est une surface séparée, configurée dans **Paramètres → Checkout**. C’est ici qu’il faut ajouter le script de propagation du consentement et les pixels. |

Donc : le script `shopify-consent-bridge.js` va **sur le checkout** (paramètres ou personnalisation checkout), **pas** dans le thème de redirection.

## Principes retenus

1. **Le consentement doit être partagé avec Shopify**  
   Les pixels et le checkout Shopify doivent respecter les mêmes choix que le bandeau (Cookie Information). Si le consentement n’est pas propagé, risque de non-conformité ou de pixels qui ne se déclenchent pas correctement.

2. **Les domaines storefront et checkout sont différents**  
   Les cookies du storefront (Nuxt) ne sont pas accessibles sur le checkout (Shopify). Il faut donc :
   - soit faire tourner Cookie Information aussi sur Shopify (thème / checkout),
   - soit transmettre le consentement au checkout (ex. paramètres d’URL + script Shopify qui appelle l’API Customer Privacy).

3. **Les achats doivent être trackés côté Shopify**  
   Le checkout étant hébergé par Shopify, les événements **purchase** et étapes de checkout doivent être gérés via **Shopify Customer Events / Pixels** (et éventuellement un pixel personnalisé), pas uniquement depuis le code Nuxt.

## Ce qui est en place dans le projet

### CMP et GTM (storefront Nuxt)

- **Cookie Information** : géré via **GTM** (template « Cookie Information + Consent Mode v2 »).
- Le plugin `plugins/gtm-consent.client.js` :
  - initialise `dataLayer` et **Consent Mode par défaut à "denied"** (avant tout tag),
  - charge le conteneur GTM (`GTM_XXXX`).
- Les tags (GA4, Meta, Google Ads, etc.) sont à configurer **dans GTM** et doivent être déclenchés en fonction du consentement (via le template Cookie Information et les triggers de consentement).

### Événements dataLayer (storefront)

Un composable `useTracking()` pousse les événements suivants pour que GTM (et donc GA4, Meta, etc.) les utilisent :

| Événement        | Moment                          | Où c’est appelé                    |
|------------------|----------------------------------|------------------------------------|
| `page_view`      | Changement de route             | Plugin (hook `page:finish`)        |
| `view_item`      | Affichage d’une fiche produit   | `pages/products/[handle].vue`      |
| `add_to_cart`    | Clic « Add to cart »            | `pages/products/[handle].vue`      |
| `begin_checkout` | Clic « Passer la commande »     | `components/Cart.vue`             |

Aucun tag (GA4, Meta, etc.) n’est codé en dur dans Nuxt : tout passe par **dataLayer + GTM**.

### Propagation du consentement vers Shopify

- Au clic sur « Passer la commande », le consentement actuel (lu depuis le CMP / dataLayer) est ajouté en **paramètres d’URL** du lien de checkout (`consent_analytics`, `consent_marketing`, etc.).
- **Côté Shopify** : un script à installer dans le thème (ou en app embed) lit ces paramètres au chargement du checkout et appelle **Shopify Customer Privacy API** :  
  `Shopify.customerPrivacy.setTrackingConsent({ analytics, marketing, preferences, sale_of_data })`.  
  Voir le fichier `docs/shopify-consent-bridge.js` et les instructions ci-dessous.

### Achats et checkout (Shopify)

- Les événements **checkout** et **purchase** doivent être gérés sur Shopify via **Customer Events / Web Pixels** (ou pixel personnalisé), pas uniquement depuis Nuxt.
- À configurer dans l’admin Shopify (Pixels / Customer Events), avec par exemple :
  - GA4 (ecommerce purchase),
  - Meta Pixel (Purchase),
  - Google Ads (conversions),
  - en respectant le consentement déjà propagé via l’API Customer Privacy.

## Ce que Michael / l’équipe doit fournir ou configurer

1. **Tokens / IDs**
   - **GTM** : ID du conteneur GTM (ex. `GTM-XXXXXX`) → variable d’environnement `NUXT_PUBLIC_GTM_ID`.
   - **Cookie Information** : configuration dans GTM (template « Cookie Information + Consent Mode v2 », triggers, etc.) ; pas d’ID supplémentaire à mettre dans Nuxt si tout passe par GTM.
   - **Signals / consent** : les « consent signals » dont parle Stefan sont gérés par le CMP (Cookie Information) et exposés à GTM ; aucune clé supplémentaire n’est à mettre dans le code pour les « tokens » de consentement.

2. **Shopify – Script de propagation du consentement (sur le checkout, pas dans le thème de redirection)**
   - **Important** : le thème **Hydrogen Redirect** que vous utilisez sert uniquement à rediriger la boutique Liquid vers le storefront Nuxt. Il ne s’affiche **jamais** sur le checkout. Le **checkout** (où se fait le paiement) est une **surface à part**, hébergée par Shopify, et n’est rendue par aucun thème (ni le thème de redirection, ni un autre).
   - Le script `docs/shopify-consent-bridge.js` doit donc être ajouté **sur les pages de checkout**, pas dans le thème de redirection. Il lit les paramètres d’URL `consent_analytics`, `consent_marketing`, etc. (passés depuis Nuxt au clic sur « Passer la commande ») et appelle `Shopify.customerPrivacy.setTrackingConsent(...)`.
   - **Où l’ajouter concrètement** (selon votre abonnement Shopify) :
     - **Shopify Plus** : personnalisation du checkout (fichier `checkout.liquid` ou équivalent) → coller le script dans le `<head>` ou avant `</body>` du checkout.
     - **Autres plans** : **Paramètres → Checkout et comptes** (ou **Checkout**) → section **Scripts supplémentaires** / **Additional scripts** si elle existe encore (certaines options sont en cours de remplacement par les extensions checkout). Si cette option n’existe pas, il faut passer par une **app** qui injecte un script sur le checkout (app embed checkout) ou une **extension checkout** qui exécute cette logique.

3. **Shopify – Pixels / Customer Events**  
   → Voir la section détaillée ci‑dessous : [Configuration des pixels Shopify (Customer Events)](#configuration-des-pixels-shopify-customer-events).

4. **Domaines**
   - Vérifier avec Stefan les domaines exacts du **storefront** (Nuxt) et du **checkout** (Shopify).
   - Si le checkout n’est pas sur le même domaine racine que le storefront, c’est attendu ; la continuité se fait via :
     - paramètres d’URL de consentement,
     - et éventuellement **GA4 cross-domain** (linker) si vous utilisez GA4 sur les deux surfaces.

## Variables d’environnement

À définir (ex. dans `.env`) :

```env
# GTM (obligatoire pour le tracking storefront avec Cookie Information)
NUXT_PUBLIC_GTM_ID=GTM-XXXXXX
```

- Si `NUXT_PUBLIC_GTM_ID` est vide, le script GTM ne se charge pas (pas d’erreur).
- Les clés Shopify existantes (`SHOPIFY_STORE_DOMAIN`, etc.) restent inchangées.

---

## Configuration des pixels Shopify (Customer Events)

Cette section explique **où** et **comment** configurer les pixels (GA4, Meta, Google Ads, etc.) sur le checkout Shopify, et comment s’assurer qu’ils ne s’exécutent qu’**après** que le consentement ait été propagé (conformité RGPD).

### 1. Où configurer les pixels dans Shopify

- Dans l’admin Shopify : **Paramètres (Settings)** → **Customer events** (parfois affiché comme « Pixels et événements clients »).
- Les pixels peuvent être :
  - **App Pixels** : installés via des apps du App Store (ex. app Meta, app Google).
  - **Custom Pixels** : code JavaScript ajouté manuellement pour écouter les événements checkout et envoyer les données à GA4 / Meta / Google Ads (ou à un serveur intermédiaire).

Pour un contrôle fin (GA4, Meta, Google Ads dans un seul pixel, avec respect du consentement), un **pixel personnalisé** (Custom Pixel) est souvent utilisé.

### 2. Ordre des opérations : consentement puis pixels

Pour rester conforme :

1. **Avant tout pixel** : le consentement doit être connu par Shopify.
   - Le storefront Nuxt envoie l’utilisateur vers le checkout avec des paramètres d’URL (`consent_analytics`, `consent_marketing`, etc.).
   - Le script **shopify-consent-bridge.js** (ajouté au thème / checkout) lit ces paramètres et appelle **`Shopify.customerPrivacy.setTrackingConsent({ analytics, marketing, … })`**.
   - Une fois cette API appelée, Shopify met à jour l’état de consentement. Les pixels peuvent alors lire cet état.

2. **Dans le pixel** : ne déclencher l’envoi de données qu’**après** avoir vérifié le consentement.
   - Au chargement du pixel, lire l’état via **`init.customerPrivacy`**.
   - S’abonner aux changements avec **`customerPrivacy.subscribe('visitorConsentCollected', …)`**.
   - Pour chaque événement (ex. `checkout_completed`), **vérifier** `analyticsProcessingAllowed` / `marketingAllowed` avant d’envoyer à GA4 / Meta / Ads.

Si le script de propagation du consentement (bridge) s’exécute en premier sur la page de checkout, `setTrackingConsent` est appelé avant le chargement des pixels ; les pixels voient donc déjà le bon état dans `init.customerPrivacy`. Pour plus de sécurité, on vérifie quand même le consentement **à l’intérieur** du pixel avant chaque envoi.

### 3. Étapes dans l’admin Shopify (Custom Pixel)

1. Aller dans **Paramètres** → **Customer events**.
2. Cliquer sur **Add custom pixel** (ou « Ajouter un pixel personnalisé »).
3. Donner un nom (ex. « Grissini – GA4 + Meta + consent »).
4. Dans **Customer privacy** (paramètres du pixel) :
   - Cocher les catégories dont ce pixel a **besoin** pour s’exécuter (ex. **Analytics** pour GA4, **Marketing** pour Meta/Google Ads).  
   - Shopify peut alors ne charger le pixel que si le visiteur a consenti à au moins ces catégories (selon la config Shopify). En complément, **dans le code du pixel**, on vérifie encore une fois le consentement avant d’envoyer les données (voir exemple ci‑dessous).
5. Coller le code du pixel dans l’éditeur (voir `docs/shopify-pixel-example.js` pour un exemple complet).
6. **Enregistrer**, puis **Connect pixel** pour activer le pixel.

Important : retirer tout ancien code de tracking dans `theme.liquid`, `checkout.liquid` ou les paramètres de checkout pour éviter de compter deux fois les événements.

### 4. Événements à écouter (checkout)

À minima, pour le parcours checkout et l’achat :

| Événement Shopify        | Usage typique                    |
|--------------------------|----------------------------------|
| `checkout_started`       | Début du checkout (GA4 `begin_checkout`) |
| `checkout_completed`      | Achat (GA4 `purchase`, Meta `Purchase`, Google Ads conversion) |
| Éventuellement d’autres | `checkout_address_info_submitted`, `checkout_shipping_info_submitted`, `checkout_payment_info_submitted` pour les étapes intermédiaires. |

Le pixel s’abonne avec **`analytics.subscribe('checkout_completed', callback)`** (et idem pour les autres noms d’événements). Dans le `callback`, on lit le consentement, et on n’envoie à GA4/Meta/Ads que si le consentement correspond (analytics pour GA4, marketing pour Meta/Ads).

### 5. Exemple de code (résumé)

Un exemple complet est dans **`docs/shopify-pixel-example.js`**. Il :

- Lit **`init.customerPrivacy`** et, si disponible, s’abonne à **`visitorConsentCollected`** pour garder l’état à jour.
- Pour chaque événement (`checkout_started`, `checkout_completed`), **vérifie** `analyticsProcessingAllowed` / `marketingAllowed` avant d’envoyer.
- Appelle `gtag` / `fbq` si présents sur la page de checkout (il faut alors les charger côté thème/checkout), ou envoie les données vers un **backend** qui relaie en server-side (GA4 Measurement Protocol, Meta Conversions API, Google Ads offline) — plus fiable si vous ne chargez pas les scripts des plateformes sur le checkout.

Les IDs (GA4, Meta Pixel, Google Ads) sont à adapter dans le fichier ou via les paramètres du pixel.

### 6. Récapitulatif conformité

- **Consentement propagé** : script `shopify-consent-bridge.js` sur le checkout qui appelle `setTrackingConsent` avec les paramètres d’URL envoyés depuis le storefront.
- **Pixels conditionnés au consentement** : dans le code du pixel, ne pas envoyer de données sans vérifier `init.customerPrivacy` (et ses mises à jour via `visitorConsentCollected`).
- **Catégories** : analytics pour GA4, marketing pour Meta / Google Ads ; refléter les mêmes catégories que dans Cookie Information sur le storefront.

---

## Références

- [Cookie Information + GTM](https://support.cookieinformation.com/en/articles/5451615-integrate-cookie-information-consent-management-platform-with-google-tag-manager)
- [Google Tag Manager – Consent Mode](https://support.google.com/tagmanager/answer/14565698)
- [Shopify Customer Privacy API](https://shopify.dev/docs/api/customer-privacy)
- [Shopify Web Pixels / Customer Events](https://shopify.dev/docs/api/web-pixels-api)
